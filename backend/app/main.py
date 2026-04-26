from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import init_db
from .mock_device import seed_mock_device
from .mqtt_client import mqtt_client
from .routes import access, auth, calibration, demo, events, health, mobile, network, sentry, status, stop_all, vision
from .services import state_service
from .websocket_manager import ws_manager


settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    if settings.mock_mode:
        seed_mock_device()
    mqtt_client.start()
    info = network.lan_ip()
    print(f"Sentinel Room backend: http://127.0.0.1:{settings.port}")
    print(f"LAN candidate: http://{info}:{settings.port} (enable with SENTINEL_ALLOW_LAN=true)")
    try:
        yield
    finally:
        mqtt_client.stop()


app = FastAPI(title="Sentinel Room", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in [
    health.router,
    status.router,
    events.router,
    auth.router,
    sentry.router,
    calibration.router,
    access.router,
    demo.router,
    mobile.router,
    network.router,
    stop_all.router,
    vision.router,
]:
    app.include_router(router)


@app.websocket("/ws/status")
async def websocket_status(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        await websocket.send_json({"type": "status", "payload": state_service.get_status().model_dump(mode="json")})
        while True:
            await websocket.receive_text()
            await websocket.send_json({"type": "status", "payload": state_service.get_status().model_dump(mode="json")})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
