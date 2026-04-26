import cv2


def classify_marker(frame_width: int, center_x: float) -> str:
    left_cut = frame_width / 3
    right_cut = (frame_width / 3) * 2
    if center_x < left_cut:
        return "left"
    if center_x > right_cut:
        return "right"
    return "center"


def main():
    cap = cv2.VideoCapture(0)
    dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    parameters = cv2.aruco.DetectorParameters()
    detector = cv2.aruco.ArucoDetector(dictionary, parameters)
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        corners, ids, _ = detector.detectMarkers(frame)
        position = "lost"
        if ids is not None and len(corners):
            cv2.aruco.drawDetectedMarkers(frame, corners, ids)
            first = corners[0][0]
            center_x = float(first[:, 0].mean())
            position = classify_marker(frame.shape[1], center_x)
        cv2.putText(frame, f"marker: {position}", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (80, 220, 255), 2)
        cv2.imshow("Sentinel Room ArUco", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
