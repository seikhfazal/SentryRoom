import cv2


def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise SystemExit("Could not open webcam")
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        cv2.putText(frame, "Sentinel Room webcam test", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (80, 220, 255), 2)
        cv2.imshow("Sentinel Room Webcam Test", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
