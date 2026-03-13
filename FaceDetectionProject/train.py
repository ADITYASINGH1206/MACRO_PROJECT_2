import os
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
import torch
import pandas as pd
import matplotlib.pyplot as plt
from ultralytics import YOLO
import logging
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(os.path.dirname(__file__), "training.log")),
        logging.StreamHandler()
    ]
)

class TrainingMonitor:
    def __init__(self, output_csv=os.path.join(os.path.dirname(__file__), "metrics.csv")):
        self.output_csv = output_csv
        self.metrics_data = []

    def on_fit_epoch_end(self, trainer):
        """Called after both training and validation for each epoch."""
        metrics = trainer.metrics
        epoch = trainer.epoch

        # Extract individual train losses
        train_box = trainer.loss_items[0].item() if hasattr(trainer, 'loss_items') and trainer.loss_items is not None else 0
        train_cls = trainer.loss_items[1].item() if hasattr(trainer, 'loss_items') and trainer.loss_items is not None and len(trainer.loss_items) > 1 else 0
        train_dfl = trainer.loss_items[2].item() if hasattr(trainer, 'loss_items') and trainer.loss_items is not None and len(trainer.loss_items) > 2 else 0

        # Extract individual val losses
        val_box = metrics.get('val/box_loss', 0)
        val_cls = metrics.get('val/cls_loss', 0)
        val_dfl = metrics.get('val/dfl_loss', 0)

        # Detection performance metrics
        precision = metrics.get('metrics/precision(B)', 0)
        recall = metrics.get('metrics/recall(B)', 0)
        f1 = 2 * (precision * recall) / (precision + recall + 1e-9)
        mAP50 = metrics.get('metrics/mAP50(B)', 0)
        mAP50_95 = metrics.get('metrics/mAP50-95(B)', 0)

        epoch_metrics = {
            "epoch": epoch + 1,
            # Train losses (individual + total)
            "train_box_loss": round(train_box, 5),
            "train_cls_loss": round(train_cls, 5),
            "train_dfl_loss": round(train_dfl, 5),
            "train_total_loss": round(train_box + train_cls + train_dfl, 5),
            # Val losses (individual + total)
            "val_box_loss": round(val_box, 5),
            "val_cls_loss": round(val_cls, 5),
            "val_dfl_loss": round(val_dfl, 5),
            "val_total_loss": round(val_box + val_cls + val_dfl, 5),
            # Performance metrics
            "precision": round(precision, 5),
            "recall": round(recall, 5),
            "f1": round(f1, 5),
            "mAP50": round(mAP50, 5),
            "mAP50-95": round(mAP50_95, 5),
        }

        self.metrics_data.append(epoch_metrics)
        df = pd.DataFrame(self.metrics_data)
        df.to_csv(self.output_csv, index=False)

        logging.info(
            f"Epoch {epoch+1} | "
            f"Train Loss: {epoch_metrics['train_total_loss']:.4f} (box={train_box:.4f} cls={train_cls:.4f} dfl={train_dfl:.4f}) | "
            f"Val Loss: {epoch_metrics['val_total_loss']:.4f} | "
            f"P={precision:.4f} R={recall:.4f} F1={f1:.4f} | "
            f"mAP50={mAP50:.4f} mAP50-95={mAP50_95:.4f}"
        )

def plot_metrics(csv_path):
    df = pd.read_csv(csv_path)
    epochs = df['epoch']
    
    plt.figure(figsize=(18, 12))
    
    # Train loss breakdown
    plt.subplot(2, 4, 1)
    plt.plot(epochs, df['train_box_loss'], label='Box')
    plt.plot(epochs, df['train_cls_loss'], label='Cls')
    plt.plot(epochs, df['train_dfl_loss'], label='DFL')
    plt.title('Train Loss Components')
    plt.xlabel('Epoch')
    plt.legend()

    # Total loss comparison
    plt.subplot(2, 4, 2)
    plt.plot(epochs, df['train_total_loss'], label='Train')
    plt.plot(epochs, df['val_total_loss'], label='Val')
    plt.title('Total Loss: Train vs Val')
    plt.xlabel('Epoch')
    plt.legend()
    
    # Val loss breakdown
    plt.subplot(2, 4, 3)
    plt.plot(epochs, df['val_box_loss'], label='Box')
    plt.plot(epochs, df['val_cls_loss'], label='Cls')
    plt.plot(epochs, df['val_dfl_loss'], label='DFL')
    plt.title('Val Loss Components')
    plt.xlabel('Epoch')
    plt.legend()

    # Precision plot
    plt.subplot(2, 4, 4)
    plt.plot(epochs, df['precision'], label='Precision', color='g')
    plt.title('Precision vs Epoch')
    plt.xlabel('Epoch')
    
    # Recall plot
    plt.subplot(2, 4, 5)
    plt.plot(epochs, df['recall'], label='Recall', color='b')
    plt.title('Recall vs Epoch')
    plt.xlabel('Epoch')
    
    # F1 plot
    plt.subplot(2, 4, 6)
    plt.plot(epochs, df['f1'], label='F1 Score', color='r')
    plt.title('F1 Score vs Epoch')
    plt.xlabel('Epoch')
    
    # mAP plot
    plt.subplot(2, 4, 7)
    plt.plot(epochs, df['mAP50'], label='mAP@50')
    plt.plot(epochs, df['mAP50-95'], label='mAP@50-95')
    plt.title('mAP vs Epoch')
    plt.xlabel('Epoch')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig(os.path.join(os.path.dirname(__file__), "training_plots.png"), dpi=150)
    plt.show()

def train_face_detector(
    model_name='yolov8s.pt',
    epochs=120,
    batch=4,
    imgsz=640,
    resume=False
):
    # 1. Load Pretrained Weights
    model = YOLO(model_name)
    
    # 2. GPU Support
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    logging.info(f"Using device: {device}")

    # 3. Check for resume from checkpoint (explicit opt-in)
    project_dir = os.path.join(os.path.dirname(__file__), 'face_detection_run')
    last_ckpt = os.path.join(project_dir, 'yolov8s_face', 'weights', 'last.pt')
    can_resume = resume and os.path.exists(last_ckpt)
    
    if can_resume:
        logging.info(f"Resuming training from checkpoint: {last_ckpt}")
        model = YOLO(last_ckpt)
    elif resume:
        logging.warning(f"Resume requested but checkpoint not found: {last_ckpt}")

    # 4. Monitoring setup — add callback AFTER potential model reload
    monitor = TrainingMonitor()
    model.add_callback("on_fit_epoch_end", monitor.on_fit_epoch_end)

    # 5. Start Training
    results = model.train(
        data=os.path.join(os.path.dirname(__file__), 'face_detection.yaml'),
        epochs=epochs,
        batch=batch,
        imgsz=imgsz,
        device=device,
        project=project_dir,
        name='yolov8s_face',
        freeze=0,             # Unfreeze backbone for better domain adaptation
        patience=40,          # Allow longer convergence on tiny-face-heavy data
        lr0=0.01,             # Initial learning rate
        lrf=0.01,
        cos_lr=True,
        optimizer='AdamW',
        close_mosaic=15,
        multi_scale=False,
        plots=False,
        save=True,            # Save best.pt and last.pt
        save_period=5,        # Save checkpoint every 5 epochs (epoch5.pt, epoch10.pt, etc.)
        exist_ok=True,
        resume=can_resume,
        workers=0,
        # amp = True              # Use mixed precision for faster training and lower memory usage
    )

    logging.info("Training completed.")
    plot_metrics(os.path.join(os.path.dirname(__file__), "metrics.csv"))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train YOLOv8 face detector")
    parser.add_argument('--model', type=str, default='yolov8s.pt', help='Base pretrained model')
    parser.add_argument('--epochs', type=int, default=120, help='Number of training epochs')
    parser.add_argument('--batch', type=int, default=4, help='Batch size')
    parser.add_argument('--imgsz', type=int, default=960, help='Training image size')
    parser.add_argument('--resume', action='store_true', help='Resume from last checkpoint')
    args = parser.parse_args()

    train_face_detector(
        model_name=args.model,
        epochs=args.epochs,
        batch=args.batch,
        imgsz=args.imgsz,
        resume=args.resume,
    )
