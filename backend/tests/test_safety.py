from .conftest import auth_headers, get_client


def test_unsafe_angle_is_rejected():
    client = get_client()
    headers = auth_headers(client)
    response = client.post("/api/sentry/move", headers=headers, json={"pan": 999, "tilt": 80})
    assert response.status_code == 400


def test_manual_mist_requires_confirmation():
    client = get_client()
    headers = auth_headers(client)
    response = client.post("/api/mist/manual-test", headers=headers, json={"confirmation": False})
    assert response.status_code == 400
