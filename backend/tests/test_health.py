from .conftest import get_client


def test_health_route_works():
    client = get_client()
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["ok"] is True
