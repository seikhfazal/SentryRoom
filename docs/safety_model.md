# Safety Model

Sentinel Room uses calibrated zones and safe modes, not human-body targeting.

## Stop All

`POST /api/stop-all` must:

- Turn off pseudo-laser LED.
- Stop buzzer/siren.
- Stop demo.
- Disable mist.
- Return sentry to idle.
- Log `STOP_ALL`.
- Broadcast state update over WebSocket.

## Disconnect failsafe

On backend/device/MQTT disconnect:

- Pseudo-laser off.
- Buzzer off.
- Mist disabled.
- Demo stopped.
- Servos center.
- `SAFE_MODE` logged.

## Vision safety

Person detection may only be displayed/logged as "person detected." ArUco marker tracking is allowed for demo safe-zone selection.
