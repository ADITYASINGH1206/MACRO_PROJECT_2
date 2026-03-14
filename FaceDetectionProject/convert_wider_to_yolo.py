import os
import cv2
from tqdm import tqdm
import shutil

def convert_wider_to_yolo(split, root_dir, output_dir):

    anno_file = os.path.join(root_dir, 'wider_face_split', 'wider_face_split', f'wider_face_{split}_bbx_gt.txt')
    img_dir = os.path.join(root_dir, f'WIDER_{split}', f'WIDER_{split}', 'images')
    
    save_img_dir = os.path.join(output_dir, 'images', split)
    save_lbl_dir = os.path.join(output_dir, 'labels', split)
    
    os.makedirs(save_img_dir, exist_ok=True)
    os.makedirs(save_lbl_dir, exist_ok=True)

    if not os.path.exists(anno_file):
        print(f"Annotation file not found: {anno_file}")
        return

    with open(anno_file, 'r') as f:
        lines = f.readlines()

    idx = 0
    while idx < len(lines):
        img_path_rel = lines[idx].strip()
        num_boxes = int(lines[idx+1].strip())
        idx += 2
        
        # WIDER FACE format: when num_boxes == 0, there's still 1 dummy line
        if num_boxes == 0:
            idx += 1
            continue
        
        # Load image to get dimensions
        full_img_path = os.path.join(img_dir, img_path_rel)
        img = cv2.imread(full_img_path)
        if img is None:
            print(f"Skipping corrupted/missing image: {full_img_path}")
            idx += num_boxes
            continue
            
        h, w, _ = img.shape
        
        yolo_annotations = []
        for i in range(num_boxes):
            box_info = lines[idx + i].strip().split()
            # WIDER FACE format: x1 y1 w h ...
            x1, y1, box_w, box_h = map(float, box_info[:4])
            
            # Filter out invalid boxes
            if box_w <= 0 or box_h <= 0:
                continue
                
            # Convert to YOLO format (center_x, center_y, width, height) normalized
            cx = (x1 + box_w / 2) / w
            cy = (y1 + box_h / 2) / h
            nw = box_w / w
            nh = box_h / h
            
            # Clip values to [0, 1]
            cx, cy, nw, nh = map(lambda x: max(0, min(1, x)), [cx, cy, nw, nh])
            
            yolo_annotations.append(f"0 {cx:.6f} {cy:.6f} {nw:.6f} {nh:.6f}")
        
        idx += num_boxes
        
        if not yolo_annotations:
            continue # Skip images with no valid faces
            
        # Save image and label
        img_name = os.path.basename(img_path_rel)
        label_name = img_name.replace('.jpg', '.txt').replace('.png', '.txt')
        
        shutil.copy(full_img_path, os.path.join(save_img_dir, img_name))
        with open(os.path.join(save_lbl_dir, label_name), 'w') as f_out:
            f_out.write('\n'.join(yolo_annotations))

def validate_dataset(dataset_dir):
    """Verifies dataset integrity."""
    for split in ['train', 'val']:
        img_path = os.path.join(dataset_dir, 'images', split)
        lbl_path = os.path.join(dataset_dir, 'labels', split)
        
        imgs = set([os.path.splitext(f)[0] for f in os.listdir(img_path)])
        lbls = set([os.path.splitext(f)[0] for f in os.listdir(lbl_path)])
        
        missing_lbls = imgs - lbls
        missing_imgs = lbls - imgs
        
        print(f"\n--- {split.upper()} SPLIT ---")
        print(f"Total Images: {len(imgs)}")
        print(f"Total Labels: {len(lbls)}")
        if missing_lbls:
            print(f"Warning: {len(missing_lbls)} images missing labels.")
        if missing_imgs:
            print(f"Warning: {len(missing_imgs)} labels missing images.")

if __name__ == "__main__":
    WIDER_ROOT = os.path.join(os.path.dirname(__file__), '..', 'archive')
    OUTPUT_ROOT = os.path.join(os.path.dirname(__file__), 'dataset')
    
    print("Converting Training Data...")
    convert_wider_to_yolo('train', WIDER_ROOT, OUTPUT_ROOT)
    print("Converting Validation Data...")
    convert_wider_to_yolo('val', WIDER_ROOT, OUTPUT_ROOT)
    validate_dataset(OUTPUT_ROOT)
