# Run Commands

## Backend

```powershell
cd E:\SentinelRoom
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Health check:

```powershell
curl http://127.0.0.1:8000/health
```

## MQTT broker

```powershell
cd E:\SentinelRoom
docker compose up mosquitto
```

## Web dashboard

```powershell
cd E:\SentinelRoom\apps\web
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

Phone page:

```text
http://127.0.0.1:5173/mobile
```

## Desktop app

```powershell
cd E:\SentinelRoom\apps\desktop
npm install
npm run tauri:dev
```

Build installer after Rust/Tauri prerequisites are installed:

```powershell
npm run tauri:build
```

## Same Wi-Fi phone control

Only on trusted local Wi-Fi:

```powershell
cd E:\SentinelRoom
python -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
curl http://127.0.0.1:8000/api/network/info
```

Set `SENTINEL_ALLOW_LAN=true` in `.env`. Do not port-forward this app.
