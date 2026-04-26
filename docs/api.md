# API

Base URL: `http://127.0.0.1:8000`

Control routes require `Authorization: Bearer <token>`.

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | Public health check |
| GET | `/api/status` | Current state |
| POST | `/api/auth/login` | Body `{ "pin": "1234" }` |
| POST | `/api/auth/logout` | End session |
| POST | `/api/arm` | Control route |
| POST | `/api/disarm` | Control route |
| POST | `/api/lock` | Manual lockdown |
| POST | `/api/unlock` | Release lock placeholder |
| POST | `/api/sentry/mode` | Body `{ "mode": "SCANNING" }` |
| POST | `/api/sentry/move` | Body `{ "pan": 90, "tilt": 80 }` |
| GET | `/api/sentry/units` | Future multi-sentry unit list |
| POST | `/api/sentry/calibration/save` | Save safe zone |
| GET | `/api/sentry/calibration` | List zones |
| GET | `/api/events` | Event timeline |
| POST | `/api/events` | Add event |
| POST | `/api/demo/start` | Cinematic safe demo |
| POST | `/api/demo/stop` | Stop demo |
| POST | `/api/mist/manual-test` | Requires `{ "confirmation": true }` |
| GET | `/api/mobile/status` | Mobile state |
| POST | `/api/mobile/quick-action` | Phone-safe actions only |
| GET | `/api/network/info` | LAN URL info |
| POST | `/api/stop-all` | Turns outputs off and logs safety event |
| POST | `/api/vision/mannequin` | Safe-zone-only mannequin detection update |
| WS | `/ws/status` | Live status updates |
