import socket
from fastapi import APIRouter

from ..config import get_settings

router = APIRouter(prefix="/api/network")


def lan_ip() -> str:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("8.8.8.8", 80))
            return sock.getsockname()[0]
    except Exception:
        return "127.0.0.1"


@router.get("/info")
def network_info():
    settings = get_settings()
    ip = lan_ip()
    host = ip if settings.allow_lan else "127.0.0.1"
    base = f"http://{host}:{settings.port}"
    return {
        "lan_enabled": settings.allow_lan,
        "lan_ip": ip,
        "backend_url": base,
        "controller_url": f"{base}/mobile",
        "qr_code": "placeholder: generate QR from controller_url in desktop/web UI",
        "warning": "Trusted local Wi-Fi only. Do not port-forward to the internet.",
    }
