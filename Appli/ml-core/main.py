import cv2
import threading
import numpy as np
from ultralytics import YOLO
import face_recognition
import requests
import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime
import time

load_dotenv()

# --- Config ---
BACKEND_API_URL = "http://localhost:5000/api/attendance/live"
DB_HOST = os.getenv("DB_HOST", "aws-0-eu-central-1.pooler.supabase.com")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres.your_project")
DB_PASSWORD = os.getenv("DB_PASSWORD", "your_password")
DB_PORT = os.getenv("DB_PORT", "6543")

MATCH_THRESHOLD = 0.6  # lower is stricter

# Load YOLOv8 model for face detection (using predefined custom weights)
# Defaulting to standard YOLOv8n if custom isn't found locally just for placeholder
try:
    model = YOLO("custom_weights.pt")
except Exception as e:
    print("Warning: custom_weights.pt not found, defaulting to yolov8n.pt")
    model = YOLO("yolov8n.pt") 

# Database Connection Logic
def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT
    )

def match_face_embedding(embedding_vector):
    """
    Checks the embedding vector against the pgvector database utilizing cosine distance.
    Returns the student_id_number if matched, else None.
    """
    # Convert numpy array to list for SQL interpolation
    vector_list = embedding_vector.tolist()
    vector_str = "[" + ",".join(map(str, vector_list)) + "]"
    
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # We query the student_profiles table and order by vector distance (<=> for cosine distance)
        # Limit 1, and ensure distance is less than our threshold.
        query = f"""
            SELECT student_id_number, facial_embedding <=> '{vector_str}' AS distance
            FROM public.student_profiles
            ORDER BY distance ASC
            LIMIT 1;
        """
        cur.execute(query)
        result = cur.fetchone()
        
        if result:
            student_id = result[0]
            distance = result[1]
            if distance < MATCH_THRESHOLD:
                return student_id
        return None
    except Exception as e:
        print(f"Database Matching Error: {e}")
        return None
    finally:
        if conn:
            conn.close()

def send_attendance_payload(student_id, course_id="COURSE_101"):
    payload = {
        "student_id": student_id,  # Typically maps to UUID. Adjust if it expects UUID.
        "course_id": course_id,    # Placeholder: Map to actual Course UUID
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "status": "present"
    }
    try:
        res = requests.post(BACKEND_API_URL, json=payload, timeout=2)
        if res.status_code == 201:
            print(f"✅ Logged attendance for {student_id}")
        else:
            print(f"⚠️ Failed to log attendance for {student_id}: {res.text}")
    except Exception as e:
        print(f"Network error sending payload: {e}")

# Processor Thread Function
def process_camera_feed(camera_id, rtsp_url):
    print(f"Starting camera thread: {camera_id} - {rtsp_url}")
    cap = cv2.VideoCapture(rtsp_url)
    
    # Store recently recognized to prevent spamming backend
    recently_recognized = {}
    cooldown_seconds = 300 # 5 minutes
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print(f"Camera {camera_id} disconnected, reconnecting...")
            time.sleep(2)
            cap = cv2.VideoCapture(rtsp_url)
            continue
            
        # 1. Use YOLO to detect faces in real-time
        results = model(frame, verbose=False)
        
        # Iterate through detected human faces
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # bounding box: x1, y1, x2, y2
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                
                # Crop face padding securely
                face_crop = frame[max(0, y1-10):min(frame.shape[0], y2+10), 
                                  max(0, x1-10):min(frame.shape[1], x2+10)]
                
                # 2. Extract facial embeddings
                # Convert BGR to RGB for face_recognition
                rgb_crop = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)
                
                # Check if a face is actually found by dlib
                face_locations = face_recognition.face_locations(rgb_crop)
                if face_locations:
                    face_encodings = face_recognition.face_encodings(rgb_crop, face_locations)
                    if face_encodings:
                        embedding = face_encodings[0]
                        
                        # 3. Match against db
                        matched_id = match_face_embedding(embedding)
                        
                        if matched_id:
                            now = time.time()
                            # 4. Debounce and send payload
                            if matched_id not in recently_recognized or (now - recently_recognized[matched_id] > cooldown_seconds):
                                recently_recognized[matched_id] = now
                                send_attendance_payload(matched_id)
                                
                            # Draw bounding box (optional, for debug view)
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                            cv2.putText(frame, matched_id, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                        else:
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                            cv2.putText(frame, "Unknown", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

        # Show feed (remove in pure headless deployment)
        cv2.imshow(f"Camera {camera_id}", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    # Example Camera Feeds (0 is local webcam, can be RSTP links)
    cameras = [
        {"id": "Cam_01", "url": 0},
        # {"id": "Cam_02", "url": "rtsp://username:password@192.168.1.100:554/stream1"}
    ]
    
    threads = []
    for cam in cameras:
        t = threading.Thread(target=process_camera_feed, args=(cam["id"], cam["url"]))
        t.daemon = True
        t.start()
        threads.append(t)
        
    for t in threads:
        t.join()
