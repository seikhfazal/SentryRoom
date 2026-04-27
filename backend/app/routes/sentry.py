from fastapi import APIRouter, Depends, HTTPException

from ..auth import require_auth
from ..deployment_mode import control_message, log_public_demo_action
from ..models import EventCreate, ModeRequest, MoveRequest, SentryUnit, Severity
from ..mqtt_client import mqtt_client
from ..services import event_service, sentry_service, state_service

router = APIRouter(prefix="/api/sentry")


@router.get("/units", response_model=list[SentryUnit])
def sentry_units():
    status = state_service.get_status()
    return [
        SentryUnit(
            id="sentry-main",
            label="Sentry Alpha",
            role="primary pan-tilt head",
            online=status.device_online,
            active=True,
            mqtt_prefix="sentinel",
            calibration_profile="default",
        )
    ]


@router.post("/mode")
async def set_mode(payload: ModeRequest, _token: str = Depends(require_auth)):
    status = state_service.set_sentry_mode(payload.mode)
    mqtt_client.publish("sentry_mode", {"mode": payload.mode})
    log_public_demo_action("api", "sentry_mode")
    event_service.log_event(EventCreate(severity=Severity.INFO, source="api", message=f"Sentry mode {payload.mode}"))
    return {"ok": True, "message": control_message(f"Sentry mode {payload.mode}"), "status": status}


@router.post("/move")
async def move(payload: MoveRequest, _token: str = Depends(require_auth)):
    try:
        status = sentry_service.move_to(payload.pan, payload.tilt)
    except ValueError as exc:
        event_service.log_event(EventCreate(severity=Severity.SAFETY, source="api", message=str(exc)))
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    mqtt_client.publish("sentry_move", payload.model_dump())
    log_public_demo_action("api", "sentry_move")
    return {"ok": True, "message": control_message("Sentry movement updated"), "status": status}
