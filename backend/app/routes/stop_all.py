from fastapi import APIRouter, Depends

from ..auth import require_auth
from ..models import EventCreate, Severity
from ..mqtt_client import mqtt_client
from ..services import event_service, state_service
from ..websocket_manager import ws_manager

router = APIRouter(prefix="/api")


@router.post("/stop-all")
async def stop_all(_token: str = Depends(require_auth)):
    status = state_service.stop_all()
    mqtt_client.publish("stop_all", {"reason": "api_stop_all"})
    event_service.log_event(EventCreate(severity=Severity.SAFETY, source="api", message="STOP_ALL event"))
    await ws_manager.broadcast({"type": "status", "payload": status.model_dump(mode="json")})
    return {"ok": True, "status": status}
