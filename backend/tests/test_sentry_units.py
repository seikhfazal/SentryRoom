from .conftest import get_client


def test_sentry_units_placeholder():
    client = get_client()
    response = client.get("/api/sentry/units")
    assert response.status_code == 200
    units = response.json()
    assert units[0]["id"] == "sentry-main"
    assert units[0]["label"] == "Sentry Alpha"
