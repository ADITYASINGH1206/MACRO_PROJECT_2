"""
Annotation Converter for WIDER FACE to YOLO Format

Converts WIDER FACE dataset annotations to YOLO format:
- WIDER FACE format: x1 y1 w h <blur> <expression> <illumination> <invalid> <occlusion> <pose>
- YOLO format: <class_id> <x_center> <y_center> <width> <height> (all normalized 0-1)

Class ID: 0 = face
"""

import os
import sys
from pathlib import Path
from PIL import Image
import logging
from tqdm import tqdm

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AnnotationConverter:
    """Convert WIDER FACE annotations to YOLO format"""
    
    def __init__(self, dataset_dir, output_dir):
        """
        Args:
            dataset_dir: Path to WIDER FACE dataset root
            output_dir: Path to output directory for YOLO format files
        """
        self.dataset_dir = Path(dataset_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Stats
        self.stats = {
            'total_images': 0,
            'converted_images': 0,
            'failed_images': 0,
            'total_faces': 0,
            'invalid_boxes': 0
        }
    
    def convert_wider_face_single_file(self, anno_file, images_dir, output_labels_dir):
        """
        Convert a single WIDER FACE annotation file to YOLO format.
        
        WIDER FACE annotation format:
        filename
        x1 y1 w h blur expression illumination invalid occlusion pose
        ...
        (blank line between events/images)
        
        Args:
            anno_file: Path to annotation file
            images_dir: Directory containing images
            output_labels_dir: Directory to save YOLO labels
        """
        output_labels_dir = Path(output_labels_dir)
        output_labels_dir.mkdir(parents=True, exist_ok=True)
        images_dir = Path(images_dir)
        
        logger.info(f"Converting annotations from: {anno_file}")
        
        with open(anno_file, 'r') as f:
            lines = f.readlines()
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            # Skip empty lines
            if not line:
                i += 1
                continue
            
            # This is the image filename
            image_name = line
            image_path = images_dir / image_name
            
            # Skip if image doesn't exist
            if not image_path.exists():
                logger.warning(f"Image not found: {image_path}")
                i += 1
                continue
            
            self.stats['total_images'] += 1
            
            # Get number of faces in next line
            i += 1
            if i >= len(lines):
                break
            
            try:
                num_faces = int(lines[i].strip())
            except ValueError:
                logger.error(f"Cannot parse number of faces for {image_name}")
                i += 1
                continue
            
            # Get image dimensions
            try:
                with Image.open(image_path) as img:
                    img_width, img_height = img.size
            except Exception as e:
                logger.error(f"Cannot read image {image_path}: {e}")
                self.stats['failed_images'] += 1
                i += num_faces + 1
                continue
            
            # Read face annotations
            yolo_annotations = []
            for _ in range(num_faces):
                i += 1
                if i >= len(lines):
                    break
                
                anno_line = lines[i].strip()
                if not anno_line:
                    continue
                
                parts = anno_line.split()
                if len(parts) < 4:
                    logger.warning(f"Invalid annotation line: {anno_line}")
                    continue
                
                try:
                    x1, y1, w, h = float(parts[0]), float(parts[1]), float(parts[2]), float(parts[3])
                    
                    # Skip invalid boxes
                    if w <= 0 or h <= 0:
                        self.stats['invalid_boxes'] += 1
                        continue
                    
                    # Skip very small boxes
                    if w * h < 100:  # Minimum 100 pixels
                        self.stats['invalid_boxes'] += 1
                        continue
                    
                    # Ensure box is within image bounds
                    x1 = max(0, x1)
                    y1 = max(0, y1)
                    x2 = min(img_width, x1 + w)
                    y2 = min(img_height, y1 + h)
                    
                    if x2 <= x1 or y2 <= y1:
                        self.stats['invalid_boxes'] += 1
                        continue
                    
                    # Convert to YOLO format: class_id x_center y_center width height (normalized)
                    w_final = (x2 - x1) / img_width
                    h_final = (y2 - y1) / img_height
                    x_center = (x1 + (x2 - x1) / 2) / img_width
                    y_center = (y1 + (y2 - y1) / 2) / img_height
                    
                    # Ensure normalized coordinates are in [0, 1]
                    x_center = max(0, min(1, x_center))
                    y_center = max(0, min(1, y_center))
                    w_final = max(0, min(1, w_final))
                    h_final = max(0, min(1, h_final))
                    
                    yolo_annotations.append(f"0 {x_center:.6f} {y_center:.6f} {w_final:.6f} {h_final:.6f}")
                    self.stats['total_faces'] += 1
                    
                except (ValueError, IndexError) as e:
                    logger.error(f"Error parsing annotation: {anno_line} - {e}")
                    continue
            
            # Save YOLO format labels
            if yolo_annotations:
                label_name = image_name.rsplit('.', 1)[0] + '.txt'
                label_path = output_labels_dir / label_name
                
                try:
                    with open(label_path, 'w') as f:
                        f.write('\n'.join(yolo_annotations))
                    self.stats['converted_images'] += 1
                except Exception as e:
                    logger.error(f"Cannot save label {label_path}: {e}")
                    self.stats['failed_images'] += 1
            else:
                self.stats['failed_images'] += 1
            
            i += 1
    
    def convert_wider_face_directory(self, wider_face_dir, split='train'):
        """
        Convert entire WIDER FACE dataset to YOLO format.
        
        Args:
            wider_face_dir: Path to WIDER FACE dataset root
            split: 'train', 'val', or 'test'
        """
        wider_face_dir = Path(wider_face_dir)
        
        # Standard WIDER FACE directory structure
        anno_dir = wider_face_dir / split / 'annotations'
        images_dir = wider_face_dir / split / 'images'
        output_labels_dir = self.output_dir / split
        
        if not anno_dir.exists():
            logger.error(f"Annotations directory not found: {anno_dir}")
            return
        
        if not images_dir.exists():
            logger.error(f"Images directory not found: {images_dir}")
            return
        
        logger.info(f"Converting {split} set...")
        logger.info(f"Images: {images_dir}")
        logger.info(f"Annotations: {anno_dir}")
        logger.info(f"Output: {output_labels_dir}")
        
        # Find all annotation files
        anno_files = list(anno_dir.glob('*.txt'))
        logger.info(f"Found {len(anno_files)} annotation files")
        
        for anno_file in tqdm(anno_files, desc=f"Converting {split}"):
            self.convert_wider_face_single_file(anno_file, images_dir, output_labels_dir)
    
    def print_stats(self):
        """Print conversion statistics"""
        logger.info("=" * 60)
        logger.info("CONVERSION STATISTICS")
        logger.info("=" * 60)
        logger.info(f"Total images processed: {self.stats['total_images']}")
        logger.info(f"Successfully converted: {self.stats['converted_images']}")
        logger.info(f"Failed images: {self.stats['failed_images']}")
        logger.info(f"Total faces detected: {self.stats['total_faces']}")
        logger.info(f"Invalid boxes removed: {self.stats['invalid_boxes']}")
        logger.info("=" * 60)


def main():
    """Main function to convert WIDER FACE dataset"""
    
    print("=" * 60)
    print("WIDER FACE to YOLO Annotation Converter")
    print("=" * 60)
    
    # Get dataset path
    wider_face_dir = input("\nEnter path to WIDER FACE dataset root: ").strip()
    
    if not Path(wider_face_dir).exists():
        print(f"❌ Directory not found: {wider_face_dir}")
        sys.exit(1)
    
    # Get output path
    output_dir = input("Enter output directory for YOLO labels (default: ./labels): ").strip()
    if not output_dir:
        output_dir = "./labels"
    
    # Create converter
    converter = AnnotationConverter(wider_face_dir, output_dir)
    
    # Convert splits
    splits = ['train', 'val', 'test']
    for split in splits:
        try:
            converter.convert_wider_face_directory(wider_face_dir, split)
        except Exception as e:
            logger.error(f"Error converting {split} split: {e}")
    
    # Print statistics
    converter.print_stats()
    
    print("\n✅ Conversion complete!")
    print(f"Results saved to: {output_dir}")
        return total_images, total_faces, num_failures
    
    event_dirs = sorted([d for d in os.listdir(wider_images_dir) 
                        if os.path.isdir(os.path.join(wider_images_dir, d))])
    
    print(f"Converting WIDER FACE {dataset_split} split to YOLO format...")
    print(f"Found {len(event_dirs)} event directories")
    
    for event_dir in tqdm(event_dirs, desc="Processing events"):
        event_images_path = os.path.join(wider_images_dir, event_dir)
        event_annot_path = os.path.join(wider_annot_dir, event_dir)
        
        # Get list of annotation files
        annot_files = sorted([f for f in os.listdir(event_annot_path) 
                             if f.endswith('.txt')])
        
        for annot_file in annot_files:
            try:
                annot_path = os.path.join(event_annot_path, annot_file)
                image_name = annot_file.replace('.txt', '.jpg')
                image_path = os.path.join(event_images_path, image_name)
                
                # Check if image exists
                if not os.path.exists(image_path):
                    num_failures += 1
                    continue
                
                # Read image to get dimensions
                img = cv2.imread(image_path)
                if img is None:
                    num_failures += 1
                    continue
                
                img_height, img_width = img.shape[:2]
                
                # Read WIDER FACE annotations
                with open(annot_path, 'r') as f:
                    lines = f.readlines()
                
                # Skip the image name line, process face bounding boxes
                num_faces = int(lines[1].strip())
                
                yolo_annotations = []
                
                for i in range(2, 2 + num_faces):
                    if i >= len(lines):
                        break
                    
                    parts = lines[i].strip().split()
                    
                    # WIDER FACE format: x1 y1 w h blur expression illumination invalid occlusion pose
                    if len(parts) < 4:
                        continue
                    
                    try:
                        x1 = int(parts[0])
                        y1 = int(parts[1])
                        w = int(parts[2])
                        h = int(parts[3])
                        
                        # Skip invalid/illegible faces (last value often indicates this)
                        if len(parts) > 10:
                            illegible = int(parts[10])
                            if illegible == 1:
                                continue
                        
                        # Validate bounding box (should be within image bounds)
                        if x1 < 0 or y1 < 0 or w <= 0 or h <= 0:
                            continue
                        
                        if x1 + w > img_width or y1 + h > img_height:
                            # Clip to image bounds
                            x1 = max(0, x1)
                            y1 = max(0, y1)
                            w = min(w, img_width - x1)
                            h = min(h, img_height - y1)
                        
                        if w <= 0 or h <= 0:
                            continue
                        
                        # Convert to YOLO format (center coordinates + width/height, normalized)
                        x_center = (x1 + w / 2) / img_width
                        y_center = (y1 + h / 2) / img_height
                        w_norm = w / img_width
                        h_norm = h / img_height
                        
                        # Ensure values are in [0, 1]
                        x_center = max(0, min(1, x_center))
                        y_center = max(0, min(1, y_center))
                        w_norm = max(0, min(1, w_norm))
                        h_norm = max(0, min(1, h_norm))
                        
                        # Class 0 = face
                        yolo_annotations.append(
                            f"0 {x_center:.6f} {y_center:.6f} {w_norm:.6f} {h_norm:.6f}"
                        )
                    
                    except (ValueError, IndexError):
                        continue
                
                # Write YOLO annotation file
                output_annot_path = os.path.join(
                    output_labels_dir, 
                    annot_file
                )
                
                with open(output_annot_path, 'w') as f:
                    f.write('\n'.join(yolo_annotations))
                
                total_images += 1
                total_faces += len(yolo_annotations)
            
            except Exception as e:
                print(f"Error processing {annot_file}: {str(e)}")
                num_failures += 1
                continue
    
    return total_images, total_faces, num_failures


def main():
    """Main entry point."""
    
    # Configure paths
    wider_face_dir = input("Enter path to WIDER_FACE directory: ").strip()
    output_dir = os.path.dirname(os.path.abspath(__file__))
    
    if not os.path.exists(wider_face_dir):
        print(f"Error: WIDER FACE directory not found: {wider_face_dir}")
        sys.exit(1)
    
    print(f"WIDER FACE directory: {wider_face_dir}")
    print(f"Output directory: {output_dir}")
    print()
    
    # Convert train, val, test splits
    for split in ['train', 'val', 'test']:
        print(f"\n{'='*60}")
        print(f"Converting {split.upper()} split...")
        print(f"{'='*60}")
        
        total_images, total_faces, num_failures = convert_wider_face_to_yolo(
            wider_face_dir,
            output_dir,
            split
        )
        
        print(f"\nResults for {split.upper()} split:")
        print(f"  Total images converted: {total_images}")
        print(f"  Total faces detected: {total_faces}")
        print(f"  Conversion failures: {num_failures}")
        
        if total_images > 0:
            avg_faces_per_image = total_faces / total_images
            print(f"  Average faces per image: {avg_faces_per_image:.2f}")
    
    print(f"\n{'='*60}")
    print("Conversion complete!")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
