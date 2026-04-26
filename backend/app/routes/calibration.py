from fastapi import APIRouter, Depends, HTTPException

from ..auth import require_auth
from ..models import CalibrationSaveRequest, EventCreate, Severity
from ..mqtt_client import mqtt_client
from ..services import calibration_service, event_service

router = APIRouter(prefix="/api/sentry/calibration")


@router.get("")
def get_calibration():
    return calibration_service.list_points()


@router.post("/save")
def save_calibration(payload: CalibrationSaveRequest, _token: str = Depends(require_auth)):
    try:
        point = calibration_service.save_point(payload.name, payload.pan, payload.tilt)
    except ValueError as exc:
        event_service.log_event(EventCreate(severity=Severity.SAFETY, source="calibration", message=str(exc)))
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    mqtt_client.publish("sentry_calibrate", point)
    return {"ok": True, "point": point}
