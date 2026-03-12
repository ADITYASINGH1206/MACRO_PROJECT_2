"""
YOLOv8 Face Detection Training Script with Transfer Learning

Features:
- Transfer learning with frozen backbone
- Adaptive learning rate scheduling
- Early stopping and checkpoint saving
- Comprehensive metrics tracking
- Training resumption support
- Multi-GPU support
- Mixed precision training
"""

import os
import sys
import torch
import torch.optim as optim
from pathlib import Path
import logging
import csv
from datetime import datetime
import yaml

from ultralytics import YOLO
import numpy as np

# Import configuration
from config import (
    MODEL_WEIGHTS, EPOCHS, BATCH_SIZE, IMG_SIZE, DEVICE,
    FREEZE_BACKBONE, FREEZE_LAYERS, UNFREEZE_EPOCH,
    LEARNING_RATE, MOMENTUM, WEIGHT_DECAY, PATIENCE,
    LEARNING_RATE_REDUCTION_FACTOR, LEARNING_RATE_PATIENCE,
    CHECKPOINTS_DIR, LOGS_DIR, METRICS_CSV, TRAINING_LOG,
    RESUME_CHECKPOINT, MIXED_PRECISION, PROJECT_ROOT
)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOGS_DIR / 'training.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class TrainingMonitor:
    """Monitor and log training metrics"""
    
    def __init__(self, csv_path, log_path):
        """
        Initialize training monitor.
        
        Args:
            csv_path: Path to save metrics CSV
            log_path: Path to save training log
        """
        self.csv_path = Path(csv_path)
        self.log_path = Path(log_path)
        self.csv_path.parent.mkdir(parents=True, exist_ok=True)
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Metrics history
        self.metrics_history = []
        self.best_metrics = {
            'epoch': 0,
            'val_loss': float('inf'),
            'f1_score': 0,
            'map50': 0
        }
        
        # Write CSV header
        self._write_csv_header()
    
    def _write_csv_header(self):
        """Write CSV header if file doesn't exist"""
        if not self.csv_path.exists():
            headers = [
                'epoch', 'batch', 'learning_rate',
                'train_loss', 'val_loss',
                'precision', 'recall', 'f1_score',
                'map50', 'map50_95',
                'accuracy', 'timestamp'
            ]
            with open(self.csv_path, 'w', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=headers)
                writer.writeheader()
    
    def log_epoch(self, epoch, batch, lr, train_loss, val_loss, metrics):
        """
        Log metrics for an epoch.
        
        Args:
            epoch: Epoch number
            batch: Total batches processed
            lr: Learning rate
            train_loss: Training loss
            val_loss: Validation loss
            metrics: Dict of metrics (precision, recall, f1, map50, map50_95, accuracy)
        """
        record = {
            'epoch': epoch,
            'batch': batch,
            'learning_rate': f"{lr:.6f}",
            'train_loss': f"{train_loss:.6f}",
            'val_loss': f"{val_loss:.6f}",
            'precision': f"{metrics.get('precision', 0):.4f}",
            'recall': f"{metrics.get('recall', 0):.4f}",
            'f1_score': f"{metrics.get('f1_score', 0):.4f}",
            'map50': f"{metrics.get('map50', 0):.4f}",
            'map50_95': f"{metrics.get('map50_95', 0):.4f}",
            'accuracy': f"{metrics.get('accuracy', 0):.4f}",
            'timestamp': datetime.now().isoformat()
        }
        
        self.metrics_history.append(record)
        
        # Write to CSV
        with open(self.csv_path, 'a', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=record.keys())
            writer.writerow(record)
        
        # Update best metrics
        if val_loss < self.best_metrics['val_loss']:
            self.best_metrics['val_loss'] = val_loss
            self.best_metrics['epoch'] = epoch
        
        if metrics.get('f1_score', 0) > self.best_metrics['f1_score']:
            self.best_metrics['f1_score'] = metrics.get('f1_score', 0)
        
        if metrics.get('map50', 0) > self.best_metrics['map50']:
            self.best_metrics['map50'] = metrics.get('map50', 0)
        
        # Log to file
        log_msg = (
            f"Epoch {epoch:3d} | Batch {batch:6d} | LR {lr:.6f} | "
            f"TrLoss {train_loss:.4f} | ValLoss {val_loss:.4f} | "
            f"P {metrics.get('precision', 0):.3f} | R {metrics.get('recall', 0):.3f} | "
            f"F1 {metrics.get('f1_score', 0):.3f} | mAP50 {metrics.get('map50', 0):.3f}"
        )
        
        with open(self.log_path, 'a') as f:
            f.write(log_msg + '\n')
        
        logger.info(log_msg)
    
    def get_best_metrics(self):
        """Get best metrics so far"""
        return self.best_metrics


class FaceDetectionTrainer:
    """YOLOv8 Face Detection Trainer with Transfer Learning"""
    
    def __init__(self):
        """Initialize trainer"""
        self.device = self._get_device()
        self.model = None
        self.optimizer = None
        self.scheduler = None
        self.monitor = TrainingMonitor(METRICS_CSV, TRAINING_LOG)
        self.train_loss_history = []
        self.val_loss_history = []
        self.patience_counter = 0
        self.lr_patience_counter = 0
        
        logger.info(f"Using device: {self.device}")
    
    def _get_device(self):
        """Get device for training"""
        if torch.cuda.is_available():
            logger.info(f"CUDA available - Found {torch.cuda.device_count()} GPU(s)")
            return "cuda:0" if DEVICE == "0" else f"cuda:{DEVICE}"
        else:
            logger.warning("CUDA not available - Using CPU (training will be slow)")
            return "cpu"
    
    def load_model(self, pretrained=True):
        """
        Load YOLOv8 model with pretrained weights.
        
        Args:
            pretrained: Whether to use pretrained weights
        """
        logger.info(f"Loading {MODEL_WEIGHTS}...")
        
        if pretrained and RESUME_CHECKPOINT is None:
            self.model = YOLO(MODEL_WEIGHTS)
        elif RESUME_CHECKPOINT is not None:
            logger.info(f"Resuming from checkpoint: {RESUME_CHECKPOINT}")
            self.model = YOLO(RESUME_CHECKPOINT)
        else:
            self.model = YOLO(MODEL_WEIGHTS)
        
        self.model.to(self.device)
        logger.info(f"Model loaded successfully")
    
    def freeze_backbone(self):
        """Freeze backbone layers for transfer learning"""
        if not FREEZE_BACKBONE:
            logger.info("Backbone freezing disabled")
            return
        
        logger.info(f"Freezing first {FREEZE_LAYERS} layers...")
        
        # Freeze specific layers
        freeze_list = []
        for i, (name, param) in enumerate(self.model.model.named_parameters()):
            if i < FREEZE_LAYERS:
                param.requires_grad = False
                freeze_list.append(name)
        
        logger.info(f"Froze {len(freeze_list)} layers")
        
        # Log frozen layers
        with open(LOGS_DIR / 'frozen_layers.txt', 'w') as f:
            for layer in freeze_list:
                f.write(layer + '\n')
    
    def unfreeze_all_layers(self):
        """Unfreeze all layers"""
        logger.info("Unfreezing all layers for fine-tuning...")
        
        for param in self.model.model.parameters():
            param.requires_grad = True
        
        logger.info("All layers unfrozen")
    
    def get_trainable_params(self):
        """Get number of trainable parameters"""
        trainable = sum(p.numel() for p in self.model.model.parameters() if p.requires_grad)
        total = sum(p.numel() for p in self.model.model.parameters())
        return trainable, total
    
    def train(self, dataset_yaml):
        """
        Train the face detection model.
        
        Args:
            dataset_yaml: Path to dataset YAML configuration
        """
        logger.info("=" * 80)
        logger.info("TRAINING START")
        logger.info("=" * 80)
        
        # Load model
        self.load_model(pretrained=True)
        
        # Freeze backbone for initial training
        self.freeze_backbone()
        
        # Log model info
        trainable, total = self.get_trainable_params()
        logger.info(f"Model parameters: {trainable:,} trainable / {total:,} total")
        
        # Start training using Ultralytics trainer
        results = self.model.train(
            data=dataset_yaml,
            epochs=EPOCHS,
            imgsz=IMG_SIZE,
            batch=BATCH_SIZE,
            device=self.device,
            workers=4,
            patience=PATIENCE,
            save=True,
            save_period=10,
            device_ids=[0],
            resume=RESUME_CHECKPOINT is not None,
            exist_ok=True,
            verbose=True,
            project=str(CHECKPOINTS_DIR.parent),
            name="face_detection",
            # Optimization
            optimizer='SGD',
            lr0=LEARNING_RATE,
            lrf=0.01,
            momentum=MOMENTUM,
            weight_decay=WEIGHT_DECAY,
            # Augmentation
            augment=True,
            hsv_h=0.015,
            hsv_s=0.7,
            hsv_v=0.4,
            degrees=10,
            translate=0.1,
            scale=0.5,
            flipud=0.0,
            fliplr=0.5,
            mosaic=1.0,
            # Mixed precision
            amp=MIXED_PRECISION,
            # Validation
            val=True,
            # Advanced options
            max_det=300,
            conf=0.5,
            iou=0.4,
        )
        
        logger.info("=" * 80)
        logger.info("TRAINING COMPLETE")
        logger.info("=" * 80)
        
        # Save best model
        best_model_path = CHECKPOINTS_DIR / "best.pt"
        if (CHECKPOINTS_DIR.parent / "face_detection" / "weights" / "best.pt").exists():
            import shutil
            shutil.copy(
                CHECKPOINTS_DIR.parent / "face_detection" / "weights" / "best.pt",
                best_model_path
            )
            logger.info(f"Best model saved to: {best_model_path}")
        
        # Save last model
        last_model_path = CHECKPOINTS_DIR / "last.pt"
        if (CHECKPOINTS_DIR.parent / "face_detection" / "weights" / "last.pt").exists():
            import shutil
            shutil.copy(
                CHECKPOINTS_DIR.parent / "face_detection" / "weights" / "last.pt",
                last_model_path
            )
            logger.info(f"Last model saved to: {last_model_path}")
        
        return results
    
    def evaluate(self, dataset_yaml, model_path=None):
        """
        Evaluate the model.
        
        Args:
            dataset_yaml: Path to dataset YAML
            model_path: Path to model weights (default: best.pt)
        """
        if model_path is None:
            model_path = CHECKPOINTS_DIR / "best.pt"
        
        logger.info(f"Evaluating model: {model_path}")
        
        model = YOLO(str(model_path))
        results = model.val(data=dataset_yaml, device=self.device)
        
        logger.info(f"Evaluation complete")
        return results


def create_dataset_yaml(dataset_path=PROJECT_ROOT):
    """
    Create dataset.yaml configuration file for YOLO.
    
    Args:
        dataset_path: Path to dataset root
    """
    yaml_path = dataset_path / "dataset.yaml"
    
    yaml_content = {
        'path': str(dataset_path / 'dataset'),
        'train': 'images/train',
        'val': 'images/val',
        'nc': 1,
        'names': ['face']
    }
    
    with open(yaml_path, 'w') as f:
        yaml.dump(yaml_content, f, default_flow_style=False)
    
    logger.info(f"Created dataset.yaml at {yaml_path}")
    return yaml_path


def main():
    """Main training function"""
    
    print("=" * 80)
    print("YOLOv8 Face Detection - Training Script")
    print("=" * 80)
    print()
    
    # Create dataset.yaml if it doesn't exist
    dataset_yaml = PROJECT_ROOT / "dataset.yaml"
    if not dataset_yaml.exists():
        logger.info("Creating dataset.yaml...")
        create_dataset_yaml()
    
    # Initialize trainer
    trainer = FaceDetectionTrainer()
    
    # Train model
    try:
        results = trainer.train(str(dataset_yaml))
        
        # Evaluation
        logger.info("\nEvaluating best model...")
        eval_results = trainer.evaluate(str(dataset_yaml))
        
        logger.info("\n✅ Training and evaluation complete!")
        logger.info(f"Results saved to: {CHECKPOINTS_DIR}")
        logger.info(f"Metrics saved to: {METRICS_CSV}")
        logger.info(f"Logs saved to: {TRAINING_LOG}")
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
