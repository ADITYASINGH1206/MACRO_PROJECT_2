"""
Dataset Preprocessing Module for YOLOv8 Face Detection

Functions:
- Resize images to target size
- Validate bounding boxes
- Remove corrupted images
- Verify dataset integrity
- Split dataset into train/val sets
"""

import os
import sys
import logging
from pathlib import Path
from PIL import Image
import shutil
from tqdm import tqdm
import numpy as np

# Import config
from config import (
    IMAGES_TRAIN_DIR, IMAGES_VAL_DIR, LABELS_TRAIN_DIR, LABELS_VAL_DIR,
    TARGET_IMAGE_SIZE, VALID_IMAGE_EXTENSIONS, MIN_BOX_AREA
)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DatasetPreprocessor:
    """Preprocess and validate dataset"""
    
    def __init__(self):
        """Initialize preprocessor"""
        self.stats = {
            'total_images': 0,
            'valid_images': 0,
            'corrupted_images': 0,
            'resized_images': 0,
            'invalid_labels': 0,
            'valid_labels': 0,
            'removed_small_boxes': 0,
        }
    
    def validate_image(self, image_path):
        """
        Validate an image file.
        
        Args:
            image_path: Path to image
        
        Returns:
            bool: True if valid, False otherwise
        """
        try:
            with Image.open(image_path) as img:
                # Try to load the image
                img.verify()
            return True
        except Exception as e:
            logger.warning(f"Corrupted image: {image_path} - {e}")
            return False
    
    def validate_label(self, label_path, image_width, image_height, min_area=MIN_BOX_AREA):
        """
        Validate a YOLO format label file.
        
        Args:
            label_path: Path to label file
            image_width: Image width in pixels
            image_height: Image height in pixels
            min_area: Minimum box area in pixels
        
        Returns:
            tuple: (is_valid, valid_boxes)
        """
        valid_boxes = []
        
        if not os.path.exists(label_path):
            return True, valid_boxes  # No label file is okay
        
        try:
            with open(label_path, 'r') as f:
                lines = f.readlines()
            
            for i, line in enumerate(lines):
                parts = line.strip().split()
                
                if len(parts) != 5:
                    logger.warning(f"Invalid annotation format in {label_path} line {i+1}")
                    continue
                
                try:
                    class_id = int(parts[0])
                    x_center = float(parts[1])
                    y_center = float(parts[2])
                    width = float(parts[3])
                    height = float(parts[4])
                    
                    # Validate values are in [0, 1]
                    if not (0 <= x_center <= 1 and 0 <= y_center <= 1 and 
                           0 < width <= 1 and 0 < height <= 1):
                        logger.warning(f"Out of bounds annotation: {line.strip()}")
                        continue
                    
                    # Validate class ID
                    if class_id != 0:  # Only face class (0) is valid
                        logger.warning(f"Invalid class ID {class_id} in {label_path}")
                        continue
                    
                    # Check minimum box area
                    box_area = (width * image_width) * (height * image_height)
                    if box_area < min_area:
                        self.stats['removed_small_boxes'] += 1
                        continue
                    
                    valid_boxes.append(line.strip())
                    self.stats['valid_labels'] += 1
                    
                except ValueError as e:
                    logger.warning(f"Cannot parse annotation: {line.strip()} - {e}")
                    continue
            
            return True, valid_boxes
            
        except Exception as e:
            logger.error(f"Error reading label file {label_path}: {e}")
            return False, []
    
    def resize_image(self, image_path, target_size=TARGET_IMAGE_SIZE, output_path=None):
        """
        Resize image to target size.
        
        Args:
            image_path: Original image path
            target_size: Target size tuple (width, height)
            output_path: Output path (default: overwrite original)
        
        Returns:
            tuple: (original_size, new_size) or None if failed
        """
        if output_path is None:
            output_path = image_path
        
        try:
            with Image.open(image_path) as img:
                original_size = img.size
                
                # Resize with aspect ratio preservation if needed
                img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
                img_resized.save(output_path, quality=95)
                
                self.stats['resized_images'] += 1
                return original_size, target_size
                
        except Exception as e:
            logger.error(f"Cannot resize image {image_path}: {e}")
            return None
    
    def adjust_bbox_for_resize(self, original_size, new_size, yolo_lines):
        """
        Adjust YOLO bounding boxes when image is resized.
        Note: Since YOLO uses normalized coordinates, they don't change with resize!
        This function is for reference only.
        
        Args:
            original_size: Original (width, height)
            new_size: New (width, height)
            yolo_lines: List of YOLO annotation lines
        
        Returns:
            list: Adjusted YOLO lines (same as input for normalized coords)
        """
        # YOLO uses normalized coordinates, so no adjustment needed!
        return yolo_lines
    
    def check_dataset_integrity(self, images_dir, labels_dir, split_name="train"):
        """
        Check dataset integrity:
        - Every image has a label file
        - Every label file has corresponding image
        - All files are valid
        
        Args:
            images_dir: Directory with images
            labels_dir: Directory with labels
            split_name: Name of split (train/val)
        """
        images_dir = Path(images_dir)
        labels_dir = Path(labels_dir)
        
        logger.info(f"\nChecking {split_name} dataset integrity...")
        
        # Get all image files
        image_files = set()
        for ext in VALID_IMAGE_EXTENSIONS:
            image_files.update([f.name for f in images_dir.glob(f'*{ext}')])
        
        logger.info(f"Found {len(image_files)} images")
        
        # Check labels
        missing_labels = []
        for img_file in image_files:
            label_file = img_file.rsplit('.', 1)[0] + '.txt'
            label_path = labels_dir / label_file
            
            if not label_path.exists():
                missing_labels.append(img_file)
        
        if missing_labels:
            logger.warning(f"Missing labels for {len(missing_labels)} images")
        
        # Check orphaned labels
        orphaned_labels = []
        for label_file in labels_dir.glob('*.txt'):
            img_name = None
            for ext in VALID_IMAGE_EXTENSIONS:
                potential_img = label_file.stem + ext
                if potential_img in image_files:
                    img_name = potential_img
                    break
            
            if img_name is None:
                orphaned_labels.append(label_file.name)
        
        if orphaned_labels:
            logger.warning(f"Found {len(orphaned_labels)} orphaned label files")
        
        # Summary
        logger.info(f"✓ Dataset check complete for {split_name}")
        logger.info(f"  Images: {len(image_files)}")
        logger.info(f"  Missing labels: {len(missing_labels)}")
        logger.info(f"  Orphaned labels: {len(orphaned_labels)}")
    
    def preprocess_dataset(self, images_dir, labels_dir, split_name="train"):
        """
        Preprocess all images and labels in a directory.
        
        Args:
            images_dir: Directory with images
            labels_dir: Directory with labels
            split_name: Name of split (train/val)
        """
        images_dir = Path(images_dir)
        labels_dir = Path(labels_dir)
        
        logger.info(f"\n{'=' * 60}")
        logger.info(f"Preprocessing {split_name} dataset")
        logger.info(f"{'=' * 60}")
        
        images_dir.mkdir(parents=True, exist_ok=True)
        labels_dir.mkdir(parents=True, exist_ok=True)
        
        # Get all images
        image_files = []
        for ext in VALID_IMAGE_EXTENSIONS:
            image_files.extend(images_dir.glob(f'*{ext}'))
        
        logger.info(f"Found {len(image_files)} images")
        
        corrupted_images = []
        valid_images = 0
        
        # Process each image
        for img_path in tqdm(image_files, desc=f"Processing {split_name}"):
            self.stats['total_images'] += 1
            
            # Validate image
            if not self.validate_image(img_path):
                corrupted_images.append(img_path)
                self.stats['corrupted_images'] += 1
                continue
            
            # Get image dimensions
            try:
                with Image.open(img_path) as img:
                    img_width, img_height = img.size
            except Exception as e:
                logger.error(f"Cannot open image {img_path}: {e}")
                corrupted_images.append(img_path)
                self.stats['corrupted_images'] += 1
                continue
            
            # Get corresponding label file
            label_name = img_path.stem + '.txt'
            label_path = labels_dir / label_name
            
            # Validate and adjust labels
            is_valid, valid_boxes = self.validate_label(label_path, img_width, img_height)
            
            if not is_valid:
                self.stats['invalid_labels'] += 1
                continue
            
            # Save cleaned labels if boxes were removed
            if valid_boxes and len(valid_boxes) > 0:
                with open(label_path, 'w') as f:
                    f.write('\n'.join(valid_boxes))
            
            # Optionally resize image (uncomment to enable)
            # self.resize_image(img_path, TARGET_IMAGE_SIZE)
            
            self.stats['valid_images'] += 1
            valid_images += 1
        
        # Remove corrupted images
        if corrupted_images:
            logger.info(f"\nRemoving {len(corrupted_images)} corrupted images...")
            for img_path in corrupted_images:
                try:
                    img_path.unlink()
                    # Also remove label file
                    label_path = labels_dir / (img_path.stem + '.txt')
                    if label_path.exists():
                        label_path.unlink()
                except Exception as e:
                    logger.error(f"Cannot remove {img_path}: {e}")
        
        # Verify integrity
        self.check_dataset_integrity(images_dir, labels_dir, split_name)
    
    def print_stats(self):
        """Print preprocessing statistics"""
        logger.info("\n" + "=" * 60)
        logger.info("PREPROCESSING STATISTICS")
        logger.info("=" * 60)
        logger.info(f"Total images: {self.stats['total_images']}")
        logger.info(f"Valid images: {self.stats['valid_images']}")
        logger.info(f"Corrupted images: {self.stats['corrupted_images']}")
        logger.info(f"Resized images: {self.stats['resized_images']}")
        logger.info(f"Valid labels: {self.stats['valid_labels']}")
        logger.info(f"Invalid labels: {self.stats['invalid_labels']}")
        logger.info(f"Small boxes removed: {self.stats['removed_small_boxes']}")
        logger.info("=" * 60)


def main():
    """Main function"""
    
    print("=" * 60)
    print("YOLOv8 Face Detection - Dataset Preprocessing")
    print("=" * 60)
    
    preprocessor = DatasetPreprocessor()
    
    # Preprocess training set
    if IMAGES_TRAIN_DIR.exists():
        preprocessor.preprocess_dataset(IMAGES_TRAIN_DIR, LABELS_TRAIN_DIR, "train")
    
    # Preprocess validation set
    if IMAGES_VAL_DIR.exists():
        preprocessor.preprocess_dataset(IMAGES_VAL_DIR, LABELS_VAL_DIR, "val")
    
    # Print statistics
    preprocessor.print_stats()
    
    print("\n✅ Dataset preprocessing complete!")


if __name__ == "__main__":
    main()
