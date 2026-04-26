import json
from . import state_service
from ..database import db
from ..models import Event, EventCreate


def log_event(event: EventCreate) -> Event:
    with db() as conn:
        cur = conn.execute(
            "INSERT INTO events (severity, source, message, metadata) VALUES (?, ?, ?, ?)",
            (event.severity, event.source, event.message, json.dumps(event.metadata)),
        )
        row = conn.execute("SELECT * FROM events WHERE id = ?", (cur.lastrowid,)).fetchone()
    return Event(
        id=row["id"],
        created_at=row["created_at"],
        severity=row["severity"],
        source=row["source"],
        message=row["message"],
        metadata=json.loads(row["metadata"]),
    )


def list_events(limit: int = 100) -> list[Event]:
    with db() as conn:
        rows = conn.execute(
            "SELECT * FROM events ORDER BY id DESC LIMIT ?",
            (min(limit, 500),),
        ).fetchall()
    return [
        Event(
            id=row["id"],
            created_at=row["created_at"],
            severity=row["severity"],
            source=row["source"],
            message=row["message"],
            metadata=json.loads(row["metadata"]),
        )
        for row in rows
    ]


def clear_mock_events() -> None:
    with db() as conn:
        conn.execute("DELETE FROM events WHERE source IN ('mock', 'demo')")
