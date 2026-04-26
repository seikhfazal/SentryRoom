from fastapi import APIRouter, Depends

from ..auth import require_auth
from ..models import EventCreate, QuickActionRequest, Severity, SentryState
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
    elif action == "disarm":
        status = state_service.disarm()
    elif action == "demo_mode":
        status = state_service.demo_start()
    elif action == "stop_all":
        status = state_service.stop_all()
    elif action == "lock":
        status = state_service.lock()
    elif action == "unlock":
        status = state_service.unlock()
    elif action == "sentry_idle":
        status = state_service.set_sentry_mode(SentryState.IDLE)
    elif action == "sentry_scan":
        status = state_service.set_sentry_mode(SentryState.SCANNING)
    else:
        status = state_service.set_sentry_mode(SentryState.CINEMATIC_ALERT)
    event_service.log_event(EventCreate(severity=Severity.INFO, source="mobile", message=f"Mobile quick action: {action}"))
    return {"ok": True, "status": status}
