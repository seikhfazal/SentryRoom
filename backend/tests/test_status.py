from .conftest import auth_headers, get_client


def test_arm_disarm_works():
    client = get_client()
    headers = auth_headers(client)
    armed = client.post("/api/arm", headers=headers)
    assert armed.status_code == 200
    assert armed.json()["status"]["system_state"] == "ARMED"
    disarmed = client.post("/api/disarm", headers=headers)
    assert disarmed.status_code == 200
    assert disarmed.json()["status"]["system_state"] == "DISARMED"
