import json
import time
import cv2

from aruco_detect import classify_marker


def main():
    cap = cv2.VideoCapture(0)
    dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    detector = cv2.aruco.ArucoDetector(dictionary, cv2.aruco.DetectorParameters())
    while True:
        ok, frame = cap.read()
        if not ok:
            print(json.dumps({"marker": "lost"}), flush=True)
            time.sleep(0.5)
            continue
        corners, ids, _ = detector.detectMarkers(frame)
        position = "lost"
        if ids is not None and len(corners):
            center_x = float(corners[0][0][:, 0].mean())
            position = classify_marker(frame.shape[1], center_x)
        print(json.dumps({"marker": position, "allowed_use": "safe zone selection only"}), flush=True)
        time.sleep(0.2)


if __name__ == "__main__":
    main()
