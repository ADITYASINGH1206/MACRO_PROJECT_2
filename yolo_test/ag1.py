from ultralytics import YOLO
import torch
from pathlib import Path


# def main() -> None:
#     device = 0 if torch.cuda.is_available() else "cpu"

#     model = YOLO("yolov8s.pt")

#     results = model.train(
#         data="DataSet/data.yaml",
#         epochs=100,
#         imgsz=512,
#         batch=16,
#         device=device,
#         project="runs_face",
#         name="yolov8s_face",
#         save=True,
#         save_period=10,
#         workers=0,
#     )

#     run_dir = Path(results.save_dir)

#     val_results = model.val(
#         data="DataSet/data.yaml",
#         imgsz=512,
#         device=device,
#         project="runs_face",
#         name="yolov8s_face_val",
#     )

#     print(f"Validation metrics saved to: {val_results.save_dir}")

#     preds = model.predict(
#         source="DataSet/test/images",
#         imgsz=512,
#         device=device,
#         project="runs_face",
#         name="yolov8s_face_test_preds",
#         save=True,
#     )

#     if preds and hasattr(preds[0], "save_dir"):
#         print(f"Test predictions saved to: {preds[0].save_dir}")

#     print(f"Training run directory: {run_dir}")


# if __name__ == "__main__":
#     main()
