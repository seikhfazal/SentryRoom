from .config import get_settings
from .models import EventCreate, Severity
from .services import event_service

PUBLIC_DEMO_MESSAGE = "Hardware control is disabled in public demo mode."


def control_message(default: str) -> str:
    return PUBLIC_DEMO_MESSAGE if get_settings().public_demo else default


def log_public_demo_action(source: str, action: str) -> None:
    if get_settings().public_demo:
        event_service.log_event(
            EventCreate(
                severity=Severity.SAFETY,
                source=source,
                message=PUBLIC_DEMO_MESSAGE,
                metadata={"action": action},
            )
        )
