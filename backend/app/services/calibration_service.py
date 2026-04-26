from ..config import get_settings
from ..database import db

SAFE_ZONES = [
    "door_center",
    "door_left",
    "door_right",
    "bed_zone",
    "desk_zone",
    "wall_anchor",
    "demo_marker_zone",
]


def validate_angles(pan: int, tilt: int) -> None:
    settings = get_settings()
    if not (settings.servo_pan_min <= pan <= settings.servo_pan_max):
        raise ValueError(f"Pan angle {pan} outside safe limits")
    if not (settings.servo_tilt_min <= tilt <= settings.servo_tilt_max):
        raise ValueError(f"Tilt angle {tilt} outside safe limits")


def save_point(name: str, pan: int, tilt: int) -> dict:
    if name not in SAFE_ZONES:
        raise ValueError("Unknown calibration zone")
    validate_angles(pan, tilt)
    with db() as conn:
        conn.execute(
            """
            INSERT INTO calibration_points (name, pan, tilt, updated_at)
            VALUES (?, ?, ?, datetime('now'))
            ON CONFLICT(name) DO UPDATE SET pan=excluded.pan, tilt=excluded.tilt, updated_at=datetime('now')
            """,
            (name, pan, tilt),
        )
    return {"name": name, "pan": pan, "tilt": tilt}


def list_points() -> list[dict]:
    with db() as conn:
        rows = conn.execute("SELECT * FROM calibration_points ORDER BY name").fetchall()
    existing = {row["name"]: dict(row) for row in rows}
    return [
        existing.get(name, {"name": name, "pan": 90, "tilt": 80, "updated_at": None})
        for name in SAFE_ZONES
    ]
