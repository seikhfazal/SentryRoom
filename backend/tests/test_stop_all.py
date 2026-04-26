from .conftest import auth_headers, get_client


def test_stop_all_works():
    client = get_client()
    headers = auth_headers(client)
    response = client.post("/api/stop-all", headers=headers)
    assert response.status_code == 200
    status = response.json()["status"]
    assert status["pseudo_laser_on"] is False
    assert status["buzzer_on"] is False
    assert status["mist_enabled"] is False
    assert status["sentry_state"] == "IDLE"
