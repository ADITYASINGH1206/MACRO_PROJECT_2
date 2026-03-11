import os
import pandas as pd
import matplotlib.pyplot as plt
from ultralytics import YOLO
import torch
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("c:/Users/ADITYA/Desktop/MITS/4thsem/Macro/FaceDetectionProject/training.log"),
        logging.StreamHandler()
    ]
)

class TrainingMonitor:
    def __init__(self, output_csv="c:/Users/ADITYA/Desktop/MITS/4thsem/Macro/FaceDetectionProject/metrics.csv"):
        self.output_csv = output_csv
        self.metrics_data = []

    def on_train_epoch_end(self, trainer):
        # Extract metrics from trainer
        metrics = trainer.metrics
        epoch = trainer.epoch
        
        # YOLOv8 metrics keys might vary slightly, but generally:
        # metrics['metrics/precision(B)'], metrics['metrics/recall(B)'], etc.
        
        epoch_metrics = {
            "epoch": epoch + 1,
            "train_loss": trainer.loss_items[0].item() if hasattr(trainer, 'loss_items') else 0,
            "val_loss": metrics.get('val/box_loss', 0) + metrics.get('val/cls_loss', 0) + metrics.get('val/dfl_loss', 0),
            "precision": metrics.get('metrics/precision(B)', 0),
            "recall": metrics.get('metrics/recall(B)', 0),
            "f1": 2 * (metrics.get('metrics/precision(B)', 0) * metrics.get('metrics/recall(B)', 0)) / 
                  (metrics.get('metrics/precision(B)', 0) + metrics.get('metrics/recall(B)', 0) + 1e-9),
            "mAP50": metrics.get('metrics/mAP50(B)', 0),
            "mAP50-95": metrics.get('metrics/mAP50-95(B)', 0)
        }
        
        self.metrics_data.append(epoch_metrics)
        df = pd.DataFrame(self.metrics_data)
        df.to_csv(self.output_csv, index=False)
        
        logging.info(f"Epoch {epoch+1} Metrics: {epoch_metrics}")

def plot_metrics(csv_path):
    df = pd.read_csv(csv_path)
    epochs = df['epoch']
    
    plt.figure(figsize=(15, 10))
    
    # Loss plot
    plt.subplot(2, 3, 1)
    plt.plot(epochs, df['train_loss'], label='Train Loss')
    plt.plot(epochs, df['val_loss'], label='Val Loss')
    plt.title('Loss vs Epoch')
    plt.legend()
    
    # Precision plot
    plt.subplot(2, 3, 2)
    plt.plot(epochs, df['precision'], label='Precision', color='g')
    plt.title('Precision vs Epoch')
    
    # Recall plot
    plt.subplot(2, 3, 3)
    plt.plot(epochs, df['recall'], label='Recall', color='b')
    plt.title('Recall vs Epoch')
    
    # F1 plot
    plt.subplot(2, 3, 4)
    plt.plot(epochs, df['f1'], label='F1 Score', color='r')
    plt.title('F1 Score vs Epoch')
    
    # mAP plot
    plt.subplot(2, 3, 5)
    plt.plot(epochs, df['mAP50'], label='mAP@50')
    plt.plot(epochs, df['mAP50-95'], label='mAP@50-95')
    plt.title('mAP vs Epoch')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig("c:/Users/ADITYA/Desktop/MITS/4thsem/Macro/FaceDetectionProject/training_plots.png")
    plt.show()

def train_face_detector():
    # 1. Load Pretrained Weights
    model = YOLO('yolov8s.pt')
    
    # 2. GPU Support
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    logging.info(f"Using device: {device}")

    # 3. Transfer Learning Strategy: Freeze Backbone
    # YOLOv8 backbone is usually layers 0-9
    def freeze_backbone(model):
        for i, (name, param) in enumerate(model.model.named_parameters()):
            if i < 100: # Heuristic for backbone layers in s-model, 
                         # better to use model.model.parameters() index if known
                param.requires_grad = False
        logging.info("Backbone layers frozen for initial fine-tuning.")

    # Note: Ultralytics has a 'freeze' argument in train() which is easier
    # freeze=10 will freeze first 10 layers (backbone)

    # 4. Monitoring setup
    monitor = TrainingMonitor()
    model.add_callback("on_train_epoch_end", monitor.on_train_epoch_end)

    # 5. Start Training
    # To resume training, set resume=True and load last.pt instead of yolov8s.pt
    last_ckpt = 'c:/Users/ADITYA/Desktop/MITS/4thsem/Macro/FaceDetectionProject/face_detection_run/yolov8s_face/weights/last.pt'
    resume = os.path.exists(last_ckpt)
    
    if resume:
        logging.info("Resuming training from last checkpoint.")
        model = YOLO(last_ckpt)

    results = model.train(
        data='c:/Users/ADITYA/Desktop/MITS/4thsem/Macro/FaceDetectionProject/face_detection.yaml',
        epochs=100,
        batch=16,
        imgsz=640,
        device=device,
        project='face_detection_run',
        name='yolov8s_face',
        freeze=10, # Freeze backbone
        patience=20, # Early stopping
        lr0=0.01, # Initial learning rate
        optimizer='AdamW', # Robust optimizer
        plots=True,
        save=True,
        exist_ok=True,
        resume=resume
    )

    logging.info("Training completed.")
    plot_metrics("c:/Users/ADITYA/Desktop/MITS/4thsem/Macro/FaceDetectionProject/metrics.csv")

if __name__ == "__main__":
    train_face_detector()
