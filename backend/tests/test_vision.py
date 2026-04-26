from .conftest import auth_headers, get_client


def test_mannequin_detection_updates_status():
    client = get_client()
    headers = auth_headers(client)
    response = client.post(
        "/api/vision/mannequin",
        headers=headers,
        json={"detected": True, "region": "center", "confidence": 0.73, "safe_zone_only": True},
    )
    assert response.status_code == 200
    status = response.json()["status"]
    assert status["mannequin_detected"] is True
    assert status["mannequin_region"] == "center"


def test_mannequin_detection_requires_safe_zone_only():
    client = get_client()
    headers = auth_headers(client)
    response = client.post(
        "/api/vision/mannequin",
        headers=headers,
        json={"detected": True, "region": "left", "confidence": 0.8, "safe_zone_only": False},
    )
    assert response.status_code == 400
