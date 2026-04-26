from .conftest import auth_headers, get_client


def test_calibration_save_load_works():
    client = get_client()
    headers = auth_headers(client)
    saved = client.post(
        "/api/sentry/calibration/save",
        headers=headers,
        json={"name": "door_center", "pan": 90, "tilt": 80},
    )
    assert saved.status_code == 200
    points = client.get("/api/sentry/calibration")
    assert points.status_code == 200
    assert any(point["name"] == "door_center" and point["pan"] == 90 for point in points.json())
