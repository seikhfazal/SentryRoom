from fastapi import APIRouter, Depends, HTTPException

from ..auth import require_auth
from ..models import EventCreate, MannequinDetectionRequest, Severity
from ..services import event_service, state_service

router = APIRouter(prefix="/api/vision")


@router.post("/mannequin")
def mannequin_detection(payload: MannequinDetectionRequest, _token: str = Depends(require_auth)):
    if not payload.safe_zone_only:
        event_service.log_event(
            EventCreate(
                severity=Severity.SAFETY,
                source="vision",
                message="Rejected mannequin detection update without safe-zone-only flag",
                metadata=payload.model_dump(),
            )
        )
        raise HTTPException(status_code=400, detail="Mannequin detection is safe-zone/logging only")

    status = state_service.update_status(
        mannequin_detected=payload.detected,
        mannequin_region=payload.region,
        mannequin_confidence=payload.confidence,
        message="Mannequin form detected" if payload.detected else "Mannequin scan clear",
    )
    event_service.log_event(
        EventCreate(
            severity=Severity.INFO if payload.detected else Severity.WARN,
            source=payload.source,
            message="Mannequin form detected" if payload.detected else "Mannequin marker lost",
            metadata={
                "region": payload.region,
                "confidence": payload.confidence,
                "safe_zone_only": True,
            },
        )
    )
    return {"ok": True, "status": status}
