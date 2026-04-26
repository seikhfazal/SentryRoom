from datetime import datetime, timedelta, UTC
import secrets

from ..config import get_settings
from ..database import db


def login(pin: str) -> str | None:
    allowed = pin == get_settings().pin
    with db() as conn:
        conn.execute(
            "INSERT INTO access_log (actor, action, allowed) VALUES (?, ?, ?)",
            ("local_pin", "login", 1 if allowed else 0),
        )
    if not allowed:
        return None
    token = secrets.token_urlsafe(32)
    expires = datetime.now(UTC) + timedelta(minutes=get_settings().session_ttl_minutes)
    with db() as conn:
        conn.execute(
            "INSERT INTO sessions (token, expires_at) VALUES (?, ?)",
            (token, expires.isoformat()),
        )
    return token


def logout(token: str) -> None:
    with db() as conn:
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))


def is_valid_token(token: str | None) -> bool:
    if not token:
        return False
    with db() as conn:
        row = conn.execute("SELECT expires_at FROM sessions WHERE token = ?", (token,)).fetchone()
    if not row:
        return False
    return datetime.fromisoformat(row["expires_at"]) > datetime.now(UTC)
