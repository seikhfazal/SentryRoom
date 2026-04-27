from .conftest import auth_headers, get_client


def test_deployment_mode_is_public_mock_demo():
    client = get_client()
    response = client.get("/api/deployment/mode")
    assert response.status_code == 200
    data = response.json()
    assert data == {
        "mode": "mock",
        "public_demo": True,
        "hardware_enabled": False,
        "mqtt_enabled": False,
        "safe_for_public_demo": True,
    }


def test_mock_mode_status_is_available_without_mqtt():
    client = get_client()
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["mock_mode"] is True
    assert data["message"]


def test_public_demo_converts_hardware_action_to_mock_response():
    client = get_client()
    headers = auth_headers(client)
    response = client.post("/api/arm", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert data["message"] == "Hardware control is disabled in public demo mode."
    assert data["status"]["system_state"] == "ARMED"


def test_stop_all_works_in_mock_mode():
    client = get_client()
    headers = auth_headers(client)
    response = client.post("/api/stop-all", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert data["status"]["system_state"] == "SAFE_MODE"
    assert data["status"]["pseudo_laser_on"] is False
