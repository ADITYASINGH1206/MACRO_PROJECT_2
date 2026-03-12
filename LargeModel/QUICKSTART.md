# YOLOv8 Face Detection - Complete Usage Guide

## Overview

This guide walks you through the complete workflow for training and using a YOLOv8 face detection model on the WIDER FACE dataset.

## Complete Workflow

### Step 0: Environment Setup

```bash
# 1. Navigate to project
cd e:\VS CODE\MACRO_PROJECT_2\MACRO_PROJECT_2\LargeModel

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Verify installation
python -c "import torch; print('PyTorch:', torch.__version__); print('CUDA:', torch.cuda.is_available())"
python -c "from ultralytics import YOLO; print('YOLOv8: OK')"
```

### Step 1: Prepare the WIDER FACE Dataset

**Download Options**:
1. Official: http://shuoyang1213.me/WIDERFACE/
2. Mirror: https://www.dropbox.com/sh/8j3DbG12qYNFVfa?dl=0

**Expected Structure**:
```
WIDER_FACE_ROOT/
├── train/
│   ├── images/
│   │   ├── 0--Parade/
│   │   ├── 1--Handshaking/
│   │   └── ... (more event folders)
│   └── annotations/
│       ├── wider_face_train_bbx_gt.txt
├── val/
│   ├── images/
│   │   ├── 0--Parade/
│   │   └── ... (more event folders)
│   └── annotations/
│       └── wider_face_val_bbx_gt.txt
└── test/
    ├── images/
    └── annotations/
```

### Step 2: Convert Annotations to YOLO Format

```bash
python annotation_converter.py
```

**What happens**:
- Reads WIDER FACE annotation files
- Converts to YOLO format (class_id x_center y_center width height)
- Normalizes coordinates to [0, 1]
- Saves labels to `dataset/labels/`

**Input Requested**:
```
Enter path to WIDER FACE dataset root: /path/to/WIDER_FACE
Enter output directory for YOLO labels (default: ./labels): 
```

**Output**:
```
logs/
├── training.log
└── Conversion complete with statistics
```

**Expected Output Structure**:
```
dataset/
├── labels/
│   ├── train/
│   │   ├── image1.txt
│   │   ├── image2.txt
│   │   └── ...
│   └── val/
│       ├── image1.txt
│       └── ...
```

### Step 3: Copy Images to Dataset Directory

```bash
# The converter should have already placed images, but verify:
# dataset/images/train/
# dataset/images/val/
```

### Step 4: Preprocess and Validate Dataset

```bash
python dataset_preprocessing.py
```

**What it does**:
- ✓ Validates all images (checks for corruption)
- ✓ Validates all label files (checks format)
- ✓ Removes corrupted images and labels
- ✓ Removes invalid bounding boxes
- ✓ Verifies dataset integrity
- ✓ Generates statistics

**Output**:
```
===== PREPROCESSING STATISTICS =====
Total images: 12800
Valid images: 12789
Corrupted images: 11
Valid labels: 45230
Invalid labels: 0
Small boxes removed: 145
=====================================
```

### Step 5: Configure Training (Optional)

Edit `config.py` to customize:

```python
# Number of training epochs
EPOCHS = 100

# Batch size (reduce if out of memory)
BATCH_SIZE = 16

# Training image size
IMG_SIZE = 640

# Transfer learning
FREEZE_LAYERS = 22  # Backbone layers to freeze
UNFREEZE_EPOCH = 50  # When to unfreeze

# Device selection
DEVICE = "0"  # GPU 0, or "cpu" for CPU

# Early stopping
PATIENCE = 20  # Stop if validation loss doesn't improve for 20 epochs
```

### Step 6: Train the Model

```bash
python train.py
```

**Expected Output**:
```
Epoch 1/100 | LR 0.001000 | Loss 2.345 | Val Loss 1.890 | mAP50 0.123
Epoch 2/100 | LR 0.001000 | Loss 1.876 | Val Loss 1.234 | mAP50 0.287
...
Epoch 100/100 | LR 0.000010 | Loss 0.234 | Val Loss 0.156 | mAP50 0.892

Training complete!
✅ Results saved to: checkpoints/
✅ Metrics saved to: logs/training_metrics.csv
✅ Logs saved to: logs/training.log
```

**What gets saved**:
```
checkpoints/
├── best.pt          # Best model (lowest val loss)
└── last.pt          # Last epoch model

logs/
├── training.log     # Detailed logs
├── training_metrics.csv  # Metrics table
└── frozen_layers.txt # Frozen layer info
```

### Step 7: Monitor Training Progress

```bash
# View training log in real-time
type logs\training.log

# View metrics
python -c "import pandas as pd; df = pd.read_csv('logs/training_metrics.csv'); print(df.to_string())"
```

### Step 8: Visualize Training Metrics

```bash
python visualize_metrics.py
```

**Generates Plots**:
- loss_vs_epoch.png
- precision_vs_epoch.png
- recall_vs_epoch.png
- f1_score_vs_epoch.png
- map_vs_epoch.png
- learning_rate_vs_epoch.png
- all_metrics.png (dashboard)

**Location**: `output/plots/`

### Step 9: Run Inference

```bash
python inference.py
```

**Interactive Menu**:
```
Select inference mode:
1. Single image
2. Batch images
3. Video file
4. Webcam stream

Enter choice (1-4): 
```

#### 9a. Single Image Inference

```
Enter image path: path/to/image.jpg

✅ Processing: path/to/image.jpg
Detected 5 faces
Result saved to: output/image.jpg
```

#### 9b. Batch Image Inference

```
Enter image directory: path/to/images/

✅ Found 100 images
Processing images... [################] 100%
Total images: 100
Total faces detected: 287
Results saved to: output/batch_results/
```

#### 9c. Video Inference

```
Enter video path: path/to/video.mp4

✅ Processing video: path/to/video.mp4
Video info: 1800 frames, 30 fps, 1280x720
Processing... [################] 100%
Output saved to: output/video_detected.mp4
```

#### 9d. Webcam Stream

```
Duration in seconds (default 30): 30

✅ Starting webcam inference (30 seconds)...
[Press Q to quit]
Webcam inference complete
Output saved to: output/webcam_20240101_120000.mp4
```

## Advanced Usage

### Resume Training from Checkpoint

```python
# In config.py
RESUME_CHECKPOINT = "checkpoints/last.pt"

# Run training
python train.py
```

### Use Custom Model Size

```python
# In config.py
MODEL_WEIGHTS = "yolov8m.pt"  # Options: n, s, m, l, x
```

### Training on CPU Only

```python
# In config.py
DEVICE = "cpu"
BATCH_SIZE = 4  # Reduce batch size
```

### Change Learning Rate

```python
# In config.py
LEARNING_RATE = 0.002
MOMENTUM = 0.937
```

### Disable Freezing (Train All Layers)

```python
# In config.py
FREEZE_BACKBONE = False
```

### Inference with Custom Model

```python
from inference import FaceDetectionInference

# Load custom model
inf = FaceDetectionInference(model_path="path/to/custom_model.pt")

# Run inference
result = inf.infer_image("image.jpg")
print(f"Detected {result['num_detections']} faces")
```

### Batch Inference Programmatically

```python
from inference import FaceDetectionInference

inf = FaceDetectionInference()
results = inf.infer_batch("path/to/images/")

# Print results
for result in results:
    print(f"{result['image_path']}: {result['num_detections']} faces")
```

## Troubleshooting

### Out of Memory Error

```bash
# Reduce batch size in config.py
BATCH_SIZE = 8  # or 4, 2

# Or reduce image size
IMG_SIZE = 416  # instead of 640
```

### Slow Training

- Use GPU (verify: `python -c "import torch; print(torch.cuda.is_available())"`)
- Check if GPU is being used: `nvidia-smi` during training
- Increase batch size (if memory allows)

### Model Not Improving

1. Check data quality
2. Increase epochs
3. Adjust learning rate
4. Verify dataset conversion
5. Check training logs: `type logs\training.log`

### FileNotFoundError When Running Scripts

- Ensure you're in the correct directory: `cd LargeModel`
- Verify all image files exist in `dataset/images/`
- Check that conversion was successful

### CUDA Out of Memory

```bash
# Solution 1: Reduce batch size
BATCH_SIZE = 4

# Solution 2: Reduce image size
IMG_SIZE = 416

# Solution 3: Use CPU
DEVICE = "cpu"
```

## Expected Results

### Training Metrics
- **Loss**: Should decrease from ~2.0 to < 0.3
- **Precision**: Should reach > 0.85 (higher is better)
- **Recall**: Should reach > 0.85 (higher is better)
- **F1 Score**: Should reach > 0.85 (higher is better)
- **mAP@50**: Should reach > 0.85 (higher is better)
- **mAP@50-95**: Should reach > 0.60 (higher is better)

### Training Time (Approximate)
- **GPU RTX 3090**, Batch 32: ~4-5 hours for 100 epochs
- **GPU RTX 3080**, Batch 16: ~8-10 hours for 100 epochs
- **GPU RTX 2080 Ti**, Batch 16: ~12-15 hours for 100 epochs
- **CPU**: 24+ hours for 100 epochs (not recommended)

## File Outputs Summary

### After Complete Training

```
LargeModel/
├── checkpoints/
│   ├── best.pt          # Best model for inference
│   └── last.pt          # Last checkpoint for resuming
├── logs/
│   ├── training.log     # Training logs (text)
│   ├── training_metrics.csv  # Metrics (CSV table)
│   └── frozen_layers.txt # Frozen layer info
├── output/
│   ├── plots/           # Visualization plots
│   │   ├── loss_vs_epoch.png
│   │   ├── precision_vs_epoch.png
│   │   ├── recall_vs_epoch.png
│   │   ├── f1_score_vs_epoch.png
│   │   ├── map_vs_epoch.png
│   │   └── all_metrics.png
│   ├── inference/       # Inference results
│   │   ├── image1.jpg
│   │   └── image2.jpg
│   └── batch_results/   # Batch inference results
└── dataset.yaml         # YOLO dataset config
```

## Command Quick Reference

```bash
# Setup
pip install -r requirements.txt

# Annotation conversion
python annotation_converter.py

# Data validation
python dataset_preprocessing.py

# Training
python train.py

# Visualization
python visualize_metrics.py

# Inference
python inference.py
```

## Success Checklist

- [ ] Dependencies installed successfully
- [ ] WIDER FACE dataset downloaded and extracted
- [ ] Annotations converted to YOLO format
- [ ] Dataset preprocessed and validated
- [ ] dataset/images/train and dataset/images/val populated
- [ ] dataset/labels/train and dataset/labels/val populated
- [ ] Training completed without errors
- [ ] Checkpoints saved (best.pt and last.pt)
- [ ] Metrics CSV generated
- [ ] Visualizations created
- [ ] Inference tested on sample data

---

**For detailed information, see README.md**
