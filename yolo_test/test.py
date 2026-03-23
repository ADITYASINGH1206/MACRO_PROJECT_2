import argparse
import glob
import os
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
from typing import Optional, Union

import torch
from ultralytics import YOLO


DEFAULT_TEST_SOURCE = "DataSet/test/images"
DEFAULT_PROJECT = "runs_face"
DEFAULT_IMG_SIZE = 512


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Evaluate the YOLO face detector and run predictions on files, webcams, or stream URLs."
    )
    parser.add_argument(
        "--source",
        type=str,
        default=None,
        help=(
            "Prediction source. Examples: 0 for default webcam, 1 for a second camera, "
            "DataSet/test/images, video.mp4, rtsp://..., or http://..."
        ),
    )
    parser.add_argument(
        "--imgsz",
        type=int,
        default=DEFAULT_IMG_SIZE,
        help="Inference image size.",
    )
    parser.add_argument(
        "--conf",
        type=float,
        default=0.25,
        help="Confidence threshold for predictions.",
    )
    parser.add_argument(
        "--eval",
        action="store_true",
        help="Run validation on the test split before prediction. This happens automatically when --source is omitted.",
    )
    parser.add_argument(
        "--no-save",
        action="store_true",
        help="Disable saving annotated predictions.",
    )
    parser.add_argument(
        "--name",
        type=str,
        default=None,
        help="Optional run name override for prediction outputs.",
    )
    return parser.parse_args()


def resolve_source(raw_source: Optional[str]) -> Union[int, str]:
    if raw_source is None:
        return DEFAULT_TEST_SOURCE

    normalized = raw_source.strip()
    if normalized.lower() in {"webcam", "camera", "cam"}:
        return 0
    if normalized.isdigit():
        return int(normalized)
    return normalized


def is_live_source(source: Union[int, str]) -> bool:
    if isinstance(source, int):
        return True

    source_lower = source.lower()
    return source_lower.startswith(("rtsp://", "rtmp://", "http://", "https://"))


def load_model() -> YOLO:
    # Find the latest trained model
    runs = sorted(glob.glob("runs/detect/runs_face/yolov8s_face*/weights/best.pt"))
    if runs:
        model_path = runs[-1]
        print(f"Loading trained model from: {model_path}")
    else:
        model_path = "yolov8s.pt"
        print(f"No trained model found, using pretrained: {model_path}")

    return YOLO(model_path)


def evaluate_model(model: YOLO, device: Union[int, str], imgsz: int) -> None:
    print("\n" + "=" * 60)
    print("EVALUATING MODEL ON TEST DATASET")
    print("=" * 60)

    metrics = model.val(
        data="DataSet/data.yaml",
        imgsz=imgsz,
        device=device,
        split="test",
        project=DEFAULT_PROJECT,
        name="yolov8s_face_test_metrics",
    )

    print("\n" + "=" * 60)
    print("TEST DATASET ACCURACY RESULTS")
    print("=" * 60)
    try:
        accuracy_map50 = metrics.box.map50 * 100
        accuracy_map = metrics.box.map * 100
        precision = metrics.box.mp * 100
        recall = metrics.box.mr * 100

        print(f"Accuracy (mAP@50):        {accuracy_map50:.2f}%")
        print(f"Accuracy (mAP@50-95):     {accuracy_map:.2f}%")
        print(f"Precision:                {precision:.2f}%")
        print(f"Recall:                   {recall:.2f}%")
        print(f"F1-Score:                 {(2 * precision * recall / (precision + recall + 1e-6)):.2f}%")
    except AttributeError:
        print("Could not read detailed metrics attributes from validation results.")

    print("=" * 60 + "\n")


def predict_source(
    model: YOLO,
    source: Union[int, str],
    device: Union[int, str],
    imgsz: int,
    conf: float,
    save: bool,
    run_name: Optional[str],
) -> None:
    live_source = is_live_source(source)
    default_name = "yolov8s_face_live" if live_source else "yolov8s_face_test_preds"

    print(f"Running predictions on source: {source}")
    results = model.predict(
        source=source,
        imgsz=imgsz,
        conf=conf,
        device=device,
        project=DEFAULT_PROJECT,
        name=run_name or default_name,
        save=save,
        show=live_source,
        stream=live_source,
    )

    if live_source:
        for _ in results:
            pass

    if save:
        print(f"Predictions saved to: {DEFAULT_PROJECT}/{run_name or default_name}/")
    elif live_source:
        print("Live predictions ran without saving outputs.")


def main() -> None:
    args = parse_args()
    device = 0 if torch.cuda.is_available() else "cpu"
    source = resolve_source(args.source)
    model = load_model()

    if args.eval or args.source is None:
        evaluate_model(model, device=device, imgsz=args.imgsz)

    predict_source(
        model,
        source=source,
        device=device,
        imgsz=args.imgsz,
        conf=args.conf,
        save=not args.no_save,
        run_name=args.name,
    )


if __name__ == "__main__":
    main()