import cv2
import numpy as np
import base64
import os
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from dotenv import load_dotenv

# Import the tracked pipeline (all recognition + consensus logic lives there)
from tracked_pipeline import (
    TrackedAttendancePipeline,
    get_enrolled_students,
)

load_dotenv()

# --- Configuration & Secrets ---
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_CORE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(ML_CORE_DIR, ".env"))

print(f"[DEBUG] Vision Server starting...")
print(f"[DEBUG] CWD: {os.getcwd()}")
print(f"[DEBUG] Script Dir: {ML_CORE_DIR}")
print(f"[DEBUG] Projected Root: {ROOT_DIR}")

BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:3000/api/attendance")
COURSE_ID = os.getenv("ACTIVE_COURSE_ID", "test-course-id")

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
    return {"status": "ok", "engine": "tracked-bytetrack"}


# --- Startup: Load YOLO model once ---
@app.on_event("startup")
async def startup():
    global yolo_model
    try:
        print("[*] Initializing YOLOv8 Neural Engine (ByteTrack mode)...")
        model_path = os.path.join(ROOT_DIR, 'best.pt')
        if not os.path.exists(model_path):
            model_path = os.path.join(ROOT_DIR, 'yolov8s.pt')
        yolo_model = YOLO(model_path)
        print(f"[*] Neural Engine Online.  Tracker: bytetrack.yaml")
    except Exception as e:
        print(f"[CRITICAL FAILURE] Startup failed: {e}")
        os._exit(1)


# --- WebSocket Handler (now uses TrackedAttendancePipeline) ---
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    # Accept course_id from query param or fallback
    course_id = websocket.query_params.get("course_id", COURSE_ID)
    print(f"[WS] High-speed link established for context: {course_id}")

    # Fetch enrolled students for this session
    session_enrolled = get_enrolled_students(course_id)
    print(f"[*] Sync complete. {len(session_enrolled)} face embeddings for course {course_id}")

    # Build a per-session tracked pipeline
    pipeline = TrackedAttendancePipeline(
        yolo_model=yolo_model,
        enrolled_students=session_enrolled,
        course_id=course_id,
        backend_url=BACKEND_API_URL,
    )

    try:
        while True:
            # Receive base64 frame from the browser
            data = await websocket.receive_text()
            if not data or ',' not in data:
                continue

            try:
                _header, encoded = data.split(",", 1)
                image_bytes = base64.b64decode(encoded)
            except Exception:
                continue

            # Decode to OpenCV mat
            nparr = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if frame is None:
                continue

            # --- Run the tracked pipeline (ByteTrack + recognition cache) ---
            metadata = pipeline.process_frame(frame)

            await websocket.send_json(metadata)

    except WebSocketDisconnect:
        print(f"[WS] Client disconnected from {course_id}")
    except Exception as e:
        print(f"[WS ERROR] {e}")
    finally:
        pipeline.shutdown()


if __name__ == "__main__":
    import uvicorn
    print("[*] Starting Vision Engine on http://0.0.0.0:8008")
    uvicorn.run(app, host="0.0.0.0", port=8008, log_level="info")
