# Complete Usage Guide for YOLOv8 Face Detection Training

## Step-by-Step Setup Guide

### Step 1: Environment Setup

```bash
# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Download WIDER FACE Dataset

The WIDER FACE dataset is available at:
http://shuoyang1213.me/WIDERFACE/

Download all three parts:
- WIDER_train.zip (~350MB) - 12,880 images
- WIDER_val.zip (~80MB) - 3,226 images  
- WIDER_test.zip (~274MB) - 16,097 images

Extract to a directory:
```
E:\WIDER_FACE\
├── WIDER_train\
│   ├── images\
│   ├── annotations\
│   └── event_list.txt
├── WIDER_val\
├── WIDER_test\
...
```

### Step 3: Convert Annotations

```bash
python annotation_converter.py
```

When prompted, enter the full path to WIDER FACE root:
```
Enter path to WIDER_FACE directory: E:\WIDER_FACE
```

This will:
- Convert train annotations to YOLO format
- Convert val annotations to YOLO format
- Convert test annotations to YOLO format
- Create normalized bounding boxes (all values in [0, 1])
- Validate all images and skip corrupted files
- Output statistics for each split

Output structure created:
```
LargeModel/
└── dataset/
    ├── images/
    │   ├── train/    # 12,880 images
    │   └── val/      # 3,226 images
    └── labels/
        ├── train/    # 12,880 .txt files
        └── val/      # 3,226 .txt files
```

### Step 4: Validate Dataset

```bash
python dataset_preprocessing.py
```

This script:
1. **Validates all images** - Checks if images can be read
2. **Validates labels** - Checks YOLO format correctness
3. **Removes corrupted files** - Deletes invalid image/label pairs
4. **Computes statistics** - Shows dataset overview

Output:
```
======================================================================
Starting Dataset Preprocessing
======================================================================

Processing TRAIN split
  Total images: 12,807
  Total faces: 376,428
  Avg faces/image: 29.40

Processing VAL split
  Total images: 3,177
  Total faces: 95,275
  Avg faces/image: 30.00

Preprocessing Complete!
```

### Step 5: Begin Training

```bash
python train.py
```

The script will:
1. Load pretrained YOLOv8s weights
2. Create dataset.yaml automatically
3. Freeze backbone layers
4. Start training with logging

Training output:
```
Device: cuda
Model: yolov8s
Checkpoint directory: ./checkpoints

Frozen layers: 10/22
Trainable parameters: 4,512,000/11,124,603
Trainable percentage: 40.6%

Starting Training
======================================================================

Epoch 1/100: 
  Loss: 2.341
  Precision: 0.812
  Recall: 0.715
  mAP@50: 0.745
  mAP@50-95: 0.452

...

Training Complete!
======================================================================
```

### Step 6: Monitor Training Progress

During training, Ultralytics automatically creates:
```
checkpoints/face_detection/
├── weights/
│   ├── best.pt      # Best model
│   └── last.pt      # Last checkpoint
├── runs.csv         # Training metrics
└── results.csv      # Validation metrics
```

### Step 7: Visualize Results

After training completes:

```bash
python visualize_metrics.py
```

This generates:
- `output/loss_vs_epoch.png` - Loss curves
- `output/precision_vs_epoch.png` - Precision curve
- `output/recall_vs_epoch.png` - Recall curve
- `output/f1_vs_epoch.png` - F1 score curve
- `output/map_vs_epoch.png` - mAP curves
- `output/training_report.html` - Complete report
- `logs/metrics.csv` - CSV with metrics
- `logs/training_log.json` - JSON log

### Step 8: Run Inference

**On a single image:**
```bash
python inference.py --model checkpoints/best_face_detection.pt --source image.jpg
```

Output:
```
Model loaded: checkpoints/best_face_detection.pt
Device: cuda
Confidence threshold: 0.25

Processing image: image.jpg
Detections: 5
Output saved: image_detected.jpg
```

**On a video:**
```bash
python inference.py --model checkpoints/best_face_detection.pt --source video.mp4 --display
```

**On webcam (real-time):**
```bash
python inference.py --model checkpoints/best_face_detection.pt --source webcam
```

Press 'q' to exit webcam mode.

## Parameter Tuning Guide

### Increasing Accuracy (Slower Training)

```bash
# In train.py, modify the train() call:
results = trainer.train(
    epochs=150,           # Train longer
    batch_size=24,        # Larger batch if GPU memory allows
    imgsz=1024,           # Higher resolution
    initial_lr=0.0005     # Lower learning rate for stability
)
```

### Faster Training (Lower Accuracy)

```bash
results = trainer.train(
    epochs=50,
    batch_size=8,
    imgsz=416,
    initial_lr=0.002
)
```

### Fine-tuning on Custom Data

```bash
# Unfreeze all layers after initial training
trainer.unfreeze_backbone()

results = trainer.train(
    epochs=20,
    initial_lr=0.00001    # Very low learning rate
)
```

## Memory Optimization

### If you get "CUDA out of memory":

1. **Reduce batch size:**
   ```python
   trainer.train(batch_size=8)  # From 16 to 8
   ```

2. **Reduce image size:**
   ```python
   trainer.train(imgsz=416)  # From 640 to 416
   ```

3. **Use smaller model:**
   ```python
   trainer = FaceDetectionTrainer(model_name='yolov8n')
   ```

4. **Clear GPU cache:**
   ```python
   import torch
   torch.cuda.empty_cache()
   ```

### Memory requirements by model:

- **YOLOv8n (nano)**: 2GB VRAM minimum
- **YOLOv8s (small)**: 4GB VRAM minimum  
- **YOLOv8m (medium)**: 8GB VRAM minimum
- **YOLOv8l (large)**: 16GB VRAM minimum
- **YOLOv8x (xlarge)**: 32GB VRAM minimum

## Inference Examples

### Basic Inference:
```python
from inference import FaceDetectionInference

engine = FaceDetectionInference('checkpoints/best_face_detection.pt')
result = engine.infer_image('test.jpg', save_detections=True)

print(f"Found {result['detections']} faces")
print(f"Output: {result['output_path']}")
```

### Batch Processing:
```python
import os
from inference import FaceDetectionInference

engine = FaceDetectionInference('checkpoints/best_face_detection.pt')

for img in os.listdir('images/'):
    if img.endswith('.jpg'):
        result = engine.infer_image(f'images/{img}')
        print(f"{img}: {result['detections']} faces")
```

### Custom Confidence Threshold:
```bash
# Higher threshold = fewer but more confident detections
python inference.py --source image.jpg --conf 0.5

# Lower threshold = more detections including uncertain ones
python inference.py --source image.jpg --conf 0.1
```

### Video with FPS Adjustment:
```bash
python inference.py --source video.mp4 --display --conf 0.3
```

## Training Metrics Interpretation

### Good Training Signs:
- Loss decreases gradually
- Precision increases or stays stable
- Recall increases
- mAP steadily improves
- No sudden spikes in loss

### Problem Indicators:
- Loss increases (unstable training)
- Precision low but recall high (detecting extra faces)
- Precision high but recall low (missing faces)
- mAP plateaus (convergence)

### Solutions:
- If loss unstable: Reduce learning rate
- If precision low: Increase classification loss weight
- If recall low: Decrease confidence threshold
- If plateaus: Train longer or unfreeze layers

## Advanced Configuration

### Modify Training Parameters in train.py:

```python
train_params = {
    'data': self.dataset_yaml,
    'epochs': 100,
    'batch': 16,
    'imgsz': 640,
    'device': device,
    'patience': 15,              # Early stopping patience
    'optimizer': 'SGD',           # Or 'Adam'
    'lr0': 0.001,                # Initial learning rate
    'lrf': 0.01,                 # Final LR as fraction
    'momentum': 0.937,            # SGD momentum
    'weight_decay': 0.0005,       # L2 regularization
    'warmup_epochs': 3,           # Warmup epochs
    'flipud': 0.5,                # Vertical flip probability
    'fliplr': 0.5,                # Horizontal flip probability
    'hsv_h': 0.015,               # HSV hue shift
    'hsv_s': 0.7,                 # HSV saturation shift
    'hsv_v': 0.4,                 # HSV value shift
    'degrees': 10.0,              # Rotation degrees
    'translate': 0.1,             # Translation fraction
    'scale': 0.5,                 # Scale fraction
}
```

### Adjust Augmentation:
- Increase aug if overfitting (training good, validation bad)
- Decrease aug if underfitting (both bad)
- Disable mosaic in last N epochs: `close_mosaic=15`

## Validation and Testing

### Evaluate on Validation Set:
```python
trainer.evaluate()
```

Output:
```
Validation Metrics:
  mAP@50: 0.8234
  mAP@50-95: 0.5721
  Precision: 0.8456
  Recall: 0.7891
```

### Test on Test Set:
```bash
# Copy test images to a directory and run inference
python inference.py --source test_images/ --conf 0.25
```

## Performance Benchmarks

### YOLOv8s on WIDER FACE (typical results after 100 epochs):

- **mAP@50**: ~82%
- **mAP@50-95**: ~57%
- **Precision**: ~84%
- **Recall**: ~79%
- **Inference Speed**: ~15-20 FPS (1080p, RTX 3070)

Results vary based on:
- GPU model
- Batch size during training
- Image resolution
- Augmentation strength
- Number of epochs

## Troubleshooting

### Training won't start:
```bash
python -c "import torch; print(torch.cuda.is_available())"
# Should print: True (if GPU available)
```

### No improvements visible:
```python
# Check if learning rate is too low
initial_lr=0.01  # Increase from 0.001
```

### Memory error during training:
```python
trainer.train(batch_size=8, imgsz=416)  # Reduce both
```

### Poor detection results:
1. Increase training epochs
2. Use more diverse augmentation
3. Check dataset quality
4. Verify annotations are correct

## Summary

**Complete workflow:**
1. Install dependencies: `pip install -r requirements.txt`
2. Download WIDER FACE dataset
3. Convert annotations: `python annotation_converter.py`
4. Preprocess data: `python dataset_preprocessing.py`
5. Train model: `python train.py`
6. Visualize metrics: `python visualize_metrics.py`
7. Run inference: `python inference.py --source image.jpg`

**Typical training time:** 
- GPU (RTX 3070): 6-8 hours for 100 epochs
- GPU (RTX 2080 Ti): 8-10 hours
- CPU: 24+ hours (not recommended)
