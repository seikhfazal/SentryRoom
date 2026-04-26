from ..models import SentryState
from . import state_service


def tick_mock_motion():
    current = state_service.get_status()
    return state_service.update_status(
        motion_detected=not current.motion_detected,
        door_open=current.motion_detected,
        device_online=True,
        sentry_state=SentryState.MOTION_WAKE if not current.motion_detected else SentryState.IDLE,
    )
