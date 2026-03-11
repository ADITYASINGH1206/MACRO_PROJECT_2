from ultralytics import YOLO
import torch
from pathlib import Path


def main():
    model = YOLO("yolov8s.pt")
    model.train(data="face.yaml", epochs=100, imgsz=640, batch=16, device=0)
    model.export(format="onnx", dynamic=True, simplify=True)

if __name__ == "__main__":
    main()
    

