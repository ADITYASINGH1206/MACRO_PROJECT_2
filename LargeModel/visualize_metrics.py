"""
Training Metrics Visualization Script

Generates graphs from training logs:
- Loss vs Epoch
- Precision vs Epoch
- Recall vs Epoch
- F1 Score vs Epoch
- mAP vs Epoch
- Learning Rate vs Epoch
"""

import os
import sys
import pandas as pd
import matplotlib.pyplot as plt
import logging
from pathlib import Path

from config import LOGS_DIR, OUTPUT_DIR, METRICS_CSV

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class MetricsVisualizer:
    """Visualize training metrics"""
    
    def __init__(self, csv_path=METRICS_CSV, output_dir=OUTPUT_DIR):
        """
        Initialize visualizer.
        
        Args:
            csv_path: Path to metrics CSV file
            output_dir: Directory to save plots
        """
        self.csv_path = Path(csv_path)
        self.output_dir = Path(output_dir) / "plots"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Load metrics
        if self.csv_path.exists():
            self.df = pd.read_csv(self.csv_path)
            logger.info(f"Loaded metrics from: {self.csv_path}")
            logger.info(f"Total epochs: {len(self.df)}")
        else:
            logger.error(f"Metrics file not found: {self.csv_path}")
            self.df = None
    
    def _save_figure(self, filename):
        """Save figure to output directory"""
        output_path = self.output_dir / filename
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        logger.info(f"Saved: {output_path}")
        return output_path
    
    def plot_loss_vs_epoch(self):
        """Plot training and validation loss vs epoch"""
        if self.df is None:
            return
        
        plt.figure(figsize=(12, 6))
        
        plt.plot(self.df['epoch'], self.df['train_loss'], 
                label='Training Loss', marker='o', linewidth=2)
        plt.plot(self.df['epoch'], self.df['val_loss'], 
                label='Validation Loss', marker='s', linewidth=2)
        
        plt.xlabel('Epoch', fontsize=12)
        plt.ylabel('Loss', fontsize=12)
        plt.title('Training and Validation Loss vs Epoch', fontsize=14, fontweight='bold')
        plt.legend(fontsize=11)
        plt.grid(True, alpha=0.3)
        
        self._save_figure('loss_vs_epoch.png')
        plt.close()
    
    def plot_precision_vs_epoch(self):
        """Plot precision vs epoch"""
        if self.df is None or 'precision' not in self.df.columns:
            return
        
        plt.figure(figsize=(10, 6))
        
        plt.plot(self.df['epoch'], self.df['precision'], 
                label='Precision', marker='o', linewidth=2, color='green')
        
        plt.xlabel('Epoch', fontsize=12)
        plt.ylabel('Precision', fontsize=12)
        plt.title('Precision vs Epoch', fontsize=14, fontweight='bold')
        plt.legend(fontsize=11)
        plt.grid(True, alpha=0.3)
        plt.ylim([0, 1.05])
        
        self._save_figure('precision_vs_epoch.png')
        plt.close()
    
    def plot_recall_vs_epoch(self):
        """Plot recall vs epoch"""
        if self.df is None or 'recall' not in self.df.columns:
            return
        
        plt.figure(figsize=(10, 6))
        
        plt.plot(self.df['epoch'], self.df['recall'], 
                label='Recall', marker='o', linewidth=2, color='blue')
        
        plt.xlabel('Epoch', fontsize=12)
        plt.ylabel('Recall', fontsize=12)
        plt.title('Recall vs Epoch', fontsize=14, fontweight='bold')
        plt.legend(fontsize=11)
        plt.grid(True, alpha=0.3)
        plt.ylim([0, 1.05])
        
        self._save_figure('recall_vs_epoch.png')
        plt.close()
    
    def plot_f1_score_vs_epoch(self):
        """Plot F1 score vs epoch"""
        if self.df is None or 'f1_score' not in self.df.columns:
            return
        
        plt.figure(figsize=(10, 6))
        
        plt.plot(self.df['epoch'], self.df['f1_score'], 
                label='F1 Score', marker='o', linewidth=2, color='purple')
        
        plt.xlabel('Epoch', fontsize=12)
        plt.ylabel('F1 Score', fontsize=12)
        plt.title('F1 Score vs Epoch', fontsize=14, fontweight='bold')
        plt.legend(fontsize=11)
        plt.grid(True, alpha=0.3)
        plt.ylim([0, 1.05])
        
        self._save_figure('f1_score_vs_epoch.png')
        plt.close()
    
    def plot_map_vs_epoch(self):
        """Plot mAP@50 and mAP@50-95 vs epoch"""
        if self.df is None or 'map50' not in self.df.columns:
            return
        
        plt.figure(figsize=(12, 6))
        
        plt.plot(self.df['epoch'], self.df['map50'], 
                label='mAP@50', marker='o', linewidth=2)
        
        if 'map50_95' in self.df.columns:
            plt.plot(self.df['epoch'], self.df['map50_95'], 
                    label='mAP@50-95', marker='s', linewidth=2)
        
        plt.xlabel('Epoch', fontsize=12)
        plt.ylabel('mAP', fontsize=12)
        plt.title('Mean Average Precision vs Epoch', fontsize=14, fontweight='bold')
        plt.legend(fontsize=11)
        plt.grid(True, alpha=0.3)
        plt.ylim([0, 1.05])
        
        self._save_figure('map_vs_epoch.png')
        plt.close()
    
    def plot_learning_rate_vs_epoch(self):
        """Plot learning rate vs epoch"""
        if self.df is None or 'learning_rate' not in self.df.columns:
            return
        
        plt.figure(figsize=(10, 6))
        
        plt.semilogy(self.df['epoch'], self.df['learning_rate'], 
                    label='Learning Rate', marker='o', linewidth=2, color='red')
        
        plt.xlabel('Epoch', fontsize=12)
        plt.ylabel('Learning Rate (log scale)', fontsize=12)
        plt.title('Learning Rate vs Epoch', fontsize=14, fontweight='bold')
        plt.legend(fontsize=11)
        plt.grid(True, alpha=0.3, which='both')
        
        self._save_figure('learning_rate_vs_epoch.png')
        plt.close()
    
    def plot_all_metrics(self):
        """Plot all metrics in a single multi-panel figure"""
        if self.df is None:
            return
        
        fig, axes = plt.subplots(2, 3, figsize=(18, 10))
        fig.suptitle('YOLOv8 Face Detection Training Metrics', fontsize=16, fontweight='bold')
        
        # Loss
        axes[0, 0].plot(self.df['epoch'], self.df['train_loss'], label='Train Loss', marker='o')
        axes[0, 0].plot(self.df['epoch'], self.df['val_loss'], label='Val Loss', marker='s')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Loss')
        axes[0, 0].set_title('Training and Validation Loss')
        axes[0, 0].legend()
        axes[0, 0].grid(True, alpha=0.3)
        
        # Precision
        if 'precision' in self.df.columns:
            axes[0, 1].plot(self.df['epoch'], self.df['precision'], color='green', marker='o')
            axes[0, 1].set_xlabel('Epoch')
            axes[0, 1].set_ylabel('Precision')
            axes[0, 1].set_title('Precision vs Epoch')
            axes[0, 1].set_ylim([0, 1.05])
            axes[0, 1].grid(True, alpha=0.3)
        
        # Recall
        if 'recall' in self.df.columns:
            axes[0, 2].plot(self.df['epoch'], self.df['recall'], color='blue', marker='o')
            axes[0, 2].set_xlabel('Epoch')
            axes[0, 2].set_ylabel('Recall')
            axes[0, 2].set_title('Recall vs Epoch')
            axes[0, 2].set_ylim([0, 1.05])
            axes[0, 2].grid(True, alpha=0.3)
        
        # F1 Score
        if 'f1_score' in self.df.columns:
            axes[1, 0].plot(self.df['epoch'], self.df['f1_score'], color='purple', marker='o')
            axes[1, 0].set_xlabel('Epoch')
            axes[1, 0].set_ylabel('F1 Score')
            axes[1, 0].set_title('F1 Score vs Epoch')
            axes[1, 0].set_ylim([0, 1.05])
            axes[1, 0].grid(True, alpha=0.3)
        
        # mAP
        if 'map50' in self.df.columns:
            axes[1, 1].plot(self.df['epoch'], self.df['map50'], label='mAP@50', marker='o')
            if 'map50_95' in self.df.columns:
                axes[1, 1].plot(self.df['epoch'], self.df['map50_95'], label='mAP@50-95', marker='s')
            axes[1, 1].set_xlabel('Epoch')
            axes[1, 1].set_ylabel('mAP')
            axes[1, 1].set_title('Mean Average Precision')
            axes[1, 1].set_ylim([0, 1.05])
            axes[1, 1].legend()
            axes[1, 1].grid(True, alpha=0.3)
        
        # Learning Rate
        if 'learning_rate' in self.df.columns:
            axes[1, 2].semilogy(self.df['epoch'], self.df['learning_rate'], color='red', marker='o')
            axes[1, 2].set_xlabel('Epoch')
            axes[1, 2].set_ylabel('Learning Rate (log scale)')
            axes[1, 2].set_title('Learning Rate Schedules')
            axes[1, 2].grid(True, alpha=0.3, which='both')
        
        plt.tight_layout()
        self._save_figure('all_metrics.png')
        plt.close()
    
    def print_summary_stats(self):
        """Print summary statistics"""
        if self.df is None:
            return
        
        logger.info("\n" + "=" * 60)
        logger.info("TRAINING SUMMARY STATISTICS")
        logger.info("=" * 60)
        
        logger.info(f"Total epochs: {len(self.df)}")
        
        if 'train_loss' in self.df.columns:
            logger.info(f"Final training loss: {self.df['train_loss'].iloc[-1]:.6f}")
            logger.info(f"Min training loss: {self.df['train_loss'].min():.6f}")
        
        if 'val_loss' in self.df.columns:
            logger.info(f"Final validation loss: {self.df['val_loss'].iloc[-1]:.6f}")
            logger.info(f"Min validation loss: {self.df['val_loss'].min():.6f}")
        
        if 'precision' in self.df.columns:
            logger.info(f"Final precision: {self.df['precision'].iloc[-1]:.4f}")
            logger.info(f"Max precision: {self.df['precision'].max():.4f}")
        
        if 'recall' in self.df.columns:
            logger.info(f"Final recall: {self.df['recall'].iloc[-1]:.4f}")
            logger.info(f"Max recall: {self.df['recall'].max():.4f}")
        
        if 'f1_score' in self.df.columns:
            logger.info(f"Final F1 score: {self.df['f1_score'].iloc[-1]:.4f}")
            logger.info(f"Max F1 score: {self.df['f1_score'].max():.4f}")
        
        if 'map50' in self.df.columns:
            logger.info(f"Final mAP@50: {self.df['map50'].iloc[-1]:.4f}")
            logger.info(f"Max mAP@50: {self.df['map50'].max():.4f}")
        
        if 'map50_95' in self.df.columns:
            logger.info(f"Final mAP@50-95: {self.df['map50_95'].iloc[-1]:.4f}")
            logger.info(f"Max mAP@50-95: {self.df['map50_95'].max():.4f}")
        
        logger.info("=" * 60)


def main():
    """Main visualization function"""
    
    print("=" * 80)
    print("YOLOv8 Face Detection - Metrics Visualization")
    print("=" * 80)
    print()
    
    # Check if metrics file exists
    if not METRICS_CSV.exists():
        logger.error(f"Metrics file not found: {METRICS_CSV}")
        logger.error("Please run training first to generate metrics")
        sys.exit(1)
    
    # Create visualizer
    visualizer = MetricsVisualizer()
    
    # Generate plots
    logger.info("Generating plots...")
    visualizer.plot_loss_vs_epoch()
    visualizer.plot_precision_vs_epoch()
    visualizer.plot_recall_vs_epoch()
    visualizer.plot_f1_score_vs_epoch()
    visualizer.plot_map_vs_epoch()
    visualizer.plot_learning_rate_vs_epoch()
    visualizer.plot_all_metrics()
    
    # Print summary
    visualizer.print_summary_stats()
    
    logger.info(f"\n✅ Visualization complete!")
    logger.info(f"Plots saved to: {visualizer.output_dir}")


if __name__ == "__main__":
    main()
