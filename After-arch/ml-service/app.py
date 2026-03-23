from flask import Flask, request, jsonify
from ultralytics import YOLO
import cv2
import numpy as np
import base64
import os
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image

load_dotenv()

app = Flask(__name__)

MODEL_PATH = os.getenv('MODEL_PATH', 'yolov8s.pt')
model = YOLO(MODEL_PATH) if os.path.exists(MODEL_PATH) else YOLO('yolov8s.pt')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML Service is running'})

@app.route('/detect', methods=['POST'])
def detect():
    try:
        data = request.json
        image_base64 = data.get('image')
        image_name = data.get('image_name', 'detection.jpg')
        user_id = data.get('user_id', None)

        # Decode base64 image
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Run YOLO detection
        results = model(image_cv)

        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                h, w = image_cv.shape[:2]
                vector = [
                    float(x1 / w),
                    float(y1 / h),
                    float(x2 / w),
                    float(y2 / h),
                    float(box.conf[0])
                ]
                detection = {
                    'confidence': float(box.conf[0]),
                    'bbox': [float(x1), float(y1), float(x2), float(y2)],
                    'student_id': user_id if user_id is not None else None,
                    'vector': vector
                }
                detections.append(detection)

        return jsonify({
            'image_name': image_name,
            'detections': detections,
            'detection_count': len(detections)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/detect-file', methods=['POST'])
def detect_file():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        image = Image.open(file.stream)
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Run YOLO detection
        results = model(image_cv)

        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                h, w = image_cv.shape[:2]
                vector = [
                    float(x1 / w),
                    float(y1 / h),
                    float(x2 / w),
                    float(y2 / h),
                    float(box.conf[0])
                ]
                detection = {
                    'confidence': float(box.conf[0]),
                    'bbox': [float(x1), float(y1), float(x2), float(y2)],
                    'student_id': None,
                    'vector': vector
                }
                detections.append(detection)

        return jsonify({
            'filename': file.filename,
            'detections': detections,
            'detection_count': len(detections)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('ML_PORT', 5001))
    app.run(debug=os.getenv('DEBUG', 'False') == 'True', port=port)
