import cv2
import pandas as pd
import face_recognition
import os
import numpy as np
from datetime import datetime
from ultralytics import YOLO

class YOLOAttendanceSystem:
    def __init__(self, model_path='yolov8n-face.pt', image_folder="student_images", log_file="attendance_log.xlsx", video_source=0):
        self.image_folder = image_folder
        self.log_file = log_file
        self.video_source = video_source
        
        print(f"🔄 Loading yolo model from {model_path}...")
        try:
            self.model = YOLO(model_path)
            self.tracking_classes = None
        except Exception as e:
            print(f"⚠️ Error loading custom model: {e}")
            print("➡️ Switching to standard YOLOv8n (detects 'person').")
            self.model = YOLO("yolov8n.pt")
            self.tracking_classes = [0]

        self.known_face_encodings = []
        self.known_face_names = []
        self.load_student_images()

        self.track_history = {}
        self.logged_today = set()
        
        self.load_existing_log()

    def load_existing_log(self):
        if os.path.exists(self.log_file):
            try:
                df = pd.read_excel(self.log_file)
                today = datetime.now().strftime("%Y-%m-%d")
                if "Date" in df.columns and "Name" in df.columns:
                    today_records = df[df["Date"] == today]
                    self.logged_today = set(today_records["Name"].values)
            except Exception as e:
                print(f"⚠️ Could not read existing log: {e}")

    def load_student_images(self):
        print("📂 Loading student images...")
        if not os.path.exists(self.image_folder):
            os.makedirs(self.image_folder)
            return

        for filename in os.listdir(self.image_folder):
            if filename.lower().endswith(('.jpg', '.png', '.jpeg')):
                path = os.path.join(self.image_folder, filename)
                img = face_recognition.load_image_file(path)
                encs = face_recognition.face_encodings(img)
                if encs:
                    self.known_face_encodings.append(encs[0])
                    self.known_face_names.append(os.path.splitext(filename)[0])
                    print(f"   👤 Loaded: {os.path.splitext(filename)[0]}")

    def log_to_excel(self, name, track_id):
        if name in self.logged_today:
            return

        now = datetime.now()
        data = {
            "Track_ID": [track_id],
            "Name": [name],
            "Time": [now.strftime("%H:%M:%S")],
            "Date": [now.strftime("%Y-%m-%d")]
        }
        df_new = pd.DataFrame(data)

        if not os.path.exists(self.log_file):
            df_new.to_excel(self.log_file, index=False)
        else:
            existing_df = pd.read_excel(self.log_file)
            updated_df = pd.concat([existing_df, df_new], ignore_index=True)
            updated_df.to_excel(self.log_file, index=False)

        self.logged_today.add(name)
        print(f"✅ LOGGED: {name} (ID: {track_id})")

    def identify_face(self, face_image):
        try:
            if face_image.size == 0 or face_image.shape[0] < 20 or face_image.shape[1] < 20:
                return "Unknown"

            rgb_face = cv2.cvtColor(face_image, cv2.COLOR_BGR2RGB)
            encodings = face_recognition.face_encodings(rgb_face)
            
            if not encodings:
                return "Unknown"

            matches = face_recognition.compare_faces(self.known_face_encodings, encodings[0], tolerance=0.5)
            distances = face_recognition.face_distance(self.known_face_encodings, encodings[0])

            if len(distances) > 0:
                best_match_index = np.argmin(distances)
                if matches[best_match_index]:
                    return self.known_face_names[best_match_index]
            
            return "Unknown"
        except Exception as e:
            print(f"Error in ID: {e}")
            return "Error"

    def run(self):
        cap = cv2.VideoCapture(self.video_source)
        if not cap.isOpened():
            print("❌ Error: Could not open camera.")
            return

        print("🚀 System Started with YOLO Tracking. Press 'q' to quit.")

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            h, w = frame.shape[:2]

            results = self.model.track(
                frame, 
                persist=True, 
                verbose=False, 
                classes=self.tracking_classes,
                device=0 if self.model.device.type != 'cpu' else 'cpu'
            )
            
            if results[0].boxes.id is not None:
                boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)
                track_ids = results[0].boxes.id.cpu().numpy().astype(int)

                for box, track_id in zip(boxes, track_ids):
                    x1, y1, x2, y2 = box
                    
                    x1, y1 = max(0, x1), max(0, y1)
                    x2, y2 = min(w, x2), min(h, y2)

                    if track_id not in self.track_history or self.track_history[track_id] == "Unknown":
                        face_crop = frame[y1:y2, x1:x2]
                        
                        name = self.identify_face(face_crop)
                        if name != "Unknown":
                            self.track_history[track_id] = name
                            self.log_to_excel(name, track_id)
                        else:
                            self.track_history[track_id] = "Unknown"

                    name = self.track_history.get(track_id, "Unknown")
                    color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)

                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(frame, f"ID: {track_id} | {name}", (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

            cv2.imshow("YOLO Attendance System", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    system = YOLOAttendanceSystem(model_path="yolov8n.pt", video_source=0) 
    system.run()
