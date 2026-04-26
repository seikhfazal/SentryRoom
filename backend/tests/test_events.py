from .conftest import auth_headers, get_client


def test_event_logging_works():
    client = get_client()
    headers = auth_headers(client)
    created = client.post(
        "/api/events",
        headers=headers,
        json={"severity": "INFO", "source": "test", "message": "event log check", "metadata": {}},
    )
    assert created.status_code == 200
    events = client.get("/api/events")
    assert events.status_code == 200
    assert any(event["message"] == "event log check" for event in events.json())
