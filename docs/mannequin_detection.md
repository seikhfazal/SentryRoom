# Mannequin Detection

Sentinel Room supports mannequin-form detection as a safe vision/logging feature.

Allowed behavior:

- Detect a mannequin-like upright form.
- Report only `left`, `center`, `right`, or `lost`.
- Log `Mannequin form detected`.
- Display the status in the Camera page.
- Use detections for safe-zone demos only after explicit future safety review.

Blocked behavior:

- Do not aim at body, face, torso, or exact bounding-box coordinates.
- Do not turn mannequin/person boxes into servo target points.
- Do not turn on the pseudo-laser because of a person/mannequin detection.
- Do not trigger mist/spray automatically.

Run:

```powershell
cd E:\SentinelRoom
pip install -r vision\requirements.txt
python vision\mannequin_detect.py
```

To post to the backend, log in through `/api/auth/login` and pass the token:

```powershell
python vision\mannequin_detect.py --token YOUR_TOKEN
```
