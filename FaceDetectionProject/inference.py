import cv2
import torch
from ultralytics import YOLO
import argparse
import os

def run_inference(source, weights_path='c:/Users/ADITYA/Desktop/MITS/4thsem/Macro/FaceDetectionProject/face_detection_run/yolov8s_face/weights/best.pt'):
    # Load the trained model
    if not os.path.exists(weights_path):
        print(f"Weights not found at {weights_path}. Using pretrained yolov8s.pt for demo.")
        model = YOLO('yolov8s.pt')
    else:
        model = YOLO(weights_path)

    # Detect device
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model.to(device)

    # Check source type
    if source == '0' or source.isdigit():
        source = int(source) # Webcam
        cap = cv2.VideoCapture(source)
    elif source.endswith(('.mp4', '.avi', '.mov')):
        cap = cv2.VideoCapture(source) # Video
    else:
        # Image
        results = model(source, conf=0.5)
        for r in results:
            im_array = r.plot() # Plot results on image
            cv2.imshow('Face Detection', im_array)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
        return

    # Video/Webcam Loop
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        # Run inference
        results = model(frame, conf=0.5, verbose=False)

        # Plot results
        for r in results:
            annotated_frame = r.plot()
            cv2.imshow('Face Detection Inference', annotated_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=str, default='0', help='Path to image, video, or "0" for webcam')
    parser.add_argument('--weights', type=str, default='c:/Users/ADITYA/Desktop/MITS/4thsem/Macro/FaceDetectionProject/face_detection_run/yolov8s_face/weights/best.pt')
    args = parser.parse_args()

    run_inference(args.source, args.weights)
