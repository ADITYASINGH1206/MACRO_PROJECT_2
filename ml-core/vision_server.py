import cv2
import numpy as np
import base64
import json
import os
import time
import requests
import face_recognition
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from concurrent.futures import ThreadPoolExecutor
from ultralytics import YOLO
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# --- Configuration & Secrets ---
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_CORE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(ML_CORE_DIR, ".env"))

print(f"[DEBUG] Vision Server starting...")
print(f"[DEBUG] CWD: {os.getcwd()}")
print(f"[DEBUG] Script Dir: {ML_CORE_DIR}")
print(f"[DEBUG] Projected Root: {ROOT_DIR}")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:3000/api/attendance")
COURSE_ID = os.getenv("ACTIVE_COURSE_ID", "test-course-id")

# Initialize Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Load YOLOv8 (Safe deferred loading)
yolo_model = None

# --- App Initialization ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok", "engine": "active", "students": len(enrolled_students)}

# Global State
enrolled_students = []
processed_students = set()
attendance_executor = ThreadPoolExecutor(max_workers=3)

# --- Helper Functions ---
# --- Helper Functions ---
def get_enrolled_students(course_id):
    if not supabase: return []
    try:
        # Join enrollments with face_data and profiles
        # We query enrollments table, and nest face_data and profiles
        query = supabase.table('enrollments').select(
            'course_id, profiles!inner(id, full_name), face_data:profiles!inner(face_data(user_id, embedding))'
        ).eq('course_id', course_id)
        
        # Simpler alternative if the above join is too complex for the client library:
        # Just fetch all and filter, or fetch enrollments and then face_data.
        # Let's try a direct query on face_data but filtered by a subquery or join if possible.
        # For now, let's fetch all facial data but filter by the list of student IDs in that course.
        
        enroll_res = supabase.table('enrollments').select('student_id').eq('course_id', course_id).execute()
        student_ids = [e['student_id'] for e in enroll_res.data]
        
        if not student_ids:
            return []

        response = supabase.table('face_data').select('user_id, embedding, profiles(full_name)').in_('user_id', student_ids).execute()
        
        students = []
        for row in response.data:
            profile = row.get('profiles') or {}
            name = profile.get('full_name', 'Unknown')
            if row.get('embedding'):
                parsed_embedding = np.array(eval(row['embedding']) if isinstance(row['embedding'], str) else row['embedding'])
                students.append({
                    'id': row['user_id'],
                    'name': name,
                    'embedding': parsed_embedding
                })
        return students
    except Exception as e:
        print(f"[ERROR] Syncing vectors: {e}")
        return []

def match_face(face_encoding, enrolled_students, tolerance=0.6):
    if not enrolled_students: return None
    known_encodings = [s['embedding'] for s in enrolled_students]
    matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=tolerance)
    face_distances = face_recognition.face_distance(known_encodings, face_encoding)
    
    if len(face_distances) == 0:
        return None
        
    best_match_index = np.argmin(face_distances)
    if matches[best_match_index]:
        return enrolled_students[best_match_index]
    return None

def send_attendance_payload(student_id, course_id):
    payload = {
        "student_id": student_id,
        "course_id": course_id,
        "timestamp": time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime()),
        "status": "present",
        "confidence": 0.95
    }
    try:
        res = requests.post(BACKEND_API_URL, json=payload, timeout=2)
        if res.status_code in [200, 201]:
            print(f"[SUCCESS] Attendance logged for {student_id} in {course_id}")
    except Exception as e:
        print(f"[NETWORK ERROR] {e}")

# --- WebSocket Handler ---
@app.on_event("startup")
async def startup():
    global yolo_model
    try:
        print("[*] Initializing YOLOv8 Neural Engine...")
        model_path = os.path.join(ROOT_DIR, 'best.pt')
        if not os.path.exists(model_path):
            model_path = os.path.join(ROOT_DIR, 'yolov8s.pt')
        yolo_model = YOLO(model_path)
        print(f"[*] Neural Engine Online.")
    except Exception as e:
        print(f"[CRITICAL FAILURE] Startup failed: {e}")
        os._exit(1)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Accept course_id from query or initial message
    course_id = websocket.query_params.get("course_id", COURSE_ID)
    print(f"[WS] High-speed link established for context: {course_id}")
    
    # Session State
    session_processed_students = set()
    session_enrolled_students = get_enrolled_students(course_id)
    print(f"[*] Sync complete. {len(session_enrolled_students)} records for course {course_id}")

    try:
        while True:
            # Receive base64 frame from browser
            data = await websocket.receive_text()
            if not data or ',' not in data: continue
            
            try:
                header, encoded = data.split(",", 1)
                image_bytes = base64.b64decode(encoded)
            except Exception:
                continue
            
            # Decode to CV2
            nparr = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if frame is None: continue
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = yolo_model(frame, verbose=False)
            metadata = []

            for result in results:
                for box in result.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    conf = float(box.conf[0])
                    
                    if conf > 0.5:
                        face_crop = rgb_frame[y1:y2, x1:x2]
                        if face_crop.size == 0: continue
                        face_crop = np.ascontiguousarray(face_crop)
                        
                        h, w, _ = face_crop.shape
                        encodings = face_recognition.face_encodings(face_crop, [(0, w, h, 0)])
                        
                        label = "Scanning..."
                        color = "#ff8c00" # Orange
                        
                        if encodings:
                            match = match_face(encodings[0], session_enrolled_students)
                            if match:
                                label = f"Verified: {match['name']}"
                                color = "#4edea3" # Emerald Green
                                s_id = match['id']
                                if s_id not in session_processed_students:
                                    session_processed_students.add(s_id)
                                    attendance_executor.submit(send_attendance_payload, s_id, course_id)
                        
                        metadata.append({
                            "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                            "label": label, "color": color
                        })

            await websocket.send_json(metadata)

    except WebSocketDisconnect:
        print(f"[WS] Client disconnected from {course_id}")
    except Exception as e:
        print(f"[WS ERROR] {e}")

if __name__ == "__main__":
    import uvicorn
    print("[*] Starting Vision Engine on http://0.0.0.0:8008")
    uvicorn.run(app, host="0.0.0.0", port=8008, log_level="info")
