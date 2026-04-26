from .conftest import get_client


def test_auth_login_works():
    client = get_client()
    response = client.post("/api/auth/login", json={"pin": "1234"})
    assert response.status_code == 200
    assert response.json()["token"]


def test_control_requires_auth():
    client = get_client()
    response = client.post("/api/arm")
    assert response.status_code == 401
