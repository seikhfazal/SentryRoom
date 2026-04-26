from fastapi import APIRouter, Depends, Header, HTTPException

from ..auth import require_auth
from ..models import LoginRequest, LoginResponse
from ..services import auth_service

router = APIRouter(prefix="/api/auth")


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    token = auth_service.login(payload.pin)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid PIN")
    return LoginResponse(token=token)


@router.post("/logout")
def logout(authorization: str | None = Header(default=None), _token: str = Depends(require_auth)):
    token = authorization.removeprefix("Bearer ") if authorization else ""
    auth_service.logout(token)
    return {"ok": True}
