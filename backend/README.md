# Sentinel Room Backend

FastAPI control server for Sentinel Room.

## Run

```powershell
cd E:\SentinelRoom
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Mock mode is enabled by default in `.env.example`, so the app works without ESP32 hardware.

## Auth

Control routes require `Authorization: Bearer <token>`. Get a token with:

```powershell
curl -X POST http://127.0.0.1:8000/api/auth/login -H "Content-Type: application/json" -d "{\"pin\":\"1234\"}"
```

This is basic local PIN protection for trusted Wi-Fi demos, not internet-grade security.
