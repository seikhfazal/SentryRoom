# Testing

## Backend

```powershell
cd E:\SentinelRoom
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
pytest backend\tests
```

## Frontend checklist

- Web dashboard launches.
- Desktop app launches.
- Mobile responsive layout works at `/mobile`.
- Dashboard renders status cards and event timeline.
- Buttons call the expected API routes.
- Calibration controls call the calibration API.
- Disconnected state appears when backend is unreachable.
- Stop All is always visible and works.
- Mock mode produces visible updates.

## Firmware checklist

- Compile firmware.
- Test servo center.
- Test RGB ring/status LEDs.
- Test pseudo-laser LED at low PWM.
- Test buzzer.
- Test MQTT commands.
- Test failsafe after broker disconnect.
- Test invalid angle rejection.
- Test Stop All.

## Simulation checklist

- Open `simulation/wokwi` in Wokwi.
- Press PIR and door buttons.
- Confirm serial output changes.
- Confirm pseudo-laser LED turns off after demo timeout.
