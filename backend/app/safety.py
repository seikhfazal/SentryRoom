from fastapi import HTTPException

from .config import get_settings
from .models import EventCreate, Severity
from .services import event_service

BLOCKED_WORDS = {"kill", "fire", "enemy", "weapon", "engage"}


def reject_if_unsafe_text(text: str) -> None:
    lowered = text.lower()
    if any(word in lowered for word in BLOCKED_WORDS):
        event_service.log_event(
            EventCreate(
                severity=Severity.SAFETY,
                source="safety",
                message="Unsafe command wording rejected",
                metadata={"text": text},
            )
        )
        raise HTTPException(status_code=400, detail="Unsafe command wording rejected")


def validate_pseudo_laser_pwm(pwm: int) -> int:
    max_pwm = get_settings().pseudo_laser_max_pwm
    if pwm < 0 or pwm > max_pwm:
        raise HTTPException(status_code=400, detail=f"Pseudo-laser PWM must be 0..{max_pwm}")
    return pwm


def require_manual_confirmation(confirmed: bool) -> None:
    if not confirmed:
        raise HTTPException(status_code=400, detail="Manual confirmation required")
