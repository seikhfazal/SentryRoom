from .models import EventCreate, Severity
from .services import event_service, state_service


def seed_mock_device() -> None:
    state_service.update_status(device_online=True, mock_mode=True, message="Mock hardware online")
    event_service.log_event(
        EventCreate(
            severity=Severity.INFO,
            source="mock",
            message="Mock device initialized",
            metadata={"device": "virtual-esp32"},
        )
    )
