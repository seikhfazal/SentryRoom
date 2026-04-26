from fastapi import APIRouter

from ..services import state_service

router = APIRouter(prefix="/api")


@router.get("/status")
def status():
    return state_service.get_status()
