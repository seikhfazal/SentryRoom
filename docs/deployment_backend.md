# Free Backend Deployment

Sentinel Room supports a local/private hardware backend and an optional free online mock/demo backend. The real hardware-control backend must stay local/private by default.

No paid hosting, paid APIs, paid databases, paid tunnels, paid domains, paid MQTT brokers, paid VPS, or paid cloud services are required. The only expected costs are the physical Arduino/ESP32 hardware and electronic components.

## Modes

### 1. Local Hardware Mode

- Runs on the Windows PC.
- Uses local SQLite.
- Talks to a local MQTT broker such as Mosquitto.
- Controls ESP32/Arduino devices on the same trusted Wi-Fi.
- Requires PIN/login for all control routes.
- Recommended mode for real hardware.

### 2. Local Mock Mode

- Runs on the Windows PC.
- No hardware required.
- MQTT can be disabled.
- Simulates arm/disarm, lock/unlock, sentry modes, pseudo-laser LED state, RGB state, events, demo mode, calibration, and Stop All.

### 3. Free Online Mock/Demo Mode

- Runs on a free host if available.
- Does not control real hardware.
- Does not publish real MQTT hardware commands.
- Shows `Online Demo Mode — No hardware connected.`
- Useful for testing the deployed website/PWA.
- SQLite data may be temporary and can reset.

## Environment Variables

Common variables:

```env
SENTINEL_MODE=mock
SENTINEL_MOCK_MODE=true
SENTINEL_ENABLE_HARDWARE=false
SENTINEL_ENABLE_MQTT=false
SENTINEL_ALLOW_LAN=false
SENTINEL_PUBLIC_DEMO=true
SENTINEL_DB_PATH=./sentinel.db
SENTINEL_PIN=1234
SENTINEL_CORS_ORIGINS=*
SENTINEL_HOST=0.0.0.0
SENTINEL_PORT=8000
```

Mode behavior:

- `SENTINEL_MODE=mock`: no MQTT required, no hardware required, mock state is used.
- `SENTINEL_MODE=hardware`: use only locally with `SENTINEL_ENABLE_HARDWARE=true` and `SENTINEL_ENABLE_MQTT=true`.
- `SENTINEL_PUBLIC_DEMO=true`: disables real hardware commands, prevents real MQTT publishing, and converts actions to mock state changes.

Use a strong local PIN for any reachable backend. Do not commit `.env`.

## Run Backend Locally

From the repo root:

```powershell
cd E:\SentinelRoom
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Health checks:

```powershell
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/api/deployment/mode
```

## Run Local Mock Mode

Use this when no ESP32/Arduino is connected:

```powershell
$env:SENTINEL_MODE="mock"
$env:SENTINEL_MOCK_MODE="true"
$env:SENTINEL_ENABLE_HARDWARE="false"
$env:SENTINEL_ENABLE_MQTT="false"
$env:SENTINEL_PUBLIC_DEMO="false"
$env:SENTINEL_DB_PATH="./sentinel_room.db"
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Mock mode supports:

- System armed/disarmed.
- Door open/closed state.
- Lock/unlock state.
- Sentry idle/scanning/alert/demo state.
- Pseudo-laser red LED mock state.
- RGB mock state.
- Event logs.
- Demo mode.
- Stop All as a mock reset.
- Calibration values in SQLite.

## Run Local Hardware Mode

Use this only on the Windows PC or trusted LAN:

```powershell
$env:SENTINEL_MODE="hardware"
$env:SENTINEL_MOCK_MODE="false"
$env:SENTINEL_ENABLE_HARDWARE="true"
$env:SENTINEL_ENABLE_MQTT="true"
$env:SENTINEL_PUBLIC_DEMO="false"
$env:MQTT_HOST="127.0.0.1"
$env:MQTT_PORT="1883"
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

For phone control on the same trusted Wi-Fi:

```powershell
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

Only do this on trusted Wi-Fi. Do not expose port `8000`, MQTT port `1883`, or the SQLite database to the public internet.

## Docker Local Build

Build:

```powershell
cd E:\SentinelRoom
docker build -t sentinel-room-backend ./backend
```

Run mock/demo:

```powershell
docker run --rm -p 8000:8000 `
  -e SENTINEL_MODE=mock `
  -e SENTINEL_MOCK_MODE=true `
  -e SENTINEL_ENABLE_HARDWARE=false `
  -e SENTINEL_ENABLE_MQTT=false `
  -e SENTINEL_PUBLIC_DEMO=true `
  -e SENTINEL_PIN=change-this `
  sentinel-room-backend
```

Run hardware mode only locally with correct MQTT settings:

```powershell
docker run --rm -p 8000:8000 `
  -e SENTINEL_MODE=hardware `
  -e SENTINEL_MOCK_MODE=false `
  -e SENTINEL_ENABLE_HARDWARE=true `
  -e SENTINEL_ENABLE_MQTT=true `
  -e SENTINEL_PUBLIC_DEMO=false `
  -e MQTT_HOST=host.docker.internal `
  sentinel-room-backend
```

## Render Free Web Service

Render is the recommended free backend option for a hobby/mock FastAPI demo. Render's docs state web services can host Python/FastAPI apps and Docker services, and a service must bind to `0.0.0.0` on the configured port. Render also documents that free web services can spin down after 15 minutes without traffic and that the filesystem is ephemeral by default, so SQLite demo data may reset.

Sources:

- Render Web Services: https://render.com/docs/web-services
- Render FAQ: https://render.com/docs/faq

Deploy:

1. Push the repo to GitHub.
2. Create a new Render Web Service.
3. Select the GitHub repo.
4. Use Docker, with root directory `backend`.
5. Choose the Free instance type if available.
6. Set health check path:

```text
/health
```

7. Set environment variables:

```env
SENTINEL_MODE=mock
SENTINEL_MOCK_MODE=true
SENTINEL_ENABLE_HARDWARE=false
SENTINEL_ENABLE_MQTT=false
SENTINEL_ALLOW_LAN=false
SENTINEL_PUBLIC_DEMO=true
SENTINEL_DB_PATH=./sentinel.db
SENTINEL_PIN=change-this
SENTINEL_CORS_ORIGINS=*
SENTINEL_HOST=0.0.0.0
SENTINEL_PORT=8000
```

8. Deploy.
9. Test:

```text
https://your-service.onrender.com/health
https://your-service.onrender.com/api/deployment/mode
```

Expected deployment mode:

```json
{
  "mode": "mock",
  "public_demo": true,
  "hardware_enabled": false,
  "mqtt_enabled": false,
  "safe_for_public_demo": true
}
```

Notes:

- Render Free is not production-grade.
- Free instances may sleep/spin down.
- Free online demo data may reset.
- Do not connect Render to real hardware.

## Hugging Face Spaces

Hugging Face Spaces is optional and demo-only. Hugging Face documents Docker Spaces with `sdk: docker` in the Space README, and the Spaces overview currently lists free CPU Basic hardware with non-persistent disk by default.

Sources:

- Docker Spaces: https://huggingface.co/docs/hub/en/spaces-sdks-docker
- Spaces Overview: https://huggingface.co/docs/hub/spaces-overview

Use a Docker Space if practical:

1. Create a new Space.
2. Select Docker.
3. Copy the backend Dockerfile setup into the Space repository, or use this repo's `backend` folder.
4. Use the sample Space README at `backend/huggingface_space_README.md`.
5. Set variables:

```env
SENTINEL_MODE=mock
SENTINEL_MOCK_MODE=true
SENTINEL_ENABLE_HARDWARE=false
SENTINEL_ENABLE_MQTT=false
SENTINEL_PUBLIC_DEMO=true
SENTINEL_PIN=change-this
SENTINEL_CORS_ORIGINS=*
SENTINEL_HOST=0.0.0.0
SENTINEL_PORT=8000
```

Warnings:

- Use only for mock/demo mode.
- Free Space disk is not persistent by default.
- SQLite demo data may reset.
- Do not use a Space for real hardware control.

## Koyeb Free Or Similar

Koyeb Free or similar free services can be used only if a free tier is available for your account at the time you deploy. Availability can change. Do not make it mandatory.

Use the same mock/demo variables as Render:

```env
SENTINEL_MODE=mock
SENTINEL_MOCK_MODE=true
SENTINEL_ENABLE_HARDWARE=false
SENTINEL_ENABLE_MQTT=false
SENTINEL_PUBLIC_DEMO=true
```

## Frontend Connection

Local frontend plus local backend:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000/ws/status
```

Phone on same trusted Wi-Fi:

```env
VITE_API_BASE_URL=http://192.168.x.x:8000
VITE_WS_BASE_URL=ws://192.168.x.x:8000/ws/status
```

Online frontend plus online mock backend:

```env
VITE_API_BASE_URL=https://your-free-backend-url
VITE_WS_BASE_URL=wss://your-free-backend-url/ws/status
```

Online frontend plus local backend can fail because browsers may block HTTPS pages from calling plain HTTP LAN/private addresses. Prefer same-Wi-Fi local frontend/backend for hardware, or use a private VPN like Tailscale/ZeroTier. Do not expose the backend publicly.

## What Works Online

Online mock/demo backend supports:

- Health check.
- Deployment mode check.
- PIN login.
- Mock arm/disarm.
- Mock lock/unlock.
- Mock sentry modes and movement.
- Mock calibration values.
- Mock demo start/stop.
- Mock Stop All.
- Event logs.
- WebSocket status.
- PWA testing against an HTTPS backend URL.

## What Requires Local Hardware

These stay local/private:

- ESP32/Arduino control.
- Real MQTT broker commands.
- PIR, reed switch, IR beam, ultrasonic, RGB, buzzer, servo, and pseudo-laser LED outputs.
- Real camera/LAN feeds unless served privately.
- Physical Stop All button integration.

## Security Warnings

Do not expose your hardware-control backend directly to the public internet.

Use local Wi-Fi or a private VPN like Tailscale/ZeroTier for remote access.

Online backend should be mock/demo unless you know what you are doing.

Do not use public port forwarding.

Do not publish router ports for `8000`, `1883`, camera feeds, or SQLite files.

All control actions require PIN/login.

Public demo mode must not expose real hardware controls.

Keep `SENTINEL_PUBLIC_DEMO=true` on public free hosts.

## Test First

Run:

```powershell
cd E:\SentinelRoom
.\.venv\Scripts\python.exe -m pytest backend\tests
```

Then test manually:

1. `GET /health`
2. `GET /api/deployment/mode`
3. `POST /api/auth/login`
4. `POST /api/arm`
5. `POST /api/stop-all`
6. WebSocket `/ws/status`

For public demo, confirm `hardware_enabled=false`, `mqtt_enabled=false`, and `safe_for_public_demo=true`.
