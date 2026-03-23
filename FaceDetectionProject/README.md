# YOLOv8 Face Detection Project

This project provides a complete pipeline for training a face detection model using YOLOv8 on the WIDER FACE dataset.

## Project Structure
- `dataset/`: Contains images and labels in YOLO format.
- `convert_wider_to_yolo.py`: Script to convert WIDER FACE annotations to YOLO format.
- `train.py`: Main training script with transfer learning and monitoring.
- `inference.py`: Inference script for images, videos, and webcam.
- `face_detection.yaml`: Configuration file for the dataset.
- `requirements.txt`: Python dependencies.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Prepare Dataset:**
   - Download the WIDER FACE dataset (train, val, annotations).
   - Update the `WIDER_ROOT` path in `convert_wider_to_yolo.py`.
   - Run the conversion script:
     ```bash
     python convert_wider_to_yolo.py
     ```

3. **Train the Model:**
   - The training script uses transfer learning by freezing the YOLOv8 backbone.
   - Run the training:
     ```bash
     python train.py
     ```
   - Training logs will be saved to `training.log` and metrics to `metrics.csv`.
   - After training, check `training_plots.png` for performance visualization.

4. **Run Inference:**
   - To run on webcam:
     ```bash
     python inference.py --source 0
     ```
   - To run on an image:
     ```bash
     python inference.py --source path/to/image.jpg
     ```
   - To run on a video:
     ```bash
     python inference.py --source path/to/video.mp4
     ```

## Key Features
- **Transfer Learning:** Freezes the first 10 layers (backbone) to leverage pretrained weights.
- **Monitoring:** Custom callbacks log precision, recall, F1, and mAP after every epoch.
- **Adaptive Training:** Early stopping and learning rate adjustments are integrated.
- **Single Class Optimization:** Configured specifically for 'face' detection.
- **GPU Acceleration:** Automatically uses CUDA if available.
