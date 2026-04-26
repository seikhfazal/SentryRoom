from enum import StrEnum
from typing import Any, Literal
from pydantic import BaseModel, Field


class SystemState(StrEnum):
    DISARMED = "DISARMED"
    ARMED = "ARMED"
    ALERT = "ALERT"
    LOCKDOWN = "LOCKDOWN"
    DEMO = "DEMO"
    CALIBRATION = "CALIBRATION"
    SAFE_MODE = "SAFE_MODE"


class SentryState(StrEnum):
    IDLE = "IDLE"
    SCANNING = "SCANNING"
    MOTION_WAKE = "MOTION_WAKE"
    CINEMATIC_ALERT = "CINEMATIC_ALERT"
    DEMO_SEQUENCE = "DEMO_SEQUENCE"
    MARKER_TRACKING_DEMO = "MARKER_TRACKING_DEMO"
    CALIBRATION = "CALIBRATION"
    SAFE_MODE = "SAFE_MODE"


class Severity(StrEnum):
    INFO = "INFO"
    WARN = "WARN"
    ALERT = "ALERT"
    SAFETY = "SAFETY"
    ERROR = "ERROR"


class Status(BaseModel):
    system_state: SystemState = SystemState.DISARMED
    sentry_state: SentryState = SentryState.IDLE
    device_online: bool = False
    mock_mode: bool = True
    door_open: bool = False
    motion_detected: bool = False
    mannequin_detected: bool = False
    mannequin_region: Literal["left", "center", "right", "lost"] = "lost"
    mannequin_confidence: float = 0.0
    pseudo_laser_on: bool = False
    pseudo_laser_pwm: int = 0
    buzzer_on: bool = False
    mist_enabled: bool = False
    pan: int = 90
    tilt: int = 80
    rgb: str = "soft_blue"
    message: str = "Safe mode ready"


class EventCreate(BaseModel):
    severity: Severity = Severity.INFO
    source: str = "backend"
    message: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class Event(EventCreate):
    id: int
    created_at: str


class LoginRequest(BaseModel):
    pin: str


class LoginResponse(BaseModel):
    token: str
    token_type: Literal["bearer"] = "bearer"


class ModeRequest(BaseModel):
    mode: SentryState


class MoveRequest(BaseModel):
    pan: int
    tilt: int


class CalibrationSaveRequest(BaseModel):
    name: str
    pan: int
    tilt: int


class QuickActionRequest(BaseModel):
    action: Literal[
        "arm",
        "disarm",
        "demo_mode",
        "stop_all",
        "lock",
        "unlock",
        "sentry_idle",
        "sentry_scan",
        "cinematic_alert_demo",
    ]


class ManualMistRequest(BaseModel):
    confirmation: bool = False


class MannequinDetectionRequest(BaseModel):
    detected: bool
    region: Literal["left", "center", "right", "lost"] = "lost"
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    source: str = "vision"
    safe_zone_only: bool = True


class SentryUnit(BaseModel):
    id: str
    label: str
    role: str = "pan-tilt sentry head"
    online: bool = False
    active: bool = False
    mqtt_prefix: str = "sentinel"
    calibration_profile: str = "default"


class CommandResult(BaseModel):
    ok: bool
    message: str
    status: Status | None = None
