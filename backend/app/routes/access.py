from fastapi import APIRouter, Depends

from ..auth import require_auth
from ..models import EventCreate, Severity
from ..mqtt_client import mqtt_client
from ..services import event_service, state_service

router = APIRouter(prefix="/api")


@router.post("/arm")
def arm(_token: str = Depends(require_auth)):
    status = state_service.arm()
    mqtt_client.publish("arm", {"armed": True})
    event_service.log_event(EventCreate(severity=Severity.INFO, source="api", message="System armed"))
    return {"ok": True, "status": status}


@router.post("/disarm")
def disarm(_token: str = Depends(require_auth)):
    status = state_service.disarm()
    mqtt_client.publish("disarm", {"armed": False})
    event_service.log_event(EventCreate(severity=Severity.INFO, source="api", message="System disarmed"))
    return {"ok": True, "status": status}


@router.post("/lock")
def lock(_token: str = Depends(require_auth)):
    status = state_service.lock()
    mqtt_client.publish("lock", {"locked": True})
    event_service.log_event(EventCreate(severity=Severity.ALERT, source="api", message="Manual lockdown"))
    return {"ok": True, "status": status}


@router.post("/unlock")
def unlock(_token: str = Depends(require_auth)):
    status = state_service.unlock()
    mqtt_client.publish("lock", {"locked": False})
    event_service.log_event(EventCreate(severity=Severity.INFO, source="api", message="Lock released"))
    return {"ok": True, "status": status}
