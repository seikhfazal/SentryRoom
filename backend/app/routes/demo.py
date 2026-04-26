from fastapi import APIRouter, Depends

from ..auth import require_auth
from ..models import EventCreate, Severity, ManualMistRequest
from ..mqtt_client import mqtt_client
from ..safety import require_manual_confirmation
from ..services import event_service, state_service

router = APIRouter(prefix="/api")


@router.post("/demo/start")
def start_demo(_token: str = Depends(require_auth)):
    status = state_service.demo_start()
    mqtt_client.publish("sentry_mode", {"mode": "DEMO_SEQUENCE"})
    event_service.log_event(EventCreate(severity=Severity.ALERT, source="demo", message="Cinematic alert demo started"))
    return {"ok": True, "status": status}


@router.post("/demo/stop")
def stop_demo(_token: str = Depends(require_auth)):
    status = state_service.demo_stop()
    mqtt_client.publish("stop_all", {"reason": "demo_stop"})
    event_service.log_event(EventCreate(severity=Severity.INFO, source="demo", message="Demo stopped"))
    return {"ok": True, "status": status}


@router.post("/mist/manual-test")
def manual_mist(payload: ManualMistRequest, _token: str = Depends(require_auth)):
    require_manual_confirmation(payload.confirmation)
    mqtt_client.publish("mist_manual", {"duration_ms": 500, "fixed_direction_only": True})
    event_service.log_event(EventCreate(severity=Severity.SAFETY, source="api", message="Manual fixed-direction mist test requested"))
    return {"ok": True, "message": "Manual fixed-direction mist test requested"}
