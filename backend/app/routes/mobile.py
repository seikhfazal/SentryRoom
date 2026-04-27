from fastapi import APIRouter, Depends

from ..auth import require_auth
from ..deployment_mode import control_message, log_public_demo_action
from ..models import EventCreate, QuickActionRequest, Severity, SentryState
from ..mqtt_client import mqtt_client
from ..services import event_service, state_service

router = APIRouter(prefix="/api/mobile")


@router.get("/status")
def mobile_status():
    return state_service.get_status()


@router.post("/quick-action")
def quick_action(payload: QuickActionRequest, _token: str = Depends(require_auth)):
    action = payload.action
    if action == "arm":
        status = state_service.arm()
        mqtt_client.publish("arm", {"armed": True})
    elif action == "disarm":
        status = state_service.disarm()
        mqtt_client.publish("disarm", {"armed": False})
    elif action == "demo_mode":
        status = state_service.demo_start()
        mqtt_client.publish("sentry_mode", {"mode": "DEMO_SEQUENCE"})
    elif action == "stop_all":
        status = state_service.stop_all()
        mqtt_client.publish("stop_all", {"reason": "mobile_stop_all"})
    elif action == "lock":
        status = state_service.lock()
        mqtt_client.publish("lock", {"locked": True})
    elif action == "unlock":
        status = state_service.unlock()
        mqtt_client.publish("lock", {"locked": False})
    elif action == "sentry_idle":
        status = state_service.set_sentry_mode(SentryState.IDLE)
        mqtt_client.publish("sentry_mode", {"mode": "IDLE"})
    elif action == "sentry_scan":
        status = state_service.set_sentry_mode(SentryState.SCANNING)
        mqtt_client.publish("sentry_mode", {"mode": "SCANNING"})
    else:
        status = state_service.set_sentry_mode(SentryState.CINEMATIC_ALERT)
        mqtt_client.publish("sentry_mode", {"mode": "CINEMATIC_ALERT"})
    log_public_demo_action("mobile", action)
    event_service.log_event(EventCreate(severity=Severity.INFO, source="mobile", message=f"Mobile quick action: {action}"))
    return {"ok": True, "message": control_message(f"Mobile quick action: {action}"), "status": status}
