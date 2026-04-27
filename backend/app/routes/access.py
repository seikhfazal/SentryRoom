from fastapi import APIRouter, Depends

from ..auth import require_auth
from ..deployment_mode import control_message, log_public_demo_action
from ..models import EventCreate, Severity
from ..mqtt_client import mqtt_client
from ..services import event_service, state_service

router = APIRouter(prefix="/api")


@router.post("/arm")
def arm(_token: str = Depends(require_auth)):
    status = state_service.arm()
    mqtt_client.publish("arm", {"armed": True})
    log_public_demo_action("api", "arm")
    event_service.log_event(EventCreate(severity=Severity.INFO, source="api", message="System armed"))
    return {"ok": True, "message": control_message("System armed"), "status": status}


@router.post("/disarm")
def disarm(_token: str = Depends(require_auth)):
    status = state_service.disarm()
    mqtt_client.publish("disarm", {"armed": False})
    log_public_demo_action("api", "disarm")
    event_service.log_event(EventCreate(severity=Severity.INFO, source="api", message="System disarmed"))
    return {"ok": True, "message": control_message("System disarmed"), "status": status}


@router.post("/lock")
def lock(_token: str = Depends(require_auth)):
    status = state_service.lock()
    mqtt_client.publish("lock", {"locked": True})
    log_public_demo_action("api", "lock")
    event_service.log_event(EventCreate(severity=Severity.ALERT, source="api", message="Manual lockdown"))
    return {"ok": True, "message": control_message("Manual lockdown"), "status": status}


@router.post("/unlock")
def unlock(_token: str = Depends(require_auth)):
    status = state_service.unlock()
    mqtt_client.publish("lock", {"locked": False})
    log_public_demo_action("api", "unlock")
    event_service.log_event(EventCreate(severity=Severity.INFO, source="api", message="Lock released"))
    return {"ok": True, "message": control_message("Lock released"), "status": status}
