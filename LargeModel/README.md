# YOLOv8 Face Detection Training Project

A complete, production-ready Python project for training a state-of-the-art face detection model using **YOLOv8** on the **WIDER FACE dataset** with transfer learning, comprehensive metrics tracking, and advanced monitoring.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Dataset Setup](#dataset-setup)
- [Usage](#usage)
  - [Step 1: Convert Annotations](#step-1-convert-annotations)
  - [Step 2: Preprocess Dataset](#step-2-preprocess-dataset)
  - [Step 3: Train Model](#step-3-train-model)
  - [Step 4: Visualize Metrics](#step-4-visualize-metrics)
  - [Step 5: Run Inference](#step-5-run-inference)
- [Configuration](#configuration)
- [Training Strategy](#training-strategy)
- [Monitoring Training](#monitoring-training)
- [Model Checkpoints](#model-checkpoints)
- [Troubleshooting](#troubleshooting)

## Features

✅ **Transfer Learning**: Frozen backbone with fine-tuning of detection head
✅ **Multi-class Support**: Easily extend to multiple face attributes
✅ **Advanced Metrics Tracking**: Precision, Recall, F1, mAP@50, mAP@50-95
✅ **Early Stopping**: Prevents overfitting with customizable patience
✅ **Learning Rate Scheduling**: Adaptive LR reduction on plateau
✅ **Checkpoint Management**: Saves best and last models
✅ **Training Resumption**: Resume from any checkpoint
✅ **GPU Support**: Automatic CUDA detection and multi-GPU support
✅ **Mixed Precision Training**: FP16 for faster training
✅ **Comprehensive Logging**: CSV metrics, training logs, visualizations
✅ **Flexible Inference**: Images, videos, batches, webcam streams
✅ **Data Augmentation**: Advanced augmentation during training
✅ **Dataset Validation**: Automatic corruption detection and cleaning

## Project Structure

```
LargeModel/
├── dataset/
│   ├── images/
│   │   ├── train/              # Training images
│   │   └── val/                # Validation images
│   └── labels/
│       ├── train/              # Training labels (YOLO format)
│       └── val/                # Validation labels (YOLO format)
├── checkpoints/                # Saved model weights
│   ├── best.pt                 # Best model checkpoint
│   └── last.pt                 # Last epoch checkpoint
├── logs/
│   ├── training.log            # Detailed training logs
│   ├── training_metrics.csv    # Metrics per epoch
│   └── frozen_layers.txt       # Frozen layer information
├── output/
│   ├── plots/                  # Training visualization plots
│   └── inference/              # Inference results
├── config.py                   # Configuration parameters
├── annotation_converter.py     # WIDER FACE → YOLO converter
├── dataset_preprocessing.py    # Data validation & cleaning
├── train.py                    # Main training script
├── inference.py                # Inference engine
├── visualize_metrics.py        # Metrics visualization
├── dataset.yaml                # YOLO dataset config
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Prerequisites

- **Python**: 3.8 or higher
- **GPU**: NVIDIA GPU with CUDA support (CPU mode supported but much slower)
  - CUDA 11.8+
  - cuDNN 8.0+
- **RAM**: At least 8GB (16GB+ recommended for WIDER FACE)
- **Storage**: ~50GB for WIDER FACE dataset + models

## Installation

### 1. Clone/Download Project

```bash
cd LargeModel
```

### 2. Create Virtual Environment (Recommended)

```bash
# Using venv
python -m venv venv
venv\Scripts\activate

# Or using conda
conda create -n yolo_face python=3.10
conda activate yolo_face
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Verify Installation

```bash
python -c "import torch; print(f'PyTorch {torch.__version__}'); print(f'CUDA Available: {torch.cuda.is_available()}')"
python -c "from ultralytics import YOLO; print('YOLOv8 imported successfully')"
```

## Dataset Setup

### Option A: Automatic Download (Recommended)

The WIDER FACE dataset can be downloaded from:
- **Official**: http://shuoyang1213.me/WIDERFACE/
- **Alternative**: https://www.dropbox.com/sh/8j3DbG12qYNFVfa?dl=0

### Option B: Manual Setup

1. Download WIDER FACE dataset
2. Extract to a location (e.g., `/data/WIDER_FACE`)
3. Structure should be:

```
WIDER_FACE/
├── train/
│   ├── images/
│   │   ├── event1/
│   │   ├── event2/
│   │   └── ...
│   └── annotations/
│       └── wider_face_train_bbx_gt.txt
├── val/
│   ├── images/
│   └── annotations/
│       └── wider_face_val_bbx_gt.txt
└── test/
    ├── images/
    └── annotations/
        └── wider_face_test_bbx_gt.txt
```

## Usage

### Step 1: Convert Annotations

Convert WIDER FACE annotations to YOLO format:

```bash
python annotation_converter.py
```

**Input**: Path to WIDER FACE dataset root
**Output**: `dataset/labels/` with YOLO format files

**YOLO Format**:
```
<class_id> <x_center> <y_center> <width> <height>
```
- All values normalized to [0, 1]
- `class_id = 0` for face

### Step 2: Preprocess Dataset

Validate and clean the dataset:

```bash
python dataset_preprocessing.py
```

**Operations**:
- ✓ Validate image integrity
- ✓ Validate label format
- ✓ Remove corrupted images
- ✓ Remove invalid bounding boxes
- ✓ Verify dataset consistency
- ✓ Generate statistics

### Step 3: Train Model

Start training with transfer learning:

```bash
python train.py
```

**What happens**:
1. Loads YOLOv8s pretrained weights
2. Freezes backbone layers (initial training)
3. Trains detection head on WIDER FACE data
4. Monitors metrics and saves checkpoints
5. Generates logs and CSV metrics

**Expected output**:
```
Checkpoints saved to: checkpoints/
Metrics saved to:     logs/training_metrics.csv
Logs saved to:        logs/training.log
```

#### Resume Training from Checkpoint

```python
# In config.py, set:
RESUME_CHECKPOINT = "checkpoints/last.pt"

# Then run:
python train.py
```

#### Modify Training Parameters

Edit `config.py` to adjust:

```python
EPOCHS = 100              # Number of epochs
BATCH_SIZE = 16           # Batch size per GPU
IMG_SIZE = 640            # Training image size
LEARNING_RATE = 0.001     # Initial learning rate
PATIENCE = 20             # Early stopping patience
FREEZE_LAYERS = 22        # Layers to freeze
UNFREEZE_EPOCH = 50       # When to unfreeze
```

### Step 4: Visualize Training Metrics

Generate visualization plots:

```bash
python visualize_metrics.py
```

**Generates**:
- Loss vs Epoch
- Precision vs Epoch
- Recall vs Epoch
- F1 Score vs Epoch
- mAP@50 vs Epoch
- mAP@50-95 vs Epoch
- Learning Rate vs Epoch
- Combined metrics dashboard

**Output**: `output/plots/`

### Step 5: Run Inference

Run detection on images, videos, or webcam:

```bash
python inference.py
```

**Interactive menu**:
```
1. Single image
2. Batch images
3. Video file
4. Webcam stream
```

**Examples**:

```bash
# Single image
python -c "from inference import FaceDetectionInference; inf = FaceDetectionInference(); inf.infer_image('test.jpg')"

# Batch processing
python -c "from inference import FaceDetectionInference; inf = FaceDetectionInference(); inf.infer_batch('images/')"

# Video inference
python -c "from inference import FaceDetectionInference; inf = FaceDetectionInference(); inf.infer_video('video.mp4')"
```

## Configuration

### config.py Overview

```python
# Paths
CHECKPOINTS_DIR = Path(__file__).parent / "checkpoints"
LOGS_DIR = Path(__file__).parent / "logs"

# Model
MODEL_WEIGHTS = "yolov8s.pt"      # yolov8n/s/m/l/x
NUM_CLASSES = 1                    # Face detection only
CLASS_NAMES = ["face"]

# Training
EPOCHS = 100
BATCH_SIZE = 16
IMG_SIZE = 640
LEARNING_RATE = 0.001

# Transfer Learning
FREEZE_BACKBONE = True             # Freeze initial layers
FREEZE_LAYERS = 22                 # Which layers to freeze
UNFREEZE_EPOCH = 50                # When to unfreeze

# Device
DEVICE = "0"                       # GPU ID, "cpu" for CPU

# Metrics
PATIENCE = 20                      # Early stopping patience
CONFIDENCE_THRESHOLD = 0.5         # Inference threshold
```

## Training Strategy

### Phase 1: Backbone Frozen (Epoch 1-50)
- Freezes backbone layers (feature extraction)
- Trains only detection head
- Faster convergence
- Prevents overfitting

### Phase 2: Fine-tuning (Epoch 50-100)
- Unfreezes all layers
- Fine-tunes entire network
- Slower training but better accuracy
- Smaller learning rate applied

### Key Features
✅ Early stopping based on validation loss
✅ Learning rate reduction on plateau
✅ Mixed precision FP16 training
✅ Automatic model checkpointing
✅ GPU acceleration with CUDA

## Monitoring Training

### Real-time Monitoring

**Training Log**:
```bash
cat logs/training.log
```

**Metrics CSV**:
```bash
# Open in Excel or pandas
python -c "import pandas as pd; df = pd.read_csv('logs/training_metrics.csv'); print(df.head())"
```

### Expected Metrics

| Metric | Range | Good Value |
|--------|-------|-----------|
| Loss | 0-∞ | < 0.5 |
| Precision | 0-1 | > 0.8 |
| Recall | 0-1 | > 0.8 |
| F1 Score | 0-1 | > 0.8 |
| mAP@50 | 0-1 | > 0.85 |
| mAP@50-95 | 0-1 | > 0.60 |

### Key Monitoring Points

1. **Loss convergence**: Should decrease smoothly
2. **Validation loss**: Should decrease, watch for overfitting
3. **mAP scores**: Should increase over time
4. **Learning curve**: Should show steady improvement

## Model Checkpoints

### Best Model
```
checkpoints/best.pt
```
- Saves when validation loss improves
- Used for final inference
- Best generalization

### Last Model
```
checkpoints/last.pt
```
- Saves every 10 epochs
- Used for resuming training
- Latest checklo checkpoints

## Troubleshooting

### Issue: CUDA Out of Memory

**Solution**:
1. Reduce batch size in `config.py`:
   ```python
   BATCH_SIZE = 8  # or 4
   ```
2. Reduce image size:
   ```python
   IMG_SIZE = 416
   ```
3. Use CPU:
   ```python
   DEVICE = "cpu"
   ```

### Issue: Slow Training on CPU

**Solution**:
- Use GPU: Install CUDA and cuDNN
- Check PyTorch GPU support:
  ```bash
  python -c "import torch; print(torch.cuda.is_available())"
  ```

### Issue: Model Not Improving

**Solution**:
1. Check dataset quality
2. Increase training epochs
3. Adjust learning rate
4. Increase data augmentation

### Issue: Low Detection Accuracy

**Solution**:
1. Ensure proper annotation conversion
2. Validate dataset preprocessing
3. Increase training epochs
4. Use larger model (yolov8m/l/x)

### Issue: Corrupted Images Not Detected

**Solution**:
1. Run dataset preprocessing:
   ```bash
   python dataset_preprocessing.py
   ```
2. Check logs for corrupted images
3. Manually inspect `dataset/images/`

## Performance Benchmarking

### Hardware Recommendations

| Device | Batch Size | Training Time | Memory |
|--------|-----------|---------------|--------|
| RTX 3090 | 32 | ~4 hours | 22GB |
| RTX 3080 | 16 | ~8 hours | 10GB |
| RTX 2080 Ti | 16 | ~12 hours | 11GB |
| CPU (16-core) | 4 | ~24+ hours | 16GB+ |

## Output Files

### After Training

```
logs/
├── training.log           # Detailed training logs
├── training_metrics.csv   # Epoch-wise metrics
└── frozen_layers.txt      # Frozen layers info

checkpoints/
├── best.pt               # Best model
└── last.pt               # Last model

output/plots/
├── loss_vs_epoch.png
├── precision_vs_epoch.png
├── recall_vs_epoch.png
├── f1_score_vs_epoch.png
├── map_vs_epoch.png
├── learning_rate_vs_epoch.png
└── all_metrics.png
```

### After Inference

```
output/
├── inference/    # Single image results
└── batch_results/  # Batch processing results
```

## Advanced Usage

### Custom Dataset (Non-WIDER FACE)

If using a custom dataset, ensure structure:

```
dataset/
├── images/
│   ├── train/
│   └── val/
└── labels/
    ├── train/
    └── val/
```

Each image must have corresponding `.txt` label in YOLO format.

### Multi-GPU Training

```python
# In config.py
DEVICE = "0,1,2"  # Train on GPUs 0, 1, 2
```

### Custom Augmentation

Edit augmentation parameters in `config.py`:

```python
AUGMENTATION_PARAMS = {
    "hsv_h": 0.015,
    "hsv_s": 0.7,
    "hsv_v": 0.4,
    "degrees": 10.0,
    "translate": 0.1,
    "scale": 0.5,
    "fliplr": 0.5,
    "mosaic": 1.0,
}
```

## Citation

If you use this project, please cite:

```bibtex
@article{redmon2016you,
  title={You only look once: Unified, real-time object detection},
  author={Redmon, Joseph and Divvala, Santosh and Girshick, Ross and Farhadi, Ali},
  journal={CVPR},
  year={2016}
}

@article{yang2015wider,
  title={WIDER Face: A Face Detection Benchmark},
  author={Yang, Shuo and Luo, Ping and Loy, Chen Change and Tang, Xiaoou},
  journal={CVPR},
  year={2016}
}
```

## License

This project is provided as-is for educational and research purposes.

## Support

For issues or questions:
1. Check `TROUBLESHOOTING.md`
2. Review training logs in `logs/`
3. Verify dataset structure
4. Check GPU memory and CUDA availability

---

**Happy Training! 🚀**


```bash
python annotation_converter.py
```

Follow the prompts and enter the path to your WIDER FACE directory.

This converts annotations from WIDER FACE format:
```
x1 y1 width height blur expression illumination invalid occlusion pose
```

To YOLO format (normalized coordinates):
```
<class_id> <x_center> <y_center> <width> <height>
```

### 4. Preprocess Dataset

```bash
python dataset_preprocessing.py
```

This script:
- Validates all images
- Removes corrupted images
- Validates label format
- Computes dataset statistics
- Optionally resizes images

### 5. Create Dataset Configuration

The training script will automatically create `dataset.yaml` with:
- Path to training images
- Path to validation images
- Number of classes (1 = face)
- Class names

### 6. Train the Model

```bash
python train.py
```

Training Parameters:
- Model: YOLOv8s (small)
- Epochs: 100
- Batch size: 16
- Image size: 640x640
- Learning rate: 0.001
- Optimizer: SGD
- Device: Auto-detect GPU (CUDA) or CPU

Features:
- **Transfer Learning**: Pre-trained YOLOv8 weights
- **Frozen Backbone**: First 10 layers frozen initially
- **Data Augmentation**: Flip, rotation, HSV, mosaic, etc.
- **Early Stopping**: Patience of 15 epochs
- **Checkpoint Saving**: Every 5 epochs + best model
- **GPU Acceleration**: Automatic CUDA detection

Output:
- `checkpoints/face_detection/weights/best.pt` - Best model
- `checkpoints/face_detection/weights/last.pt` - Last model
- `checkpoints/best_face_detection.pt` - Copy of best model

### 7. Evaluate Model

```bash
python train.py  # Calls evaluate() after training
```

Metrics:
- mAP@50
- mAP@50-95
- Precision
- Recall
- Training Loss
- Validation Loss

### 8. Visualize Training Metrics

```bash
python visualize_metrics.py
```

Generated Visualizations:
- `output/loss_vs_epoch.png` - Training/validation loss
- `output/precision_vs_epoch.png` - Precision curve
- `output/recall_vs_epoch.png` - Recall curve
- `output/f1_vs_epoch.png` - F1 score curve
- `output/map_vs_epoch.png` - mAP curves
- `output/training_report.html` - Complete HTML report

Metrics Saved:
- `logs/metrics.csv` - CSV with all metrics per epoch
- `logs/training_log.json` - JSON training log

### 9. Run Inference

#### On Single Image:
```bash
python inference.py --model checkpoints/best_face_detection.pt --source /path/to/image.jpg
```

#### On Video:
```bash
python inference.py --model checkpoints/best_face_detection.pt --source /path/to/video.mp4 --display
```

#### On Webcam:
```bash
python inference.py --model checkpoints/best_face_detection.pt --source webcam
```

#### With Custom Confidence Threshold:
```bash
python inference.py --model checkpoints/best_face_detection.pt --source image.jpg --conf 0.5
```

#### Save Output:
```bash
python inference.py --model checkpoints/best_face_detection.pt --source image.jpg --output output_image.jpg
```

Inference Options:
- `--model`: Path to trained model (default: checkpoints/best_face_detection.pt)
- `--source`: Image/video path or "webcam"
- `--conf`: Confidence threshold (default: 0.25)
- `--output`: Output save path
- `--display`: Display results in real-time (videos/webcam)
- `--device`: cuda/cpu/auto (default: auto)

## Training Configuration

### Key Training Parameters (in train.py):

```python
epochs = 100              # Number of training epochs
batch_size = 16           # Batch size (adjust based on GPU memory)
imgsz = 640              # Training image size
initial_lr = 0.001       # Initial learning rate
momentum = 0.937         # SGD momentum
weight_decay = 0.0005    # L2 regularization
box = 7.5                # Box loss weight
cls = 0.5                # Classification loss weight
dfl = 1.5                # DFL loss weight
```

### Data Augmentation:
```python
flipud = 0.5             # Vertical flip probability
fliplr = 0.5             # Horizontal flip probability
mosaic = 1.0             # Mosaic augmentation probability
hsv_h = 0.015            # HSV hue shift
hsv_s = 0.7              # HSV saturation shift
hsv_v = 0.4              # HSV value shift
degrees = 10.0           # Rotation degrees
translate = 0.1          # Translation fraction
scale = 0.5              # Scale fraction
```

### Transfer Learning:
- Backbone layers 0-9 are frozen initially
- Detection head is trainable
- After 10 epochs, you can unfreeze all layers for fine-tuning

## GPU Requirements

### Recommended GPU Memory:
- **NVIDIA RTX 3080**: 10GB VRAM - batch_size=32, imgsz=1024
- **NVIDIA RTX 3070**: 8GB VRAM - batch_size=16, imgsz=640
- **NVIDIA RTX 3060**: 12GB VRAM - batch_size=16, imgsz=640
- **NVIDIA Tesla V100**: 32GB VRAM - batch_size=64, imgsz=1024

### Reduce Memory Usage:
1. Lower batch size: `batch_size=8`
2. Lower image size: `imgsz=416` or `imgsz=512`
3. Use smaller model: `model_name='yolov8n'` (nano)

### CPU Training:
```bash
# Training on CPU (not recommended, very slow)
python train.py  # Will automatically use CPU if no GPU available
```

## Dataset Information

### WIDER FACE Dataset:
- **32,203 images** across multiple datasets
- **393,703 annotated faces**
- **Training set**: 12,880 images
- **Validation set**: 3,226 images
- **Test set**: 16,097 images
- **Wide variation**: scale, pose, occlusion, illumination, etc.

### YOLO Format:
Each image has a corresponding .txt label file with format:
```
<class_id> <x_center> <y_center> <width> <height>
```
- All values normalized to [0, 1]
- One line per bounding box
- class_id = 0 (face is the only class)

Example:
```
0 0.5 0.5 0.3 0.4
0 0.7 0.6 0.25 0.35
```

## Metrics Explained

### Precision:
- Of all predictions marked as faces, how many are correct?
- High precision = few false positives

### Recall:
- Of all actual faces, how many did the model find?
- High recall = few false negatives

### F1 Score:
- Harmonic mean of precision and recall
- Balances precision and recall

### mAP@50:
- Mean Average Precision at IoU threshold 0.50
- IoU = Intersection over Union

### mAP@50-95:
- mAP averaged across IoU thresholds 0.50-0.95
- More stringent metric

### Accuracy:
- Classification accuracy on detected objects

## Troubleshooting

### CUDA/GPU Issues:
```python
import torch
print(torch.cuda.is_available())  # Check CUDA availability
print(torch.cuda.get_device_name(0))  # Check GPU name
```

### Out of Memory (OOM):
1. Reduce batch size: 16 → 8 → 4
2. Reduce image size: 640 → 416
3. Use smaller model: yolov8s → yolov8n

### No improvement during training:
1. Increase learning rate: 0.001 → 0.01
2. Train longer: epochs = 150
3. Unfreeze backbone earlier
4. Check data quality

### Poor detection results:
1. Increase training epochs
2. Adjust confidence threshold
3. Check dataset statistics
4. Try larger model (yolov8m, yolov8l)

## Advanced Usage

### Resume Training from Checkpoint:
```python
# Modify train.py
results = trainer.train(
    epochs=150,
    resume=True,
    resume_from='checkpoints/face_detection/weights/last.pt'
)
```

### Fine-tune with Different Learning Rate:
```python
results = trainer.train(
    epochs=50,
    initial_lr=0.0001  # Lower learning rate for fine-tuning
)
```

### Use Different Model Size:
```python
trainer = FaceDetectionTrainer(
    model_name='yolov8m'  # Medium model (more accurate but slower)
)
```

### Custom Inference with Batch Processing:
```python
from inference import FaceDetectionInference

engine = FaceDetectionInference('checkpoints/best_face_detection.pt')

# Process multiple images
import os
image_dir = 'path/to/images'
for img_file in os.listdir(image_dir):
    result = engine.infer_image(os.path.join(image_dir, img_file))
    print(f"{img_file}: {result['detections']} faces detected")
```

## References

- YOLOv8 Documentation: https://docs.ultralytics.com/
- WIDER FACE Dataset: http://shuoyang1213.me/WIDERFACE/
- PyTorch Documentation: https://pytorch.org/docs/
- OpenCV Documentation: https://docs.opencv.org/

## License

This project uses:
- YOLOv8 (Ultralytics) - AGPL-3.0
- PyTorch - BSD
- OpenCV - BSD
- WIDER FACE Dataset - Research use

## Credits

- YOLOv8: Ultralytics
- WIDER FACE: Yang et al., 2016 (https://arxiv.org/abs/1511.04353)
- PyTorch: Meta (formerly Facebook)
