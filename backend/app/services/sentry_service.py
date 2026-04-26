from ..models import SentryState
from . import state_service
from .calibration_service import validate_angles


def move_to(pan: int, tilt: int):
    validate_angles(pan, tilt)
    return state_service.update_status(pan=pan, tilt=tilt, sentry_state=SentryState.CALIBRATION)
