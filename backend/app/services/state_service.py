from copy import deepcopy
from ..config import get_settings
from ..models import Status, SystemState, SentryState


def _initial_status() -> Status:
    settings = get_settings()
    if settings.public_demo:
        return Status(
            system_state=SystemState.SAFE_MODE,
            sentry_state=SentryState.IDLE,
            device_online=True,
            mock_mode=True,
            message="Online Demo Mode — No hardware connected.",
        )
    return Status(mock_mode=settings.is_mock_mode, device_online=settings.is_mock_mode)


_status = _initial_status()


def get_status() -> Status:
    return deepcopy(_status)


def update_status(**changes) -> Status:
    global _status
    data = _status.model_dump()
    data.update(changes)
    data["mock_mode"] = get_settings().is_mock_mode
    _status = Status(**data)
    return get_status()


def arm() -> Status:
    return update_status(system_state=SystemState.ARMED, device_online=True, message="Sentry active")


def disarm() -> Status:
    return update_status(system_state=SystemState.DISARMED, sentry_state=SentryState.IDLE, message="Disarmed")


def lock() -> Status:
    return update_status(system_state=SystemState.LOCKDOWN, door_open=False, device_online=True, message="Manual lockdown")


def unlock() -> Status:
    return update_status(system_state=SystemState.ARMED, device_online=True, message="Lock released")


def set_sentry_mode(mode: SentryState) -> Status:
    system_state = SystemState.DEMO if mode in {SentryState.DEMO_SEQUENCE, SentryState.CINEMATIC_ALERT} else _status.system_state
    return update_status(sentry_state=mode, system_state=system_state, message=f"Sentry {mode.lower().replace('_', ' ')}")


def stop_all() -> Status:
    return update_status(
        system_state=SystemState.SAFE_MODE,
        sentry_state=SentryState.IDLE,
        pseudo_laser_on=False,
        pseudo_laser_pwm=0,
        buzzer_on=False,
        mist_enabled=False,
        rgb="safe_blue",
        pan=90,
        tilt=80,
        message="Stop All complete. Safe mode active.",
    )


def demo_start() -> Status:
    return update_status(
        system_state=SystemState.DEMO,
        sentry_state=SentryState.DEMO_SEQUENCE,
        pseudo_laser_on=True,
        pseudo_laser_pwm=min(get_settings().pseudo_laser_max_pwm, 80),
        buzzer_on=True,
        rgb="red_pulse",
        message="Subject acquired",
    )


def demo_stop() -> Status:
    return update_status(
        system_state=SystemState.DISARMED,
        sentry_state=SentryState.IDLE,
        pseudo_laser_on=False,
        pseudo_laser_pwm=0,
        buzzer_on=False,
        rgb="soft_blue",
        message="Demo stopped",
    )
