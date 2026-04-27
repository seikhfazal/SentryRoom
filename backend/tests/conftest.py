import os
from pathlib import Path

os.environ.setdefault("SENTINEL_DB_PATH", str(Path(__file__).parent / "test_sentinel_room.db"))
os.environ.setdefault("SENTINEL_MODE", "mock")
os.environ.setdefault("SENTINEL_MOCK_MODE", "true")
os.environ.setdefault("SENTINEL_ENABLE_HARDWARE", "false")
os.environ.setdefault("SENTINEL_ENABLE_MQTT", "false")
os.environ.setdefault("SENTINEL_PUBLIC_DEMO", "true")
os.environ.setdefault("SENTINEL_PIN", "1234")

from fastapi.testclient import TestClient
from backend.app.main import app


def get_client():
    return TestClient(app)


def auth_headers(client: TestClient):
    response = client.post("/api/auth/login", json={"pin": "1234"})
    assert response.status_code == 200
    token = response.json()["token"]
    return {"Authorization": f"Bearer {token}"}
