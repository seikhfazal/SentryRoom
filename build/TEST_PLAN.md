# Test Plan

## Software checks

```powershell
cd E:\SentinelRoom
.\.venv\Scripts\python.exe -m pytest backend\tests
```

```powershell
cd E:\SentinelRoom\apps\web
npm run build
```

```powershell
cd E:\SentinelRoom\apps\desktop
npm run build
```

## First manual tests

1. Start backend.
2. Start web dashboard.
3. Log in with PIN `1234`.
4. Press Stop All.
5. Press Demo Mode.
6. Open `/mobile`.
7. Press Stop All again.
8. Save a calibration point.
9. Confirm Events page shows logs.

## Wokwi tests

1. Open `simulation\wokwi`.
2. Load `sketch.ino`, `diagram.json`, and `libraries.txt`.
3. Press PIR button.
4. Press door button.
5. Confirm pseudo-laser LED turns off after demo.
6. Confirm serial output changes.

## Hardware tests

1. Confirm LED resistor is installed.
2. Confirm no real laser module is installed.
3. Confirm servos center.
4. Confirm Stop All turns LED and buzzer off.
5. Confirm invalid angles are rejected.
6. Confirm MQTT disconnect enters failsafe.
