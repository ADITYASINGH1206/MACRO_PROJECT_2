# YOLOv8 Face Detection - API Reference Guide

## Table of Contents
1. [Train Module](#train-module)
2. [Inference Module](#inference-module)
3. [Annotation Converter](#annotation-converter)
4. [Dataset Preprocessing](#dataset-preprocessing)
5. [Metrics Visualization](#metrics-visualization)

---

## Train Module

### Class: `FaceDetectionTrainer`

Main class for training YOLOv8 face detection models.

#### Constructor

```python
FaceDetectionTrainer(
    dataset_yaml: str,
    model_name: str = 'yolov8s',
    checkpoint_dir: str = './checkpoints',
    logs_dir: str = './logs',
    device: str = None
)
```

**Parameters:**
- `dataset_yaml`: Path to YAML file with dataset configuration
- `model_name`: YOLOv8 model ('yolov8n', 'yolov8s', 'yolov8m', 'yolov8l', 'yolov8x')
- `checkpoint_dir`: Directory to save model checkpoints
- `logs_dir`: Directory to save training logs
- `device`: 'cuda', 'cpu', or None (auto)

**Example:**
```python
from train import FaceDetectionTrainer

trainer = FaceDetectionTrainer(
    dataset_yaml='dataset.yaml',
    model_name='yolov8s',
    device='cuda'
)
```

#### Methods

##### `create_dataset_yaml()`

```python
def create_dataset_yaml(
    train_dir: str,
    val_dir: str,
    num_classes: int = 1,
    class_names: list = None
) -> str
```

Creates YOLO dataset configuration file.

**Parameters:**
- `train_dir`: Path to training images directory
- `val_dir`: Path to validation images directory
- `num_classes`: Number of classes (default: 1 for faces)
- `class_names`: List of class names (default: ['face'])

**Returns:** Path to created dataset.yaml

**Example:**
```python
trainer.create_dataset_yaml(
    train_dir='dataset/images/train',
    val_dir='dataset/images/val',
    class_names=['face']
)
```

##### `freeze_backbone()`

```python
def freeze_backbone(freeze_until: int = 10)
```

Freeze early layers for transfer learning.

**Parameters:**
- `freeze_until`: Number of layers to freeze

**Example:**
```python
trainer.freeze_backbone(freeze_until=15)
# Freezes first 15 layers, trains detection head
```

##### `unfreeze_backbone()`

```python
def unfreeze_backbone()
```

Unfreeze all layers for full fine-tuning.

**Example:**
```python
trainer.unfreeze_backbone()
# All layers now trainable for fine-tuning
```

##### `train()`

```python
def train(
    epochs: int = 100,
    batch_size: int = 16,
    imgsz: int = 640,
    initial_lr: float = 0.001,
    device: str = None,
    resume: bool = False,
    resume_from: str = None
) -> dict
```

Train the model with comprehensive monitoring.

**Parameters:**
- `epochs`: Number of training epochs
- `batch_size`: Batch size per iteration
- `imgsz`: Training image size
- `initial_lr`: Initial learning rate
- `device`: Device to use
- `resume`: Resume from checkpoint
- `resume_from`: Path to checkpoint

**Returns:** Training results dictionary

**Example:**
```python
results = trainer.train(
    epochs=100,
    batch_size=16,
    imgsz=640,
    initial_lr=0.001
)
```

##### `evaluate()`

```python
def evaluate() -> dict
```

Evaluate model on validation set.

**Returns:** Dictionary with metrics (mAP, precision, recall, etc.)

**Example:**
```python
metrics = trainer.evaluate()
print(f"mAP@50: {metrics.box.map50:.4f}")
print(f"mAP@50-95: {metrics.box.map:.4f}")
```

##### `predict()`

```python
def predict(source: str, conf: float = 0.25) -> list
```

Run inference on images/videos.

**Parameters:**
- `source`: Image/video path or folder
- `conf`: Confidence threshold

**Returns:** List of prediction results

**Example:**
```python
results = trainer.predict('image.jpg', conf=0.5)
for result in results:
    print(f"Detections: {len(result.boxes)}")
```

##### `save_metrics_csv()`

```python
def save_metrics_csv(output_path: str = None)
```

Save training metrics to CSV file.

**Parameters:**
- `output_path`: Path to save CSV (default: logs/metrics.csv)

**Example:**
```python
trainer.save_metrics_csv('training_metrics.csv')
```

##### `save_training_log()`

```python
def save_training_log(output_path: str = None)
```

Save training log to JSON file.

**Parameters:**
- `output_path`: Path to save JSON (default: logs/training_log.json)

**Example:**
```python
trainer.save_training_log('training_log.json')
```

---

## Inference Module

### Class: `FaceDetectionInference`

Run inference on images, videos, and webcam streams.

#### Constructor

```python
FaceDetectionInference(
    model_path: str,
    conf_threshold: float = 0.25,
    device: str = None
)
```

**Parameters:**
- `model_path`: Path to trained model (best.pt)
- `conf_threshold`: Confidence threshold (0-1)
- `device`: 'cuda', 'cpu', or None (auto)

**Example:**
```python
from inference import FaceDetectionInference

engine = FaceDetectionInference(
    model_path='checkpoints/best_face_detection.pt',
    conf_threshold=0.25
)
```

#### Methods

##### `draw_detections()`

```python
def draw_detections(
    image: np.ndarray,
    results,
    line_color: tuple = (0, 255, 0),
    line_thickness: int = 2,
    text_color: tuple = (0, 255, 0),
    text_thickness: int = 1
) -> np.ndarray
```

Draw bounding boxes on image.

**Parameters:**
- `image`: Input image (BGR format)
- `results`: YOLOv8 prediction results
- `line_color`: RGB color tuple for boxes
- `line_thickness`: Thickness of box lines
- `text_color`: Color for confidence text
- `text_thickness`: Thickness of text

**Returns:** Image with drawn detections

**Example:**
```python
import cv2

image = cv2.imread('photo.jpg')
results = engine.model(image)
annotated = engine.draw_detections(image, results[0])
cv2.imshow('Detections', annotated)
```

##### `infer_image()`

```python
def infer_image(
    image_path: str,
    output_path: str = None,
    save_detections: bool = True
) -> dict
```

Run inference on single image.

**Parameters:**
- `image_path`: Path to image file
- `output_path`: Path to save annotated image
- `save_detections`: Whether to save output image

**Returns:** Dictionary with detection results

**Example:**
```python
result = engine.infer_image(
    'photo.jpg',
    output_path='photo_detected.jpg',
    save_detections=True
)

print(f"Detections: {result['detections']}")
print(f"Image size: {result['image_size']}")
print(f"Output: {result['output_path']}")
```

##### `infer_video()`

```python
def infer_video(
    video_path: str,
    output_path: str = None,
    display: bool = False,
    save_output: bool = True
) -> dict
```

Run inference on video file.

**Parameters:**
- `video_path`: Path to video file
- `output_path`: Path to save video with detections
- `display`: Display frames in real-time
- `save_output`: Save annotated video

**Returns:** Dictionary with statistics

**Example:**
```python
result = engine.infer_video(
    'video.mp4',
    output_path='video_detected.mp4',
    display=False,
    save_output=True
)

print(f"Total frames: {result['total_frames']}")
print(f"Total detections: {result['total_detections']}")
print(f"Avg per frame: {result['avg_detections_per_frame']:.2f}")
```

##### `infer_webcam()`

```python
def infer_webcam(display: bool = True)
```

Run inference on webcam stream (real-time).

**Parameters:**
- `display`: Display frames

**Example:**
```python
# Press 'q' to exit
engine.infer_webcam(display=True)
```

---

## Annotation Converter

### Function: `convert_wider_face_to_yolo()`

```python
def convert_wider_face_to_yolo(
    wider_face_dir: str,
    output_dir: str,
    dataset_split: str = "train"
) -> tuple
```

Convert WIDER FACE annotations to YOLO format.

**Parameters:**
- `wider_face_dir`: Path to WIDER FACE root directory
- `output_dir`: Output directory for YOLO format
- `dataset_split`: 'train', 'val', or 'test'

**Returns:** Tuple of (total_images, total_faces, num_failures)

**Example:**
```python
from annotation_converter import convert_wider_face_to_yolo

total_images, total_faces, failures = convert_wider_face_to_yolo(
    wider_face_dir='E:/WIDER_FACE',
    output_dir='.',
    dataset_split='train'
)

print(f"Images: {total_images}")
print(f"Faces: {total_faces}")
print(f"Failures: {failures}")
```

**WIDER FACE Format:**
```
x1 y1 w h blur expression illumination invalid occlusion pose
```

**Output YOLO Format:**
```
<class_id> <x_center> <y_center> <width> <height>
```

All values normalized to [0, 1].

---

## Dataset Preprocessing

### Class: `DatasetPreprocessor`

Validate and preprocess dataset.

#### Constructor

```python
DatasetPreprocessor(
    dataset_dir: str,
    target_size: tuple = (640, 640)
)
```

**Parameters:**
- `dataset_dir`: Path to dataset directory
- `target_size`: Target image size (height, width)

**Example:**
```python
from dataset_preprocessing import DatasetPreprocessor

preprocessor = DatasetPreprocessor(
    dataset_dir='dataset',
    target_size=(640, 640)
)
```

#### Methods

##### `validate_image()`

```python
def validate_image(image_path: str) -> bool
```

Check if image is readable and not corrupted.

**Parameters:**
- `image_path`: Path to image

**Returns:** True if valid, False otherwise

**Example:**
```python
if preprocessor.validate_image('image.jpg'):
    print("Image is valid")
else:
    print("Image is corrupted")
```

##### `validate_label()`

```python
def validate_label(label_path: str) -> bool
```

Check if label file has correct YOLO format.

**Parameters:**
- `label_path`: Path to label file

**Returns:** True if valid, False otherwise

**Example:**
```python
if preprocessor.validate_label('image.txt'):
    print("Label is valid")
```

##### `remove_corrupted_images()`

```python
def remove_corrupted_images(split: str = 'train')
```

Remove images that can't be read or have invalid labels.

**Parameters:**
- `split`: 'train' or 'val'

**Example:**
```python
preprocessor.remove_corrupted_images('train')
print(f"Removed: {preprocessor.stats['corrupted_images']}")
```

##### `resize_images()`

```python
def resize_images(
    split: str = 'train',
    keep_aspect_ratio: bool = True
)
```

Resize images to target size.

**Parameters:**
- `split`: 'train' or 'val'
- `keep_aspect_ratio`: Preserve aspect ratio with padding

**Example:**
```python
preprocessor.resize_images('train', keep_aspect_ratio=True)
```

##### `get_dataset_statistics()`

```python
def get_dataset_statistics(split: str = 'train') -> dict
```

Get dataset statistics.

**Parameters:**
- `split`: 'train' or 'val'

**Returns:** Dictionary with statistics

**Example:**
```python
stats = preprocessor.get_dataset_statistics('train')
print(f"Total images: {stats['total_images']}")
print(f"Total faces: {stats['total_faces']}")
print(f"Avg faces/image: {stats['avg_faces_per_image']:.2f}")
```

##### `preprocess_all()`

```python
def preprocess_all(splits: list = ['train', 'val'])
```

Run full preprocessing pipeline.

**Parameters:**
- `splits`: List of splits to process

**Example:**
```python
preprocessor.preprocess_all(['train', 'val'])
```

---

## Metrics Visualization

### Class: `MetricsVisualizer`

Visualize training metrics and generate reports.

#### Constructor

```python
MetricsVisualizer(
    logs_dir: str = './logs',
    output_dir: str = './output'
)
```

**Parameters:**
- `logs_dir`: Directory with metrics CSV
- `output_dir`: Directory to save visualizations

**Example:**
```python
from visualize_metrics import MetricsVisualizer

visualizer = MetricsVisualizer(
    logs_dir='logs',
    output_dir='output'
)
```

#### Methods

##### `load_metrics()`

```python
def load_metrics(csv_path: str = None) -> bool
```

Load metrics from CSV file.

**Parameters:**
- `csv_path`: Path to metrics.csv

**Returns:** True if successful

**Example:**
```python
if visualizer.load_metrics('logs/metrics.csv'):
    print("Metrics loaded successfully")
```

##### `plot_loss_vs_epoch()`

```python
def plot_loss_vs_epoch()
```

Generate loss curve plot.

**Example:**
```python
visualizer.plot_loss_vs_epoch()
# Saves: output/loss_vs_epoch.png
```

##### `plot_precision_vs_epoch()`

```python
def plot_precision_vs_epoch()
```

Generate precision curve plot.

**Example:**
```python
visualizer.plot_precision_vs_epoch()
# Saves: output/precision_vs_epoch.png
```

##### `plot_recall_vs_epoch()`

```python
def plot_recall_vs_epoch()
```

Generate recall curve plot.

**Example:**
```python
visualizer.plot_recall_vs_epoch()
# Saves: output/recall_vs_epoch.png
```

##### `plot_f1_vs_epoch()`

```python
def plot_f1_vs_epoch()
```

Generate F1 score curve plot.

**Example:**
```python
visualizer.plot_f1_vs_epoch()
# Saves: output/f1_vs_epoch.png
```

##### `plot_map_vs_epoch()`

```python
def plot_map_vs_epoch()
```

Generate mAP curve plot.

**Example:**
```python
visualizer.plot_map_vs_epoch()
# Saves: output/map_vs_epoch.png
```

##### `plot_all_metrics()`

```python
def plot_all_metrics()
```

Generate all plots at once.

**Example:**
```python
visualizer.plot_all_metrics()
# Generates all 5 plots
```

##### `generate_report()`

```python
def generate_report()
```

Generate HTML report with embedded images.

**Example:**
```python
visualizer.generate_report()
# Saves: output/training_report.html
```

---

## Advanced Examples

### Complete Training Pipeline

```python
from train import FaceDetectionTrainer

# Create trainer
trainer = FaceDetectionTrainer(
    dataset_yaml='dataset.yaml',
    model_name='yolov8s'
)

# Freeze backbone
trainer.freeze_backbone(freeze_until=10)

# Train
results = trainer.train(
    epochs=100,
    batch_size=16,
    imgsz=640
)

# Evaluate
metrics = trainer.evaluate()

# Save metrics
trainer.save_metrics_csv()
trainer.save_training_log()
```

### Batch Inference

```python
from inference import FaceDetectionInference
import os

engine = FaceDetectionInference('checkpoints/best_face_detection.pt')

results = []
for img_file in os.listdir('test_images/'):
    if img_file.lower().endswith(('.jpg', '.png')):
        result = engine.infer_image(
            f'test_images/{img_file}',
            save_detections=True
        )
        results.append(result)

# Summary
total_detections = sum(r['detections'] for r in results)
print(f"Total faces detected: {total_detections}")
```

### Full Visualization Pipeline

```python
from visualize_metrics import MetricsVisualizer

visualizer = MetricsVisualizer('logs', 'output')

visualizer.load_metrics()
visualizer.load_training_log()
visualizer.print_summary()
visualizer.plot_all_metrics()
visualizer.generate_report()
```

---

## Error Handling

### Common Errors and Solutions

**FileNotFoundError: Model not found**
```python
# Solution: Check model path exists
import os
assert os.path.exists('checkpoints/best_face_detection.pt')
```

**CUDA out of memory**
```python
# Solution: Reduce batch size or image size
results = trainer.train(batch_size=8, imgsz=416)
```

**No images in dataset**
```python
# Solution: Run annotation converter first
python annotation_converter.py
```

**Poor metrics**
```python
# Solutions:
# 1. Train longer
results = trainer.train(epochs=200)

# 2. Use larger model
trainer = FaceDetectionTrainer(model_name='yolov8m')

# 3. Increase learning rate
results = trainer.train(initial_lr=0.01)
```

---

## Performance Tips

1. **GPU Memory**: Monitor with `nvidia-smi`
2. **Batch Size**: Larger = faster but more memory
3. **Image Size**: Larger = more accurate but slower
4. **Data Augmentation**: Helps with overfitting
5. **Learning Rate**: Lower for stability, higher for speed

For more information, see USAGE_GUIDE.md
