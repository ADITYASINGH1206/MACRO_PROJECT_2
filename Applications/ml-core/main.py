import cv2
import threading
import queue
import time
import requests
import os
import face_recognition
import numpy as np
from ultralytics import YOLO
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# --- Configuration & Secrets ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:3000/api/attendance")
COURSE_ID = os.getenv("ACTIVE_COURSE_ID", "test-course-id")
CAMERA_ID = int(os.getenv("CAMERA_ID", 0))

# Initialize Supabase Python Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Load YOLOv8 Model (will fallback to standard yolov8s if custom_weights.pt doesn't exist yet)
model_path = 'custom_weights.pt' if os.path.exists('custom_weights.pt') else 'yolov8s.pt'
print(f"[*] Loading YOLO model from {model_path}...")
yolo_model = YOLO(model_path)

# --- Multithreaded Camera Ingestion ---
class VideoCaptureThread:
    """Read frames as soon as they are available, keeping only most recent one"""
    def __init__(self, src=0):
        self.cap = cv2.VideoCapture(src)
        self.q = queue.Queue(maxsize=3)
        self.stopped = False
        self.t = threading.Thread(target=self.update, args=())
        self.t.daemon = True

    def start(self):
        self.t.start()
        return self

    def update(self):
        while True:
            if self.stopped:
                return
            if not self.q.full():
                ret, frame = self.cap.read()
                if not ret:
                    self.stop()
                    return
                self.q.put(frame)

    def read(self):
        return self.q.get()

    def stop(self):
        self.stopped = True
        self.cap.release()

# --- Vector Matching Logic ---
def get_enrolled_students(course_id):
    """Fetch structured embedding vectors from Supabase for all enrolled students"""
    if not supabase: return []
    try:
        response = supabase.table('enrollments').select('student_id, users(id, name, embedding)').eq('course_id', course_id).execute()
        students = []
        for row in response.data:
            user = row.get('users', {})
            if user and user.get('embedding'):
                parsed_embedding = np.array(eval(user['embedding']) if isinstance(user['embedding'], str) else user['embedding'])
                students.append({
                    'id': user['id'],
                    'name': user['name'],
                    'embedding': parsed_embedding
                })
        return students
    except Exception as e:
        print(f"[ERROR] Failed fetching enrollments from Supabase: {e}")
        return []

def match_face(face_encoding, enrolled_students, tolerance=0.6):
    """Similarity comparison using face_recognition Euclidean distances"""
    if not enrolled_students: return None
    
    known_encodings = [s['embedding'] for s in enrolled_students]
    matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=tolerance)
    face_distances = face_recognition.face_distance(known_encodings, face_encoding)
    
    best_match_index = np.argmin(face_distances)
    if matches[best_match_index]:
        return enrolled_students[best_match_index]
    return None

def send_attendance_payload(student_id):
    """Push standardized payload to Node.js backend"""
    payload = {
        "student_id": student_id,
        "course_id": COURSE_ID,
        "timestamp": time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime()),
        "status": "present",
        "confidence": 0.95
    }
    try:
        res = requests.post(BACKEND_API_URL, json=payload, timeout=2)
        if res.status_code in [200, 201]:
            print(f"[SUCCESS] Attendance securely forwarded to backend for {student_id}")
        elif res.status_code != 409: # 409 naturally happens due to DB composite unique constraints
            print(f"[API ERROR] HTTP {res.status_code} - {res.text}")
    except requests.exceptions.RequestException as e:
        print(f"[NETWORK ERROR] Could not reach backend Node API: {e}")

processed_students = set()

def main():
    print("[*] Starting Multi-Camera Facial Recognition Pipeline...")
    
    enrolled_students = get_enrolled_students(COURSE_ID)
    print(f"[*] Pre-loaded {len(enrolled_students)} enrolled pgvector embeddings for rapid indexing.")

    video_stream = VideoCaptureThread(src=CAMERA_ID).start()
    time.sleep(1.0) # Warm up camera sensor

    try:
        while True:
            if video_stream.stopped:
                break
            
            frame = video_stream.read()
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # 1. Advanced Deep Learning Object Detection using Custom YOLOv8
            results = yolo_model(frame, verbose=False)
            
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    conf = float(box.conf[0])
                    
                    if conf > 0.55: # Confidence Cutoff
                        # Crop exactly around YOLO inference rect
                        face_crop = rgb_frame[y1:y2, x1:x2]
                        if face_crop.size == 0: continue
                        
                        # 2. Extract Sub-Features for Spatial Matching
                        h, w, _ = face_crop.shape
                        encodings = face_recognition.face_encodings(face_crop, [(0, w, h, 0)])
                        
                        if encodings:
                            face_encoding = encodings[0]
                            
                            # 3. Process Embedding Matches against active memory cache (from DB)
                            match = match_face(face_encoding, enrolled_students)
                            label = "Scanning..."
                            color = (0, 165, 255) # Orange default
                            
                            if match:
                                label = f"Verified: {match['name']}"
                                color = (0, 255, 100) # Green verified
                                s_id = match['id']
                                
                                # 4. Propagate successful hits to application boundary
                                if s_id not in processed_students:
                                    send_attendance_payload(s_id)
                                    processed_students.add(s_id)
                            
                            # Real-time GPU overlay updates
                            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 0.7, color, 1)

            cv2.imshow("Multi-Camera Surveillance Feed", frame)
            
            # Press 'q' to break loop cleanly
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except KeyboardInterrupt:
        print("\n[*] Pipeline manually terminated by user.")
    finally:
        video_stream.stop()
        cv2.destroyAllWindows()
        print("[*] Sensors offline. Graceful shutdown complete.")

if __name__ == "__main__":
    main()
