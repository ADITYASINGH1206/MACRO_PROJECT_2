"""
YOLOv8 Face Detection Inference Script

Supports:
- Single image inference
- Batch image inference  
- Video inference
- Webcam stream (optional)
- Visualization with bounding boxes
"""

import os
import sys
import cv2
import logging
from pathlib import Path
from tqdm import tqdm
import torch
from datetime import datetime

from ultralytics import YOLO
from config import (
    CHECKPOINTS_DIR, OUTPUT_DIR, CONFIDENCE_THRESHOLD,
    IOU_THRESHOLD, MAX_DETECTIONS, DEVICE, IMG_SIZE
)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class FaceDetectionInference:
    """Inference engine for face detection"""
    
    def __init__(self, model_path=None, confidence=CONFIDENCE_THRESHOLD):
        """
        Initialize inference engine.
        
        Args:
            model_path: Path to model weights (default: best.pt)
            confidence: Confidence threshold for detections
        """
        if model_path is None:
            model_path = CHECKPOINTS_DIR / "best.pt"
        
        self.model_path = Path(model_path)
        self.confidence = confidence
        
        if not self.model_path.exists():
            logger.error(f"Model not found: {self.model_path}")
            logger.error("Please train the model first or provide a valid model path")
            sys.exit(1)
        
        logger.info(f"Loading model from: {self.model_path}")
        self.model = YOLO(str(self.model_path))
        self.device = DEVICE if DEVICE != "cpu" else "cpu"
        
        logger.info(f"Model loaded successfully")
    
    def detect_image(self, image_path, return_original=False):
        """
        Detect faces in image.
        
        Args:
            image_path: Path to image
            return_original: Whether to return original image
        
        Returns:
            tuple: (results, image) or results
        """
        logger.info(f"Processing: {image_path}")
        
        # Read image
        image = cv2.imread(str(image_path))
        if image is None:
            logger.error(f"Cannot read image: {image_path}")
            return None
        
        # Run inference
        results = self.model(
            image,
            conf=self.confidence,
            iou=IOU_THRESHOLD,
            max_det=MAX_DETECTIONS,
            device=self.device
        )
        
        if return_original:
            return results, image
        return results
    
    def draw_boxes(self, image, results, thickness=2, text_size=1):
        """
        Draw bounding boxes on image.
        
        Args:
            image: Original image
            results: Detection results from YOLO
            thickness: Box line thickness
            text_size: Text font size
        
        Returns:
            image: Image with drawn boxes
        """
        image_with_boxes = image.copy()
        
        # Extract detections
        if len(results) > 0 and results[0].boxes is not None:
            boxes = results[0].boxes
            
            for box in boxes:
                # Get coordinates
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                
                # Get confidence
                conf = box.conf[0]
                
                # Draw bounding box
                cv2.rectangle(image_with_boxes, (x1, y1), (x2, y2), (0, 255, 0), thickness)
                
                # Draw label
                label = f"Face {conf:.2f}"
                label_size, _ = cv2.getTextSize(
                    label, cv2.FONT_HERSHEY_SIMPLEX, text_size, thickness
                )
                
                # Background for label
                cv2.rectangle(
                    image_with_boxes,
                    (x1, y1 - label_size[1] - 5),
                    (x1 + label_size[0], y1),
                    (0, 255, 0),
                    cv2.FILLED
                )
                
                # Put text
                cv2.putText(
                    image_with_boxes,
                    label,
                    (x1, y1 - 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    text_size,
                    (0, 0, 0),
                    thickness
                )
        
        return image_with_boxes
    
    def infer_image(self, image_path, output_path=None, draw_boxes=True):
        """
        Run inference on single image and optionally save result.
        
        Args:
            image_path: Path to input image
            output_path: Path to save result (default: output/filename)
            draw_boxes: Whether to draw bounding boxes
        
        Returns:
            dict: Detection results
        """
        # Run detection
        results, image = self.detect_image(image_path, return_original=True)
        
        if results is None:
            return None
        
        # Count detections
        num_detections = len(results[0].boxes) if results[0].boxes is not None else 0
        logger.info(f"Detected {num_detections} faces")
        
        # Draw boxes if requested
        if draw_boxes:
            image = self.draw_boxes(image, results)
        
        # Save result
        if output_path is None:
            output_path = OUTPUT_DIR / Path(image_path).name
        else:
            output_path = Path(output_path)
        
        output_path.parent.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(str(output_path), image)
        logger.info(f"Result saved to: {output_path}")
        
        # Return detection info
        result_info = {
            'image_path': str(image_path),
            'output_path': str(output_path),
            'num_detections': num_detections,
            'detections': []
        }
        
        if results[0].boxes is not None:
            for box in results[0].boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                conf = float(box.conf[0])
                
                result_info['detections'].append({
                    'x1': float(x1),
                    'y1': float(y1),
                    'x2': float(x2),
                    'y2': float(y2),
                    'confidence': conf
                })
        
        return result_info
    
    def infer_batch(self, image_dir, output_dir=None, draw_boxes=True):
        """
        Run inference on batch of images.
        
        Args:
            image_dir: Directory with images
            output_dir: Directory to save results
            draw_boxes: Whether to draw bounding boxes
        
        Returns:
            list: List of detection results for each image
        """
        image_dir = Path(image_dir)
        if output_dir is None:
            output_dir = OUTPUT_DIR / "batch_results"
        
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Get all image files
        image_files = []
        for ext in ['.jpg', '.jpeg', '.png', '.bmp']:
            image_files.extend(image_dir.glob(f'*{ext}'))
            image_files.extend(image_dir.glob(f'*{ext.upper()}'))
        
        logger.info(f"Found {len(image_files)} images")
        
        results = []
        total_faces = 0
        
        for img_path in tqdm(image_files, desc="Processing images"):
            result = self.infer_image(
                img_path,
                output_path=output_dir / img_path.name,
                draw_boxes=draw_boxes
            )
            
            if result:
                results.append(result)
                total_faces += result['num_detections']
        
        logger.info(f"Batch processing complete")
        logger.info(f"Total images: {len(results)}")
        logger.info(f"Total faces detected: {total_faces}")
        logger.info(f"Results saved to: {output_dir}")
        
        return results
    
    def infer_video(self, video_path, output_path=None, draw_boxes=True, display=False):
        """
        Run inference on video.
        
        Args:
            video_path: Path to input video
            output_path: Path to save result video
            draw_boxes: Whether to draw bounding boxes
            display: Whether to display video during inference
        
        Returns:
            dict: Video statistics
        """
        video_path = Path(video_path)
        
        if not video_path.exists():
            logger.error(f"Video not found: {video_path}")
            return None
        
        logger.info(f"Processing video: {video_path}")
        
        # Open video
        cap = cv2.VideoCapture(str(video_path))
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        logger.info(f"Video info: {total_frames} frames, {fps} fps, {width}x{height}")
        
        # Setup video writer
        if output_path is None:
            output_path = OUTPUT_DIR / f"{video_path.stem}_detected.mp4"
        else:
            output_path = Path(output_path)
        
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height))
        
        # Process frames
        frame_count = 0
        total_faces = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Run inference
            results = self.model(
                frame,
                conf=self.confidence,
                iou=IOU_THRESHOLD,
                max_det=MAX_DETECTIONS,
                device=self.device
            )
            
            # Draw boxes
            if draw_boxes:
                frame = self.draw_boxes(frame, results)
            
            # Count detections
            if results[0].boxes is not None:
                total_faces += len(results[0].boxes)
            
            # Write frame
            out.write(frame)
            
            # Display
            if display:
                cv2.imshow('Face Detection', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            
            if frame_count % 30 == 0:
                logger.info(f"Processed {frame_count}/{total_frames} frames")
        
        # Release resources
        cap.release()
        out.release()
        if display:
            cv2.destroyAllWindows()
        
        logger.info(f"Video processing complete")
        logger.info(f"Output saved to: {output_path}")
        
        return {
            'input_video': str(video_path),
            'output_video': str(output_path),
            'total_frames': total_frames,
            'processed_frames': frame_count,
            'total_faces': total_faces,
            'fps': fps
        }
    
    def infer_webcam(self, duration=30, draw_boxes=True):
        """
        Run inference on webcam stream.
        
        Args:
            duration: Duration to record (seconds)
            draw_boxes: Whether to draw bounding boxes
        
        Returns:
            dict: Webcam statistics
        """
        logger.info(f"Starting webcam inference ({duration} seconds)...")
        
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            logger.error("Cannot open webcam")
            return None
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        # Setup video writer
        output_path = OUTPUT_DIR / f"webcam_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height))
        
        frame_count = 0
        total_faces = 0
        
        start_time = datetime.now()
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Check duration
            elapsed = (datetime.now() - start_time).total_seconds()
            if elapsed > duration:
                break
            
            frame_count += 1
            
            # Run inference
            results = self.model(
                frame,
                conf=self.confidence,
                iou=IOU_THRESHOLD,
                max_det=MAX_DETECTIONS,
                device=self.device
            )
            
            # Draw boxes
            if draw_boxes:
                frame = self.draw_boxes(frame, results)
                
                # Add timer
                timer_text = f"Time: {elapsed:.1f}s"
                cv2.putText(
                    frame, timer_text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2
                )
            
            # Count detections
            if results[0].boxes is not None:
                faces = len(results[0].boxes)
                total_faces += faces
                
                # Show count
                cv2.putText(
                    frame, f"Faces: {faces}", (10, 70),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2
                )
            
            # Write frame
            out.write(frame)
            
            # Display
            cv2.imshow('Webcam - Face Detection (Press Q to quit)', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        # Release resources
        cap.release()
        out.release()
        cv2.destroyAllWindows()
        
        logger.info(f"Webcam inference complete")
        logger.info(f"Output saved to: {output_path}")
        
        return {
            'output_video': str(output_path),
            'total_frames': frame_count,
            'total_faces': total_faces,
            'duration': elapsed,
            'fps': fps
        }


def main():
    """Main inference function"""
    
    print("=" * 80)
    print("YOLOv8 Face Detection - Inference Script")
    print("=" * 80)
    print()
    
    inference = FaceDetectionInference()
    
    print("Select inference mode:")
    print("1. Single image")
    print("2. Batch images")
    print("3. Video file")
    print("4. Webcam stream")
    
    choice = input("\nEnter choice (1-4): ").strip()
    
    try:
        if choice == "1":
            image_path = input("Enter image path: ").strip()
            inference.infer_image(image_path, draw_boxes=True)
        
        elif choice == "2":
            image_dir = input("Enter image directory: ").strip()
            inference.infer_batch(image_dir, draw_boxes=True)
        
        elif choice == "3":
            video_path = input("Enter video path: ").strip()
            inference.infer_video(video_path, draw_boxes=True, display=True)
        
        elif choice == "4":
            duration = input("Duration in seconds (default 30): ").strip()
            duration = int(duration) if duration else 30
            inference.infer_webcam(duration=duration, draw_boxes=True)
        
        else:
            print("Invalid choice")
        
        print("\n✅ Inference complete!")
    
    except Exception as e:
        logger.error(f"Inference failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
