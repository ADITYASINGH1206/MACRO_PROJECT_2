"""
tracked_pipeline.py – YOLOv8 ByteTrack Face-Tracking Pipeline
=============================================================
Replaces the previous stateless `yolo_model(frame)` predict-mode calls with
`yolo_model.track(...)` + ByteTrack, giving each face a persistent integer
track_id across frames.

Key design decisions:
  1. `persist=True`  → YOLO's internal tracker state survives between calls,
     keeping IDs stable across the entire video session.
  2. `bytetrack.yaml` → custom thresholds tuned for slightly-blurry classroom
     faces (lower high/low thresh) and generous track_buffer (60 frames).
  3. Recognition cache (`track_id → student`) → the heavy face_recognition
     model only runs when a track_id has NOT yet been identified. Once matched,
     the tracker carries the identity for free.
  4. Frame-buffer consensus → a track must survive ≥ CONFIRM_FRAMES (default 5)
     consecutive frames before being marked "present" in the DB, eliminating
     false-positive flash detections.

Usage (standalone):
    python tracked_pipeline.py

Usage (import into vision_server.py):
    from tracked_pipeline import TrackedAttendancePipeline
    pipeline = TrackedAttendancePipeline(yolo_model, enrolled_students, course_id)
    metadata = pipeline.process_frame(frame)
"""

import cv2
import numpy as np
import os
import time
import requests
import face_recognition
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from ultralytics import YOLO
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
#  Constants
# ---------------------------------------------------------------------------
ML_CORE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BYTETRACK_CFG    = os.path.join(ML_CORE_DIR, "bytetrack.yaml")
CONFIRM_FRAMES   = 5        # Minimum consecutive frames before marking present
RECOG_INTERVAL   = 3        # Only run recognition every N frames (perf tuning)
RECOG_TOLERANCE  = 0.55     # face_recognition Euclidean distance threshold

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
#  Supabase helpers (unchanged from original)
# ---------------------------------------------------------------------------
supabase: Client = (
    create_client(SUPABASE_URL, SUPABASE_KEY)
    if SUPABASE_URL and SUPABASE_KEY
    else None
)


def get_enrolled_students(course_id: str) -> list[dict]:
    """Fetch face embeddings for all students enrolled in *course_id*."""
    if not supabase:
        return []
    try:
        enroll_res = (
            supabase.table("enrollments")
            .select("student_id")
            .eq("course_id", course_id)
            .execute()
        )
        student_ids = [e["student_id"] for e in enroll_res.data]
        if not student_ids:
            return []

        response = (
            supabase.table("face_data")
            .select("user_id, embedding, profiles(full_name)")
            .in_("user_id", student_ids)
            .execute()
        )

        students = []
        for row in response.data:
            profile = row.get("profiles") or {}
            name = profile.get("full_name", "Unknown")
            emb = row.get("embedding")
            if emb:
                parsed = np.array(
                    eval(emb) if isinstance(emb, str) else emb
                )
                students.append(
                    {"id": row["user_id"], "name": name, "embedding": parsed}
                )
        return students
    except Exception as e:
        print(f"[ERROR] Fetching face data: {e}")
        return []


def match_face(encoding: np.ndarray, enrolled: list[dict], tolerance: float = RECOG_TOLERANCE):
    """Return the best-matching enrolled student, or None."""
    if not enrolled:
        return None
    known = [s["embedding"] for s in enrolled]
    distances = face_recognition.face_distance(known, encoding)
    best_idx = int(np.argmin(distances))
    if distances[best_idx] <= tolerance:
        return enrolled[best_idx]
    return None


# ---------------------------------------------------------------------------
#  Core Tracked Pipeline
# ---------------------------------------------------------------------------
class TrackedAttendancePipeline:
    """
    Wraps YOLOv8 `.track()` calls and maintains three runtime caches:

    identity_cache : dict[int, dict]
        Maps  track_id → matched student dict  once a face has been
        recognized.  Identity is *never* re-queried after caching,
        so the expensive recognition model is amortized.

    frame_counter : dict[int, int]
        Maps  track_id → number of consecutive frames the track has
        been alive.  A track must reach CONFIRM_FRAMES before an
        attendance record is sent.

    confirmed_ids : set[str]
        Student IDs that have already been sent to the backend in
        this session.  Prevents duplicate attendance records.
    """

    def __init__(
        self,
        yolo_model: YOLO,
        enrolled_students: list[dict],
        course_id: str,
        backend_url: str = BACKEND_API_URL,
        confirm_frames: int = CONFIRM_FRAMES,
    ):
        self.model            = yolo_model
        self.enrolled         = enrolled_students
        self.course_id        = course_id
        self.backend_url      = backend_url
        self.confirm_frames   = confirm_frames

        # Runtime caches ------------------------------------------------
        self.identity_cache: dict[int, dict]  = {}    # track_id → student
        self.frame_counter:  dict[int, int]   = defaultdict(int)
        self.confirmed_ids:  set[str]         = set() # student ids sent

        # Background network pool
        self._executor = ThreadPoolExecutor(max_workers=3)
        self._global_frame_idx = 0

    # ------------------------------------------------------------------
    #  Public API
    # ------------------------------------------------------------------
    def process_frame(self, frame: np.ndarray) -> list[dict]:
        """
        Run one frame through the tracker + recognition pipeline.

        Returns a list of dicts suitable for JSON serialization / CV2 overlay:
            [{ "track_id": int, "x1": int, …, "label": str, "color": str }, …]
        """
        self._global_frame_idx += 1
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # ----- 1. YOLOv8 track mode ------------------------------------
        results = self.model.track(
            source=frame,
            persist=True,                  # keep tracker state between calls
            tracker=BYTETRACK_CFG,         # custom thresholds
            verbose=False,
        )

        metadata: list[dict] = []
        active_track_ids: set[int] = set()

        for result in results:
            boxes = result.boxes
            if boxes is None or boxes.id is None:
                continue   # no tracked detections this frame

            for box_xyxy, conf_t, track_id_t in zip(
                boxes.xyxy, boxes.conf, boxes.id
            ):
                x1, y1, x2, y2 = map(int, box_xyxy)
                conf   = float(conf_t)
                tid    = int(track_id_t)

                if conf < 0.30:
                    continue  # below usable quality

                active_track_ids.add(tid)
                self.frame_counter[tid] += 1

                # ----- 2. Identity resolution ----------------------------
                label = "Scanning…"
                color = "#ff8c00"   # orange

                if tid in self.identity_cache:
                    # Already recognized — FREE identity from cache
                    student = self.identity_cache[tid]
                    label = f"Verified: {student['name']}"
                    color = "#4edea3"  # emerald

                elif self._should_recognize():
                    # Run the heavy recognition model
                    face_crop = rgb[y1:y2, x1:x2]
                    if face_crop.size > 0:
                        face_crop = np.ascontiguousarray(face_crop)
                        h, w, _ = face_crop.shape
                        encodings = face_recognition.face_encodings(
                            face_crop, [(0, w, h, 0)]
                        )
                        if encodings:
                            student = match_face(encodings[0], self.enrolled)
                            if student:
                                self.identity_cache[tid] = student
                                label = f"Verified: {student['name']}"
                                color = "#4edea3"

                # ----- 3. Frame-buffer consensus -------------------------
                if tid in self.identity_cache:
                    student = self.identity_cache[tid]
                    sid     = student["id"]

                    if (
                        self.frame_counter[tid] >= self.confirm_frames
                        and sid not in self.confirmed_ids
                    ):
                        self.confirmed_ids.add(sid)
                        self._executor.submit(
                            self._send_attendance, sid, student["name"]
                        )

                metadata.append({
                    "track_id": tid,
                    "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                    "label": label,
                    "color": color,
                    "frames_alive": self.frame_counter[tid],
                })

        # ----- 4. Prune stale tracks ------------------------------------
        self._prune_stale_tracks(active_track_ids)

        return metadata

    def shutdown(self):
        """Flush pending network requests on clean exit."""
        self._executor.shutdown(wait=True)

    # ------------------------------------------------------------------
    #  Private helpers
    # ------------------------------------------------------------------
    def _should_recognize(self) -> bool:
        """Throttle the heavy recognition model to every Nth frame."""
        return self._global_frame_idx % RECOG_INTERVAL == 0

    def _prune_stale_tracks(self, active_ids: set[int]):
        """
        Remove tracks from caches that ByteTrack no longer reports.
        The tracker internally handles re-association via track_buffer,
        but our caches should stay in sync.
        """
        stale = set(self.frame_counter.keys()) - active_ids
        for tid in stale:
            self.frame_counter.pop(tid, None)
            # Keep identity_cache entries slightly longer — if ByteTrack
            # re-assigns the same ID after a brief occlusion, we still
            # have the identity.  The entry will naturally become
            # unreachable once YOLO never outputs that ID again.

    def _send_attendance(self, student_id: str, name: str):
        """Push attendance record to the Node.js backend."""
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
                print(f"[TRACKED ✓] Attendance confirmed for {name} ({student_id})")
            elif res.status_code != 409:
                print(f"[API ERROR] HTTP {res.status_code} – {res.text}")
        except requests.exceptions.RequestException as e:
            print(f"[NETWORK ERROR] {e}")


# ---------------------------------------------------------------------------
#  Standalone runner (OpenCV window + local camera)
# ---------------------------------------------------------------------------
def main():
    print("=" * 60)
    print("  YOLOv8 ByteTrack Attendance Pipeline")
    print("=" * 60)

    # Load model
    model_path = os.path.join(ROOT_DIR, "best.pt")
    if not os.path.exists(model_path):
        model_path = os.path.join(ROOT_DIR, "yolov8s.pt")
    if not os.path.exists(model_path):
        model_path = "yolov8s.pt"

    print(f"[*] Loading YOLO model: {model_path}")
    yolo_model = YOLO(model_path)

    # Fetch enrolled embeddings
    enrolled = get_enrolled_students(COURSE_ID)
    print(f"[*] Loaded {len(enrolled)} enrolled face embeddings.")

    # Build pipeline
    pipeline = TrackedAttendancePipeline(
        yolo_model=yolo_model,
        enrolled_students=enrolled,
        course_id=COURSE_ID,
    )

    # Open camera
    cap = cv2.VideoCapture(CAMERA_ID)
    if not cap.isOpened():
        print("[FATAL] Cannot open camera / video source.")
        return

    print(f"[*] Camera live.  Press 'q' to quit.\n")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.resize(frame, (640, 480))
            detections = pipeline.process_frame(frame)

            # Draw overlays
            for det in detections:
                x1, y1, x2, y2 = det["x1"], det["y1"], det["x2"], det["y2"]
                label = det["label"]
                alive = det["frames_alive"]

                # Color: hex → BGR
                hex_c = det["color"].lstrip("#")
                bgr = tuple(int(hex_c[i:i+2], 16) for i in (4, 2, 0))

                cv2.rectangle(frame, (x1, y1), (x2, y2), bgr, 2)
                cv2.putText(
                    frame,
                    f"[T{det['track_id']}] {label}  ({alive}f)",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_DUPLEX, 0.55, bgr, 1,
                )

            cv2.imshow("ByteTrack Attendance Feed", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    except KeyboardInterrupt:
        print("\n[*] Interrupted by user.")
    finally:
        pipeline.shutdown()
        cap.release()
        cv2.destroyAllWindows()
        print("[*] Pipeline shutdown complete.")


if __name__ == "__main__":
    main()
