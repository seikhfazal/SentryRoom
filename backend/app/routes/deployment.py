from fastapi import APIRouter

from ..config import get_settings

router = APIRouter(prefix="/api/deployment")


@router.get("/mode")
def deployment_mode():
    settings = get_settings()
    return {
        "mode": settings.mode,
        "public_demo": settings.public_demo,
        "hardware_enabled": settings.hardware_enabled,
        "mqtt_enabled": settings.mqtt_enabled,
        "safe_for_public_demo": settings.safe_for_public_demo,
    }
