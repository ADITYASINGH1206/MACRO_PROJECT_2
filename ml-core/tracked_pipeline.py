"""
tracked_pipeline.py – High Performance YOLOv8 ByteTrack + Threaded Video + Cosine Similarity
===========================================================================================
Implements the high-performance Face Attendance pipeline solving camera latency and ID switching.
"""

import cv2
import numpy as np
import os
import time
import requests
import queue
import threading
import face_recognition
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from ultralytics import YOLO
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
#  Configuration Constants
# ---------------------------------------------------------------------------
ML_CORE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BYTETRACK_CFG    = os.path.join(ML_CORE_DIR, "bytetrack.yaml")
REQUIRED_HITS    = 3        # Cosine similarity success required before marking Present
SKIP_FRAMES      = 10       # Skip recognition for 10 frames after an attempt
COSINE_THRESHOLD = 0.45     # Custom Cosine Similarity Acceptance Threshold
CROP_MARGIN      = 0.15     # 15% margin for face bounding box cropping

SUPABASE_URL     = os.getenv("SUPABASE_URL")
SUPABASE_KEY     = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
BACKEND_API_URL  = os.getenv("BACKEND_API_URL", "http://localhost:3000/api/attendance")
COURSE_ID        = os.getenv("ACTIVE_COURSE_ID", "test-course-id")

VIDEO_SOURCE = os.getenv("VIDEO_SOURCE")
if VIDEO_SOURCE and os.path.exists(os.path.join(ML_CORE_DIR, VIDEO_SOURCE)):
    CAMERA_ID = os.path.join(ML_CORE_DIR, VIDEO_SOURCE)
else:
    try:
        CAMERA_ID = int(os.getenv("CAMERA_ID", 0))
    except (ValueError, TypeError):
        CAMERA_ID = 0

# ---------------------------------------------------------------------------
#  Supabase & DB Helpers
# ---------------------------------------------------------------------------
supabase: Client = (
    create_client(SUPABASE_URL, SUPABASE_KEY)
    if SUPABASE_URL and SUPABASE_KEY
    else None
)

def get_enrolled_students(course_id: str) -> list[dict]:
    """Fetch face embeddings for all students enrolled."""
    if not supabase:
        return []
    try:
        enroll_res = supabase.table("enrollments").select("student_id").eq("course_id", course_id).execute()
        student_ids = [e["student_id"] for e in enroll_res.data]
        if not student_ids:
            return []

        response = supabase.table("face_data").select("user_id, embedding, profiles(full_name)").in_("user_id", student_ids).execute()

        students = []
        for row in response.data:
            profile = row.get("profiles") or {}
            name = profile.get("full_name", "Unknown")
            emb = row.get("embedding")
            if emb:
                parsed = np.array(eval(emb) if isinstance(emb, str) else emb)
                students.append({"id": row["user_id"], "name": name, "embedding": parsed})
        return students
    except Exception as e:
        print(f"[ERROR] Fetching face data: {e}")
        return []

# ---------------------------------------------------------------------------
#  Cosine Similarity Logic
# ---------------------------------------------------------------------------
def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    """Calculate the cosine similarity between two vectors."""
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return dot_product / (norm_v1 * norm_v2)

def match_face_cosine(encoding: np.ndarray, enrolled: list[dict], threshold: float = COSINE_THRESHOLD):
    """Return the best-matching enrolled student using cosine similarity."""
    if not enrolled:
        return None
    
    best_match = None
    best_score = -1.0
    
    for student in enrolled:
        score = cosine_similarity(encoding, student["embedding"])
        if score > best_score:
            best_score = score
            best_match = student
            
    if best_score > threshold:
        return best_match
    return None

def crop_with_margin(rgb_frame, x1, y1, x2, y2, margin=CROP_MARGIN):
    """Crop bounding box with an extra % margin."""
    h_img, w_img, _ = rgb_frame.shape
    w, h = x2 - x1, y2 - y1
    
    x_margin = int(w * margin)
    y_margin = int(h * margin)
    
    nx1 = max(0, x1 - x_margin)
    ny1 = max(0, y1 - y_margin)
    nx2 = min(w_img, x2 + x_margin)
    ny2 = min(h_img, y2 + y_margin)
    
    return rgb_frame[ny1:ny2, nx1:nx2]

# ---------------------------------------------------------------------------
#  Camera Threading (Solves Latency)
# ---------------------------------------------------------------------------
class VideoCaptureThread:
    """Continuously reads frames from the camera, keeping only the freshest frame to prevent buffer lag."""
    def __init__(self, src=0):
        self.cap = cv2.VideoCapture(src)
        self.q = queue.Queue(maxsize=3)
        self.stopped = False
        self.thread = threading.Thread(target=self._update, args=())
        self.thread.daemon = True

    def start(self):
        self.thread.start()
        return self

    def _update(self):
        while not self.stopped:
            ret, frame = self.cap.read()
            if not ret:
                self.stop()
                break
            
            # If the queue is full, aggressively drop the oldest frame
            if self.q.full():
                try:
                    self.q.get_nowait()
                except queue.Empty:
                    pass
            self.q.put(frame)

    def read(self):
        return self.q.get()

    def stop(self):
        self.stopped = True
        if self.cap.isOpened():
            self.cap.release()

# ---------------------------------------------------------------------------
#  Tracked Attendance Pipeline
# ---------------------------------------------------------------------------
class TrackedAttendancePipeline:
    def __init__(self, yolo_model: YOLO, enrolled_students: list[dict], course_id: str, backend_url: str = BACKEND_API_URL):
        self.model            = yolo_model
        self.enrolled         = enrolled_students
        self.course_id        = course_id
        self.backend_url      = backend_url

        self.identity_cache: dict[int, dict]  = {}    # track_id → student
        self.identity_hits:  dict[int, int]   = defaultdict(int) # track_id -> hit count
        self.skip_frames:    dict[int, int]   = defaultdict(int) # track_id -> frames left to skip
        self.confirmed_ids:  set[str]         = set() # student ids marked present

        self._executor = ThreadPoolExecutor(max_workers=3)

    def process_frame(self, frame: np.ndarray) -> list[dict]:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # 1. YOLOv8 track mode (Persist=True, ByteTrack algorithm)
        results = self.model.track(
            source=frame,
            persist=True,
            tracker=BYTETRACK_CFG,
            verbose=False,
        )

        metadata: list[dict] = []
        active_track_ids: set[int] = set()

        for result in results:
            boxes = result.boxes
            if boxes is None or boxes.id is None:
                continue

            for box_xyxy, conf_t, track_id_t in zip(boxes.xyxy, boxes.conf, boxes.id):
                x1, y1, x2, y2 = map(int, box_xyxy)
                conf   = float(conf_t)
                tid    = int(track_id_t)

                if conf < 0.30:
                    continue

                active_track_ids.add(tid)
                
                label = "Scanning…"
                color = "#ff8c00"   # Orange
                
                hits = self.identity_hits[tid]

                if tid in self.identity_cache and hits >= REQUIRED_HITS:
                    # Target identified and consensus reached. Tracking runs free.
                    student = self.identity_cache[tid]
                    label = f"Verified: {student['name']}"
                    color = "#4edea3"  # Emerald

                else:
                    target_identified = False
                    if tid in self.identity_cache:
                        # Partial matches visualization
                        student = self.identity_cache[tid]
                        label = f"Verifying ({hits}/{REQUIRED_HITS})"
                        color = "#f2ca44" # Yellow
                    
                    if self.skip_frames[tid] > 0:
                        self.skip_frames[tid] -= 1
                    else:
                        # 3. Apply 15% Margin Crop
                        face_crop = crop_with_margin(rgb, x1, y1, x2, y2, margin=CROP_MARGIN)
                        if face_crop.size > 0:
                            face_crop = np.ascontiguousarray(face_crop)
                            h, w, _ = face_crop.shape
                            encodings = face_recognition.face_encodings(face_crop, [(0, w, h, 0)])
                            
                            if encodings:
                                # 4. Cosine Similarity Matching
                                match = match_face_cosine(encodings[0], self.enrolled, threshold=COSINE_THRESHOLD)
                                if match:
                                    # We have a match! 
                                    if tid not in self.identity_cache:
                                        self.identity_cache[tid] = match
                                        
                                    # Ensure it's the same person before incrementing
                                    if self.identity_cache[tid]['id'] == match['id']:
                                        self.identity_hits[tid] += 1
                                        hits = self.identity_hits[tid]
                                    else:
                                        # ID switch within track? Start over
                                        self.identity_cache[tid] = match
                                        self.identity_hits[tid] = 1
                                        hits = 1
                                    
                                    # 5. Send attendance once target is reached
                                    if hits >= REQUIRED_HITS:
                                        sid = match["id"]
                                        if sid not in self.confirmed_ids:
                                            self.confirmed_ids.add(sid)
                                            self._executor.submit(self._send_attendance, sid, match["name"])
                                        target_identified = True
                                        
                            # After attempting recognition, skip the next 10 frames for this ID
                            # If target is already identified (hits >= 3), it stays identified and we never enter this block again.
                            if not target_identified:
                                self.skip_frames[tid] = SKIP_FRAMES

                metadata.append({
                    "track_id": tid,
                    "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                    "label": label,
                    "color": color,
                    "hits": hits,
                })

        self._prune_stale_tracks(active_track_ids)
        return metadata

    def shutdown(self):
        self._executor.shutdown(wait=True)

    def _prune_stale_tracks(self, active_ids: set[int]):
        """Clean track state only when YOLO loses track."""
        stale = set(self.identity_hits.keys()) - active_ids
        for tid in stale:
            self.identity_hits.pop(tid, None)
            self.skip_frames.pop(tid, None)
            # identity_cache is intentionally left alive longer just in case ByteTrack reassigns
            # after brief occlusion, though ByteTrack usually generates a new ID.

    def _send_attendance(self, student_id: str, name: str):
        """Push attendance directly after 3 successful frame matches."""
        payload = {
            "student_id": student_id,
            "course_id":  self.course_id,
            "timestamp":  time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
            "status":     "present",
            "confidence": 0.95,
        }
        try:
            res = requests.post(self.backend_url, json=payload, timeout=2)
            if res.status_code in (200, 201):
                print(f"[SUCCESS] Attendance logged for {name}")
        except requests.exceptions.RequestException as e:
            print(f"[API ERROR] {e}")


# ---------------------------------------------------------------------------
#  Standalone Runner execution
# ---------------------------------------------------------------------------
def main():
    print("=" * 60)
    print("  High-Performance YOLOv8 Tracker (Cosine Sim + Threaded)")
    print("=" * 60)

    model_path = os.path.join(ROOT_DIR, "best.pt")
    if not os.path.exists(model_path):
        model_path = os.path.join(ROOT_DIR, "yolov8s.pt")
        if not os.path.exists(model_path):
            model_path = "yolov8s.pt"

    yolo_model = YOLO(model_path)
    enrolled = get_enrolled_students(COURSE_ID)
    print(f"[*] Loaded {len(enrolled)} enrolled face embeddings.")

    pipeline = TrackedAttendancePipeline(
        yolo_model=yolo_model,
        enrolled_students=enrolled,
        course_id=COURSE_ID,
    )

    # Use Threaded Camera for Zero-Lag (Frame-Dropper Queue)
    print(f"[*] Starting camera thread on source {CAMERA_ID}...")
    video_stream = VideoCaptureThread(src=CAMERA_ID).start()
    time.sleep(1.0) # Warm up

    try:
        while True:
            # Main thread receives the freshest frame instantly
            frame = video_stream.read()
            if frame is None:
                break
                
            frame = cv2.resize(frame, (640, 480))
            detections = pipeline.process_frame(frame)

            for det in detections:
                x1, y1, x2, y2 = det["x1"], det["y1"], det["x2"], det["y2"]
                label = det["label"]
                hex_c = det["color"].lstrip("#")
                bgr = tuple(int(hex_c[i:i+2], 16) for i in (4, 2, 0))

                cv2.rectangle(frame, (x1, y1), (x2, y2), bgr, 2)
                cv2.putText(
                    frame,
                    f"[T{det['track_id']}] {label}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_DUPLEX, 0.55, bgr, 1,
                )

            cv2.imshow("ByteTrack Pipeline feed", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    except KeyboardInterrupt:
        print("\n[*] Interrupted by user.")
    finally:
        pipeline.shutdown()
        video_stream.stop()
        cv2.destroyAllWindows()
        print("[*] Pipeline shutdown complete.")

if __name__ == "__main__":
    main()
