# Sentinel Room Backend

FastAPI control server for Sentinel Room. It is local/private by default for real hardware, and can also run as a free online mock/demo backend for the web/PWA.

## Modes

- Local hardware mode: Windows PC, local SQLite, local MQTT, ESP32/Arduino on trusted Wi-Fi.
- Local mock mode: Windows PC, no hardware required, no MQTT required.
- Online demo mode: free host, mock state only, no real hardware commands, no MQTT hardware publishing.

## Run Locally

From the repo root:

```powershell
cd E:\SentinelRoom
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

From inside `backend`:

```powershell
cd E:\SentinelRoom\backend
..\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Use `--host 0.0.0.0` only on trusted Wi-Fi when a phone on the same LAN needs access.

## Mock/Demo Environment

```env
SENTINEL_MODE=mock
SENTINEL_MOCK_MODE=true
SENTINEL_ENABLE_HARDWARE=false
SENTINEL_ENABLE_MQTT=false
SENTINEL_PUBLIC_DEMO=true
SENTINEL_DB_PATH=./sentinel.db
SENTINEL_PIN=change-this
SENTINEL_CORS_ORIGINS=*
```

## Hardware Environment

Use hardware mode locally only:

```env
SENTINEL_MODE=hardware
SENTINEL_MOCK_MODE=false
SENTINEL_ENABLE_HARDWARE=true
SENTINEL_ENABLE_MQTT=true
SENTINEL_PUBLIC_DEMO=false
MQTT_HOST=127.0.0.1
MQTT_PORT=1883
SENTINEL_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,tauri://localhost
```

Do not expose your hardware-control backend directly to the public internet.

## Docker

```powershell
cd E:\SentinelRoom
docker build -t sentinel-room-backend ./backend
docker run --rm -p 8000:8000 -e SENTINEL_MODE=mock -e SENTINEL_PUBLIC_DEMO=true sentinel-room-backend
```

## Useful Checks

```powershell
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/api/deployment/mode
```

Control routes require `Authorization: Bearer <token>`. Get a token with:

```powershell
curl -X POST http://127.0.0.1:8000/api/auth/login -H "Content-Type: application/json" -d "{\"pin\":\"1234\"}"
```

Full guide: `E:\SentinelRoom\docs\deployment_backend.md`.
