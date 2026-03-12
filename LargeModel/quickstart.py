#!/usr/bin/env python3
"""
Quick Start Script for YOLOv8 Face Detection Training
Automates the setup and training pipeline.
"""

import os
import sys
import argparse
from pathlib import Path


def print_header(text):
    """Print a formatted header."""
    print(f"\n{'='*70}")
    print(f"  {text}")
    print(f"{'='*70}\n")


def print_step(step_num, step_name):
    """Print a step indicator."""
    print(f"\n[Step {step_num}] {step_name}")
    print("-" * 70)


def check_dependencies():
    """Check if all required packages are installed."""
    print_step(1, "Checking Dependencies")
    
    required_packages = [
        'torch',
        'cv2',
        'ultralytics',
        'pandas',
        'matplotlib',
        'numpy',
        'PIL'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"  ✓ {package}")
        except ImportError:
            print(f"  ✗ {package} (MISSING)")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("\nInstall with: pip install -r requirements.txt")
        return False
    
    print("\n✓ All dependencies installed!")
    return True


def check_dataset():
    """Check if dataset directories exist and have data."""
    print_step(2, "Checking Dataset")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(script_dir, 'dataset')
    
    train_images = os.path.join(dataset_dir, 'images', 'train')
    val_images = os.path.join(dataset_dir, 'images', 'val')
    train_labels = os.path.join(dataset_dir, 'labels', 'train')
    val_labels = os.path.join(dataset_dir, 'labels', 'val')
    
    # Check directories exist
    dirs_ok = all(os.path.exists(d) for d in [train_images, val_images, train_labels, val_labels])
    
    if not dirs_ok:
        print("❌ Dataset directories not found!")
        print(f"\nExpected structure:")
        print(f"  {dataset_dir}/")
        print(f"  ├── images/")
        print(f"  │   ├── train/")
        print(f"  │   └── val/")
        print(f"  └── labels/")
        print(f"      ├── train/")
        print(f"      └── val/")
        return False
    
    # Count images
    train_count = len([f for f in os.listdir(train_images) if f.lower().endswith(('.jpg', '.png'))])
    val_count = len([f for f in os.listdir(val_images) if f.lower().endswith(('.jpg', '.png'))])
    
    print(f"  Training images: {train_count}")
    print(f"  Validation images: {val_count}")
    
    if train_count == 0 or val_count == 0:
        print("\n❌ No images found in dataset directories!")
        print("\nTo populate dataset:")
        print("  1. Download WIDER FACE from: http://shuoyang1213.me/WIDERFACE/")
        print("  2. Run: python annotation_converter.py")
        return False
    
    print("\n✓ Dataset ready!")
    return True


def check_gpu():
    """Check GPU availability."""
    print_step(3, "Checking GPU")
    
    try:
        import torch
        
        cuda_available = torch.cuda.is_available()
        
        if cuda_available:
            device_name = torch.cuda.get_device_name(0)
            device_mem = torch.cuda.get_device_properties(0).total_memory / 1e9
            
            print(f"  ✓ GPU Available: {device_name}")
            print(f"  ✓ GPU Memory: {device_mem:.1f} GB")
            
            if device_mem < 4:
                print("\n⚠ Warning: GPU memory is low (< 4GB)")
                print("  Consider using smaller batch size or image size")
            
            return True
        else:
            print("  ⚠ No GPU detected - will use CPU (training will be very slow)")
            return True
    
    except Exception as e:
        print(f"  ✗ Error checking GPU: {str(e)}")
        return False


def convert_annotations(wider_face_path):
    """Convert WIDER FACE annotations to YOLO format."""
    print_step(4, "Converting Annotations")
    
    try:
        from annotation_converter import convert_wider_face_to_yolo
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        print(f"  WIDER FACE path: {wider_face_path}")
        print(f"  Output path: {script_dir}")
        
        # Convert train, val
        for split in ['train', 'val']:
            print(f"\n  Converting {split}...")
            total_images, total_faces, num_failures = convert_wider_face_to_yolo(
                wider_face_path, script_dir, split
            )
            
            print(f"    Images: {total_images}")
            print(f"    Faces: {total_faces}")
            print(f"    Failures: {num_failures}")
        
        print("\n✓ Annotation conversion complete!")
        return True
    
    except Exception as e:
        print(f"❌ Error converting annotations: {str(e)}")
        return False


def preprocess_dataset():
    """Run dataset preprocessing."""
    print_step(5, "Preprocessing Dataset")
    
    try:
        from dataset_preprocessing import DatasetPreprocessor
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        dataset_dir = os.path.join(script_dir, 'dataset')
        
        preprocessor = DatasetPreprocessor(dataset_dir)
        preprocessor.preprocess_all(['train', 'val'])
        
        print("\n✓ Dataset preprocessing complete!")
        return True
    
    except Exception as e:
        print(f"❌ Error preprocessing dataset: {str(e)}")
        return False


def train_model(epochs=100, batch_size=16, imgsz=640):
    """Run training."""
    print_step(6, "Training Model")
    
    try:
        from train import FaceDetectionTrainer
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        trainer = FaceDetectionTrainer(
            dataset_yaml=os.path.join(script_dir, 'dataset.yaml'),
            model_name='yolov8s',
            checkpoint_dir=os.path.join(script_dir, 'checkpoints'),
            logs_dir=os.path.join(script_dir, 'logs')
        )
        
        # Create dataset.yaml if it doesn't exist
        if not os.path.exists(os.path.join(script_dir, 'dataset.yaml')):
            trainer.create_dataset_yaml(
                train_dir=os.path.join(script_dir, 'dataset', 'images', 'train'),
                val_dir=os.path.join(script_dir, 'dataset', 'images', 'val'),
                num_classes=1,
                class_names=['face']
            )
        
        print(f"\n  Training parameters:")
        print(f"    Epochs: {epochs}")
        print(f"    Batch size: {batch_size}")
        print(f"    Image size: {imgsz}")
        print(f"    Device: {trainer.device}")
        
        # Train
        results = trainer.train(
            epochs=epochs,
            batch_size=batch_size,
            imgsz=imgsz,
            initial_lr=0.001
        )
        
        # Evaluate
        print("\n  Running evaluation...")
        metrics = trainer.evaluate()
        
        # Save metrics
        trainer.save_metrics_csv()
        trainer.save_training_log()
        
        print("\n✓ Training complete!")
        return True
    
    except Exception as e:
        print(f"❌ Error during training: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def visualize_results():
    """Generate visualizations."""
    print_step(7, "Visualizing Results")
    
    try:
        from visualize_metrics import MetricsVisualizer
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        visualizer = MetricsVisualizer(
            logs_dir=os.path.join(script_dir, 'logs'),
            output_dir=os.path.join(script_dir, 'output')
        )
        
        if not visualizer.load_metrics():
            print("❌ No metrics found to visualize")
            return False
        
        visualizer.load_training_log()
        visualizer.print_summary()
        visualizer.plot_all_metrics()
        visualizer.generate_report()
        
        print("\n✓ Visualizations complete!")
        print(f"  Check output directory for plots and HTML report")
        return True
    
    except Exception as e:
        print(f"❌ Error generating visualizations: {str(e)}")
        return False


def main():
    """Main entry point."""
    
    parser = argparse.ArgumentParser(
        description='YOLOv8 Face Detection Quick Start',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python quickstart.py --check-only              # Just check environment
  python quickstart.py --convert /path/to/wider  # Convert annotations
  python quickstart.py --train                   # Full training pipeline
  python quickstart.py --train --epochs 50       # Custom number of epochs
  python quickstart.py --visualize               # Generate plots only
        """
    )
    
    parser.add_argument('--check-only', action='store_true',
                       help='Only check environment and dataset')
    parser.add_argument('--convert', type=str, metavar='WIDER_FACE_PATH',
                       help='Convert WIDER FACE annotations to YOLO format')
    parser.add_argument('--preprocess', action='store_true',
                       help='Run dataset preprocessing')
    parser.add_argument('--train', action='store_true',
                       help='Run training pipeline')
    parser.add_argument('--visualize', action='store_true',
                       help='Generate visualizations only')
    parser.add_argument('--epochs', type=int, default=100,
                       help='Number of training epochs (default: 100)')
    parser.add_argument('--batch', type=int, default=16,
                       help='Batch size (default: 16)')
    parser.add_argument('--imgsz', type=int, default=640,
                       help='Image size (default: 640)')
    
    args = parser.parse_args()
    
    print_header("YOLOv8 Face Detection - Quick Start")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check GPU
    check_gpu()
    
    # Check dataset (unless converting)
    if not args.convert:
        if not check_dataset():
            if not args.check_only:
                print("\nNote: Run annotation conversion first:")
                print("  python annotation_converter.py")
                sys.exit(1)
    
    # Handle different modes
    if args.check_only:
        print("\n✓ Environment check complete!")
        sys.exit(0)
    
    if args.convert:
        if not convert_annotations(args.convert):
            sys.exit(1)
        if not preprocess_dataset():
            sys.exit(1)
        sys.exit(0)
    
    if args.preprocess:
        if not preprocess_dataset():
            sys.exit(1)
        sys.exit(0)
    
    if args.train:
        if not train_model(args.epochs, args.batch, args.imgsz):
            sys.exit(1)
        
        # Automatically visualize after training
        visualize_results()
        sys.exit(0)
    
    if args.visualize:
        if not visualize_results():
            sys.exit(1)
        sys.exit(0)
    
    # Default: full pipeline
    print("\nNo specific mode selected. Running full pipeline...\n")
    
    if not preprocess_dataset():
        sys.exit(1)
    
    if not train_model(args.epochs, args.batch, args.imgsz):
        sys.exit(1)
    
    visualize_results()
    
    print_header("All Steps Complete!")
    print("Next: Run inference on images")
    print("  python inference.py --model checkpoints/best_face_detection.pt --source image.jpg")


if __name__ == "__main__":
    main()
