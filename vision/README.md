# Vision

OpenCV demos for Sentinel Room.

Allowed:

- Webcam smoke test.
- ArUco marker detection.
- Marker position output: left, center, right, lost.
- Mannequin-form detection for display/logging only.
- Person detection only as display/log text.

Not allowed:

- Turning human body or face detections into servo aim points.
- Any laser aiming logic.

## Run

```powershell
cd E:\SentinelRoom
pip install -r vision\requirements.txt
python vision\webcam_test.py
python vision\aruco_detect.py
python vision\marker_stream.py
python vision\mannequin_detect.py
```

To post mannequin detections to the backend, log in first and pass the bearer token:

```powershell
python vision\mannequin_detect.py --backend http://127.0.0.1:8000 --token YOUR_TOKEN
```
