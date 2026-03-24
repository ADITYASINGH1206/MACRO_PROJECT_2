# YOLO Face Detection Workflow


This workflow automates the process of training and evaluating the YOLOv8-based face detection model for the Attendance Management System.

## Prerequisites
- Python 3.11+
- `ultralytics` and `torch` libraries installed
- `DataSet/` directory with `data.yaml` following YOLO format

## Steps

### 1. Training the Model
// turbo
1. Change directory to the test environment:
   ```bash
   cd yolo_test
   ```
2. Execute the training script:
   ```bash
   python ag1.py
   ```
   *This script handles device detection (GPU/CPU) and model checkpointing.*

### 2. Verification
1. Check the `runs_face/yolov8s_face/` directory for training results.
2. Verify validation metrics (mAP, Precision, Recall).
3. Review saved test predictions in `runs_face/yolov8s_face_test_preds/`.

### 3. Cleanup
The `runs/` directory and specific dataset folders are ignored by Git. Use standard cleanup commands to manage disk space:
```bash
rm -rf yolo_test/runs/
```
