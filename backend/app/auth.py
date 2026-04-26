from fastapi import Header, HTTPException

from .services.auth_service import is_valid_token


def _extract_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    prefix = "Bearer "
    if authorization.startswith(prefix):
        return authorization[len(prefix):]
    return None


def require_auth(authorization: str | None = Header(default=None)) -> str:
    token = _extract_token(authorization)
    if not is_valid_token(token):
        raise HTTPException(status_code=401, detail="Authentication required")
    return token
