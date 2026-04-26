from fastapi import APIRouter, Depends

from ..auth import require_auth
from ..models import EventCreate
from ..services import event_service

router = APIRouter(prefix="/api/events")


@router.get("")
def get_events(limit: int = 100):
    return event_service.list_events(limit)


@router.post("")
def create_event(event: EventCreate, _token: str = Depends(require_auth)):
    return event_service.log_event(event)


@router.post("/clear-mock")
def clear_mock_events(_token: str = Depends(require_auth)):
    event_service.clear_mock_events()
    return {"ok": True}
