import argparse
import json
import time
from dataclasses import dataclass

import cv2
import requests


@dataclass
class Detection:
    detected: bool
    region: str = "lost"
    confidence: float = 0.0


def classify_region(width: int, x_center: float) -> str:
    if x_center < width / 3:
        return "left"
    if x_center > (width / 3) * 2:
        return "right"
    return "center"


def detect_mannequin_form(frame) -> Detection:
    """Detect upright mannequin/person-like forms for logging only.

    This deliberately outputs a coarse left/center/right region. Do not convert
    boxes into servo aim points or pseudo-laser targeting.
    """
    hog = cv2.HOGDescriptor()
    hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
    boxes, weights = hog.detectMultiScale(frame, winStride=(8, 8), padding=(16, 16), scale=1.05)
    if len(boxes) == 0:
        return Detection(False)
    best_index = max(range(len(boxes)), key=lambda index: float(weights[index]))
    x, _y, w, _h = boxes[best_index]
    confidence = max(0.0, min(float(weights[best_index]) / 2.0, 1.0))
    return Detection(True, classify_region(frame.shape[1], x + w / 2), confidence)


def post_detection(base_url: str, token: str, detection: Detection) -> None:
    if not token:
        return
    requests.post(
        f"{base_url.rstrip('/')}/api/vision/mannequin",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "detected": detection.detected,
            "region": detection.region,
            "confidence": detection.confidence,
            "source": "vision-mannequin",
            "safe_zone_only": True,
        },
        timeout=1.5,
    )


def main():
    parser = argparse.ArgumentParser(description="Safe mannequin-form detector for Sentinel Room logging.")
    parser.add_argument("--backend", default="http://127.0.0.1:8000")
    parser.add_argument("--token", default="", help="Bearer token from /api/auth/login. If omitted, prints JSON only.")
    parser.add_argument("--camera", type=int, default=0)
    args = parser.parse_args()

    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        raise SystemExit("Could not open webcam")

    last_post = 0.0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        detection = detect_mannequin_form(frame)
        print(json.dumps(detection.__dict__), flush=True)

        if time.time() - last_post > 1.0:
            post_detection(args.backend, args.token, detection)
            last_post = time.time()

        label = f"mannequin-form: {detection.region} {detection.confidence:.2f}" if detection.detected else "mannequin-form: lost"
        cv2.putText(frame, label, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (80, 220, 255), 2)
        cv2.imshow("Sentinel Room Mannequin Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
