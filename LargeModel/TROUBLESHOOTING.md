# YOLOv8 Face Detection - Troubleshooting Guide

## Common Issues and Solutions

### 1. Installation & Dependency Issues

#### Issue: `ModuleNotFoundError: No module named 'torch'`

**Solution:**
```bash
# Install PyTorch with CPU support
pip install torch torchvision

# Or with GPU (CUDA 12.1) support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Or install all dependencies at once
pip install -r requirements.txt
```

#### Issue: `ModuleNotFoundError: No module named 'ultralytics'`

**Solution:**
```bash
pip install ultralytics
# Or
pip install -r requirements.txt
```

#### Issue: Version conflicts with existing packages

**Solution:**
```bash
# Create a clean virtual environment
python -m venv yolo_env

# Activate it
# On Windows:
yolo_env\Scripts\activate
# On Linux/Mac:
source yolo_env/bin/activate

# Install requirements
pip install -r requirements.txt
```

---

### 2. GPU & CUDA Issues

#### Issue: `CUDA out of memory` during training

**Solutions (try in order):**

1. **Reduce batch size:**
```python
# In train.py, change:
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

5. **Check running processes:**
```bash
# Windows
tasklist | findstr python

# Linux
ps aux | grep python
```

#### Issue: `torch.cuda.is_available()` returns `False`

**Diagnosis:**
```python
import torch
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"CUDA version: {torch.version.cuda}")
print(f"cuDNN version: {torch.backends.cudnn.version()}")
```

**Solutions:**

1. **Check GPU is detected:**
```bash
# Windows
nvidia-smi

# Linux
nvidia-smi
```

2. **Reinstall PyTorch with CUDA support:**
```bash
# Find your CUDA version
nvidia-smi | grep CUDA

# Install matching PyTorch (update URL based on your CUDA version)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

3. **Check NVIDIA drivers:**
```bash
# Update drivers from https://www.nvidia.com/Download/index.aspx
```

#### Issue: `RuntimeError: CUDA device not found`

**Solution:**
```python
# Force CPU usage
engine = FaceDetectionInference(
    model_path='model.pt',
    device='cpu'
)

# Or in training
trainer = FaceDetectionTrainer(device='cpu')
```

---

### 3. Dataset Issues

#### Issue: `FileNotFoundError: Dataset directory not found`

**Solution:**

1. **Check directory structure:**
```bash
# Should be:
LargeModel/
├── dataset/
│   ├── images/
│   │   ├── train/
│   │   └── val/
│   └── labels/
│       ├── train/
│       └── val/
```

2. **Create directories if missing:**
```python
import os
os.makedirs('dataset/images/train', exist_ok=True)
os.makedirs('dataset/images/val', exist_ok=True)
os.makedirs('dataset/labels/train', exist_ok=True)
os.makedirs('dataset/labels/val', exist_ok=True)
```

#### Issue: `annotation_converter.py` - No images found after conversion

**Solution:**

1. **Check WIDER FACE structure:**
```
WIDER_FACE/
├── WIDER_train/
│   ├── images/
│   ├── annotations/
│   └── event_list.txt
├── WIDER_val/
├── WIDER_test/
```

2. **Verify paths in converter:**
```python
# Check in annotation_converter.py
wider_images_dir = os.path.join(wider_face_dir, "WIDER_train", "images")
wider_annot_dir = os.path.join(wider_face_dir, "WIDER_train", "annotations")

print(f"Images dir: {wider_images_dir}")
print(f"Annot dir: {wider_annot_dir}")
print(f"Exists: {os.path.exists(wider_images_dir)}")
```

3. **Manual conversion check:**
```python
from annotation_converter import convert_wider_face_to_yolo

total_img, total_faces, failures = convert_wider_face_to_yolo(
    '/path/to/WIDER_FACE',
    '.',
    'train'
)
print(f"Images: {total_img}, Faces: {total_faces}, Failures: {failures}")
```

#### Issue: No images in train/val directories after preprocessing

**Solution:**

```python
from dataset_preprocessing import DatasetPreprocessor

preprocessor = DatasetPreprocessor('dataset')
stats = preprocessor.get_dataset_statistics('train')

print(f"Total images: {stats['total_images']}")
print(f"Total faces: {stats['total_faces']}")
print(f"Avg faces per image: {stats['avg_faces_per_image']}")

# If all zeros, images weren't converted properly
```

#### Issue: Corrupted images in dataset

**Solution:**

```bash
# Run preprocessing to automatically remove bad files
python dataset_preprocessing.py

# Or manually check:
python -c "
import cv2
import os

img_dir = 'dataset/images/train'
for img in os.listdir(img_dir)[:5]:
    path = os.path.join(img_dir, img)
    img_read = cv2.imread(path)
    if img_read is None:
        print(f'Corrupted: {img}')
    else:
        print(f'OK: {img} - {img_read.shape}')
"
```

---

### 4. Training Issues

#### Issue: Training won't start / immediate crash

**Solutions:**

1. **Check dataset.yaml exists:**
```bash
# Should be in LargeModel/dataset.yaml
# If not, training script creates it automatically
python -c "import os; print(os.path.exists('dataset.yaml'))"
```

2. **Verify dataset.yaml format:**
```bash
cat dataset.yaml
# Should show:
# path: /path/to/dataset
# train: /path/to/dataset/images/train
# val: /path/to/dataset/images/val
# nc: 1
# names:
#   0: face
```

3. **Check for syntax errors:**
```bash
python -m py_compile train.py
# If no output, syntax is OK
```

#### Issue: Training is very slow

**Causes and Solutions:**

1. **Using CPU instead of GPU:**
```python
import torch
print(torch.cuda.is_available())  # Should be True

# Force GPU in code
trainer = FaceDetectionTrainer(device='cuda')
```

2. **Small batch size:**
```python
# Increase (if GPU memory allows)
trainer.train(batch_size=32)  # From 16
```

3. **Too many workers in DataLoader:**
```python
# Check in train.py, reduce workers if CPU usage is 100%
# workers: 8  # Try reducing to 4 or 2
```

4. **Disk I/O bottleneck:**
```python
# Enable image caching
trainer.train(cache='disk')  # Cache to disk
trainer.train(cache='ram')   # Cache to RAM (faster but needs memory)
```

#### Issue: Training loss is NaN or Inf

**Causes and Solutions:**

1. **Learning rate too high:**
```python
# Reduce learning rate
trainer.train(initial_lr=0.0001)  # From 0.001
```

2. **Bad data in dataset:**
```python
# Run preprocessing
python dataset_preprocessing.py

# Check for extreme values
import numpy as np
# verify label values are in [0, 1]
```

3. **Gradient explosion:**
```python
# Enable gradient clipping (add to train params)
# max_grad_norm: 10.0
```

#### Issue: Training not improving / metrics plateau

**Solutions:**

1. **Train longer:**
```python
trainer.train(epochs=150)  # From 100
```

2. **Unfreeze backbone:**
```python
trainer.unfreeze_backbone()
trainer.train(epochs=50, initial_lr=0.0001)
```

3. **Increase data augmentation:**
```python
# Increase aug probability in train.py
'flipud': 0.7,        # Increase from 0.5
'fliplr': 0.7,        # Increase from 0.5
'degrees': 20.0,      # Increase from 10.0
```

4. **Use larger model:**
```python
trainer = FaceDetectionTrainer(model_name='yolov8m')
```

5. **Lower learning rate:**
```python
trainer.train(initial_lr=0.0005)
```

#### Issue: High training loss but low validation loss (overfitting)

**Solutions:**

1. **Increase augmentation:**
```python
# In train.py
'mixup': 0.2,     # Enable mixup
'mosaic': 1.0,    # Use mosaic
```

2. **Increase dropout/regularization:**
```python
trainer.train(weight_decay=0.001)  # Increase from 0.0005
```

3. **More training data needed:**
```bash
# Download more data or use additional datasets
```

---

### 5. Inference Issues

#### Issue: `FileNotFoundError: Model not found`

**Solution:**

```python
import os

# Check model path
model_path = 'checkpoints/best_face_detection.pt'
print(f"Model exists: {os.path.exists(model_path)}")

# List checkpoint directory
import os
print(os.listdir('checkpoints'))
```

#### Issue: Inference is very slow

**Solutions:**

1. **Use GPU:**
```bash
python inference.py --device cuda --source image.jpg
```

2. **Use faster model:**
```bash
# Retrain with yolov8n instead of yolov8s
python train.py  # Change MODEL_SIZE in code
```

3. **Lower image resolution:**
```bash
# Resize image before inference
python -c "
import cv2

img = cv2.imread('image.jpg')
resized = cv2.resize(img, (432, 432))
cv2.imwrite('resized.jpg', resized)
"
```

#### Issue: Poor detection quality / missing faces

**Solutions:**

1. **Lower confidence threshold:**
```bash
# More detections, possibly with false positives
python inference.py --source image.jpg --conf 0.1  # From 0.25
```

2. **Use larger model:**
```bash
# Retrain with yolov8m or yolov8l
```

3. **Train longer:**
```bash
# Retrain with more epochs
```

4. **Check image quality:**
```python
# Low resolution images may not work well
import cv2
img = cv2.imread('test.jpg')
print(f"Image size: {img.shape}")  # Should be reasonable size
```

#### Issue: Too many false positives

**Solutions:**

1. **Increase confidence threshold:**
```bash
python inference.py --source image.jpg --conf 0.5  # From 0.25
```

2. **Retrain with better data cleaning:**
```bash
python dataset_preprocessing.py  # Remove bad annotations
```

---

### 6. Visualization Issues

#### Issue: `visualize_metrics.py` - No metrics found

**Solution:**

```bash
# Check if training completed
ls logs/
# Should contain: metrics.csv, training_log.json

# If empty, training didn't complete
python train.py  # First train the model
```

#### Issue: Plots not generating / file errors

**Solution:**

```python
# Check matplotlib backend
import matplotlib
print(matplotlib.get_backend())

# Use non-interactive backend
import matplotlib
matplotlib.use('Agg')  # Add before importing pyplot
```

#### Issue: HTML report not opening

**Solution:**

```bash
# Open with browser directly
# Windows
start output/training_report.html

# Linux
xdg-open output/training_report.html

# Mac
open output/training_report.html
```

---

### 7. Memory Issues

#### Issue: System running out of RAM (not GPU)

**Solutions:**

1. **Close other applications**

2. **Reduce number of workers:**
```python
# In train.py, reduce workers for DataLoader
'workers': 2  # From 4 or 8
```

3. **Disable image caching:**
```python
'cache': False  # Don't cache images to RAM
```

#### Issue: Swap memory being used indicates insufficient system RAM

**Solution:**

```bash
# Check available RAM
# Windows
wmic OS get TotalVisibleMemorySize,FreePhysicalMemory

# Linux
free -h

# Recommended: 32GB+ for WIDER FACE with large batch sizes
```

---

### 8. File Access Issues

#### Issue: `PermissionError` when saving models

**Solution:**

```bash
# Check folder permissions
ls -la checkpoints/  # Linux/Mac
dir checkpoints     # Windows

# Grant write permissions (Linux/Mac)
chmod -R 755 checkpoints/
chmod -R 755 logs/
chmod -R 755 output/
```

#### Issue: Cannot write to disk - disk full

**Solution:**

```bash
# Check disk space
# Windows
dir C:\

# Linux
df -h

# Clean up old checkpoints if needed
rm checkpoints/face_detection/weights/epoch*.pt
```

---

### 9. Windows-Specific Issues

#### Issue: `ModuleNotFoundError` on Windows with spaces in path

**Solution:**

```bash
# Use environment variable instead
set PYTHONPATH=%CD%
python train.py
```

#### Issue: Path separators (backslash vs forward slash)

**Solution:**

```python
# Always use pathlib for cross-platform compatibility
from pathlib import Path

dataset_dir = Path('dataset')
image_path = dataset_dir / 'images' / 'train' / 'img.jpg'
print(image_path)  # Works on Windows and Linux
```

---

### 10. Conda/Virtual Environment Issues

#### Issue: Python packages not found in virtual environment

**Solution:**

```bash
# Verify you're in the right environment
which python  # Should show path to venv/bin/python

# If not, reactivate
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Verify
python -c "import sys; print(sys.prefix)"
```

#### Issue: Different Python versions causing issues

**Solution:**

```bash
# Use Python 3.9 - 3.11 (3.8 is supported but older)
python --version  # Should be 3.8+

# If using system Python, create venv with specific version
python3.10 -m venv venv
```

---

## Debugging Checklist

Before posting issues, check:

- [ ] Python 3.8+ installed
- [ ] All dependencies installed (`pip install -r requirements.txt`)
- [ ] WIDER FACE dataset properly downloaded
- [ ] Annotations converted to YOLO format
- [ ] Dataset validated with preprocessing script
- [ ] GPU detected (if using CUDA)
- [ ] Sufficient disk space
- [ ] No other Python processes using GPU
- [ ] dataset.yaml file exists
- [ ] File permissions correct

## Getting Help

### Enable Debug Output

```python
# In train.py, set verbose=True
trainer.train(
    verbose=True  # See detailed training logs
)
```

### Check System Information

```python
import torch
import cv2
import numpy as np
import sys

print(f"Python: {sys.version}")
print(f"PyTorch: {torch.__version__}")
print(f"CUDA: {torch.version.cuda}")
print(f"OpenCV: {cv2.__version__}")
print(f"NumPy: {np.__version__}")

import platform
print(f"OS: {platform.system()} {platform.release()}")
print(f"GPU: {torch.cuda.get_device_name(0)}" if torch.cuda.is_available() else "CPU only")
```

### Save Error Information

```bash
# Capture full error output
python train.py > train_log.txt 2>&1

# Share train_log.txt when asking for help
```

---

## Performance Optimization Tips

### For Faster Training

1. Increase batch size (if GPU memory allows)
2. Reduce image size (640 → 416)
3. Enable AMP training
4. Use smaller model (yolov8n)
5. Reduce num_workers

### For Better Accuracy

1. Larger model (yolov8m, yolov8l)
2. Larger image size (640 → 1024)
3. More epochs (100 → 200)
4. Stronger augmentation
5. Unfreeze backbone after initial training

### For Stable Training

1. Lower learning rate (0.001 → 0.0001)
2. Warmup epochs enabled
3. Gradient clipping
4. Larger batch size (if possible)
5. Data validation before training

---

Last updated: March 2026
For latest issues and solutions, check: https://github.com/ultralytics/yolov8
