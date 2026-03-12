"""
Configuration file for YOLOv8 Face Detection Project
All hyperparameters and settings are defined here for easy modification
"""

import os
from pathlib import Path

# ============================================================================
# PROJECT PATHS
# ============================================================================
PROJECT_ROOT = Path(__file__).parent
DATASET_DIR = PROJECT_ROOT / "dataset"
IMAGES_TRAIN_DIR = DATASET_DIR / "images" / "train"
IMAGES_VAL_DIR = DATASET_DIR / "images" / "val"
LABELS_TRAIN_DIR = DATASET_DIR / "labels" / "train"
LABELS_VAL_DIR = DATASET_DIR / "labels" / "val"

CHECKPOINTS_DIR = PROJECT_ROOT / "checkpoints"
LOGS_DIR = PROJECT_ROOT / "logs"
OUTPUT_DIR = PROJECT_ROOT / "output"

# Create directories if they don't exist
for directory in [DATASET_DIR, IMAGES_TRAIN_DIR, IMAGES_VAL_DIR, 
                  LABELS_TRAIN_DIR, LABELS_VAL_DIR, CHECKPOINTS_DIR, 
                  LOGS_DIR, OUTPUT_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# ============================================================================
# PROJECT STRUCTURE
# ============================================================================
"""
Expected directory structure:
    dataset/
        images/
            train/     # Training images
            val/       # Validation images
        labels/
            train/     # Training labels (YOLO format)
            val/       # Validation labels (YOLO format)
    checkpoints/       # Saved model checkpoints
    logs/              # Training metrics and logs
    output/            # Inference results
"""

# ============================================================================
# MODEL CONFIGURATION
# ============================================================================
MODEL_NAME = "yolov8s"  # Options: yolov8n, yolov8s, yolov8m, yolov8l, yolov8x
MODEL_WEIGHTS = "yolov8s.pt"  # Pretrained weights
NUM_CLASSES = 1  # Only face class
CLASS_NAMES = ["face"]

# ============================================================================
# TRAINING PARAMETERS
# ============================================================================
EPOCHS = 100
BATCH_SIZE = 16
IMG_SIZE = 640
PATIENCE = 20  # Early stopping patience
LEARNING_RATE = 0.001
MOMENTUM = 0.937
WEIGHT_DECAY = 0.0005

# ============================================================================
# TRANSFER LEARNING STRATEGY
# ============================================================================
FREEZE_BACKBONE = True
FREEZE_LAYERS = 22  # Number of layers to freeze initially
UNFREEZE_EPOCH = 50  # Epoch to unfreeze all layers for full fine-tuning
LEARNING_RATE_REDUCTION_FACTOR = 0.1
LEARNING_RATE_PATIENCE = 10

# ============================================================================
# DATASET PREPROCESSING
# ============================================================================
TARGET_IMAGE_SIZE = (640, 640)
VALID_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.bmp']
VALID_LABEL_EXTENSIONS = ['.txt']
MIN_BOX_AREA = 100  # Minimum area of bounding box in pixels

# ============================================================================
# DEVICE CONFIGURATION
# ============================================================================
DEVICE = "0"  # GPU device ID, "0" for first GPU, "cpu" for CPU only
# If you have multiple GPUs, you can use "0,1,2" for multi-GPU training

# ============================================================================
# METRICS AND LOGGING
# ============================================================================
METRICS_CSV = LOGS_DIR / "training_metrics.csv"
TRAINING_LOG = LOGS_DIR / "training_log.txt"
SAVE_INTERVAL = 10  # Save metrics every N batches
VALIDATION_INTERVAL = 1  # Validate every N epochs

# ============================================================================
# INFERENCE CONFIGURATION
# ============================================================================
CONFIDENCE_THRESHOLD = 0.5
IOU_THRESHOLD = 0.4
MAX_DETECTIONS = 300

# ============================================================================
# DATA AUGMENTATION
# ============================================================================
AUGMENTATION_ENABLED = True
AUGMENTATION_PARAMS = {
    "hsv_h": 0.015,  # HSV-Hue augmentation
    "hsv_s": 0.7,    # HSV-Saturation augmentation
    "hsv_v": 0.4,    # HSV-Value augmentation
    "degrees": 10.0, # Rotation degrees
    "translate": 0.1,  # Translation
    "scale": 0.5,    # Scaling
    "flipud": 0.0,   # Flip upside down
    "fliplr": 0.5,   # Flip left-right
    "mosaic": 1.0,   # Mosaic augmentation
    "perspective": 0.0,  # Perspective augmentation
}

# ============================================================================
# WIDER FACE DATASET CONFIGURATION
# ============================================================================
# Path to WIDER FACE dataset (for annotation_converter.py)
WIDER_FACE_PATH = ""  # Leave empty to prompt for input

# Dataset split percentages (if needed)
TRAIN_SPLIT = 0.85
VAL_SPLIT = 0.15

# ============================================================================
# MIXED PRECISION TRAINING
# ============================================================================
MIXED_PRECISION = True  # Use FP16 for faster training

# ============================================================================
# RESUMING TRAINING
# ============================================================================
RESUME_CHECKPOINT = None  # Set to checkpoint path to resume training

# SGD momentum
MOMENTUM = 0.937

# Weight decay (L2 regularization)
WEIGHT_DECAY = 0.0005

# Warmup epochs (gradually increase lr from 0)
WARMUP_EPOCHS = 3

# Warmup momentum (start momentum value)
WARMUP_MOMENTUM = 0.8

# Warmup bias learning rate
WARMUP_BIAS_LR = 0.1

## ============================================================================
## LOSS WEIGHTS
## ============================================================================

# Box/localization loss weight
BOX_LOSS_WEIGHT = 7.5

# Classification loss weight
CLS_LOSS_WEIGHT = 0.5

# DFL (Distribution Focal Loss) weight
DFL_LOSS_WEIGHT = 1.5

## ============================================================================
## DATA AUGMENTATION
## ============================================================================

# Image flip augmentation

# Vertical flip probability (0.0 = disabled, 1.0 = always)
FLIP_UD = 0.5

# Horizontal flip probability
FLIP_LR = 0.5

# Mosaic augmentation (combine 4 images)
MOSAIC = 1.0

# Mixup augmentation (blend 2 images)
MIXUP = 0.0

# HSV augmentation
# Hue shift
HSV_H = 0.015

# Saturation shift
HSV_S = 0.7

# Value shift
HSV_V = 0.4

# Random rotation (degrees)
ROTATION = 10.0

# Random translation (fraction of image)
TRANSLATION = 0.1

# Random scale (fraction)
SCALE = 0.5

# Perspective transformation probability
PERSPECTIVE = 0.0

# Epochs to disable mosaic augmentation (keep for final training)
CLOSE_MOSAIC = 15

## ============================================================================
## TRAINING MONITORING
## ============================================================================

# Early stopping patience (stop if no improvement for N epochs)
EARLY_STOPPING_PATIENCE = 15

# Frequency to save checkpoints (save every N epochs)
SAVE_PERIOD = 5

# Print verbose output
VERBOSE = False

# Generate plots during training
PLOT = True

## ============================================================================
## TRANSFER LEARNING
## ============================================================================

# Use pretrained weights
PRETRAINED = True

# Number of backbone layers to freeze initially
FREEZE_LAYERS = 10

# Unfreeze backbone after N epochs (0 = never unfreeze)
UNFREEZE_AFTER_EPOCH = 0

## ============================================================================
## DEVICE CONFIGURATION
## ============================================================================

# Device: 'cuda', 'cpu', or None for auto-detection
# 'cuda' - NVIDIA GPU
# 'cpu' - CPU only (slow!)
# None - Automatic detection (recommended)
DEVICE = None

## ============================================================================
## INFERENCE CONFIGURATION
## ============================================================================

# Default model for inference
INFERENCE_MODEL = "checkpoints/best_face_detection.pt"

# Confidence threshold (0.0-1.0)
# Higher = fewer predictions but more confident
# Lower = more predictions including uncertain ones
CONFIDENCE_THRESHOLD = 0.25

# Non-maximum suppression threshold (0.0-1.0)
IOU_THRESHOLD = 0.45

## ============================================================================
## DIRECTORIES
## ============================================================================

# Dataset directory (relative to script location)
DATASET_DIR = "dataset"

# Checkpoints directory
CHECKPOINTS_DIR = "checkpoints"

# Logs directory
LOGS_DIR = "logs"

# Output directory (for visualizations)
OUTPUT_DIR = "output"

## ============================================================================
## ADVANCED OPTIONS (Uncomment to modify)
## ============================================================================

# Multi-scale training (adaptive image size)
# MULTI_SCALE = False

# Rectangular training (use different aspect ratios)
# RECT = False

# Cache images in RAM (faster training, requires more memory)
# CACHE = "disk"  # Options: False, 'disk', 'ram'

# Workers for data loading
# WORKERS = 8

# Pin memory for DataLoader
# PIN_MEMORY = True

# Half precision training (saves memory, slightly faster)
# HALF = False

# Channels last format (for some GPUs)
# CHANNELS_LAST = False

# EMA (Exponential Moving Average) updates
# EMA = True

# AMP (Automatic Mixed Precision)
# AMP = True

## ============================================================================
## EXAMPLE CONFIGURATIONS
## ============================================================================

# Fast training (for testing/prototyping):
# EPOCHS = 10
# BATCH_SIZE = 32
# IMAGE_SIZE = 416
# LEARNING_RATE = 0.01

# High accuracy training:
# EPOCHS = 200
# BATCH_SIZE = 16
# IMAGE_SIZE = 1024
# LEARNING_RATE = 0.001

# Small GPU (4GB VRAM):
# BATCH_SIZE = 8
# IMAGE_SIZE = 416
# MODEL_SIZE = "yolov8n"

# Large GPU (32GB VRAM):
# BATCH_SIZE = 64
# IMAGE_SIZE = 1024
# MODEL_SIZE = "yolov8x"
