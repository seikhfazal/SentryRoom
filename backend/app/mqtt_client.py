import json
from typing import Any

try:
    import paho.mqtt.client as mqtt
except Exception:  # pragma: no cover - optional in docs-only environments
    mqtt = None

from .config import get_settings


TOPICS = {
    "arm": "sentinel/cmd/arm",
    "disarm": "sentinel/cmd/disarm",
    "sentry_mode": "sentinel/cmd/sentry/mode",
    "sentry_move": "sentinel/cmd/sentry/move",
    "sentry_calibrate": "sentinel/cmd/sentry/calibrate",
    "rgb": "sentinel/cmd/rgb",
    "pseudo_laser": "sentinel/cmd/pseudo_laser",
    "buzzer": "sentinel/cmd/buzzer",
    "lock": "sentinel/cmd/lock",
    "mist_manual": "sentinel/cmd/mist_manual",
    "stop_all": "sentinel/cmd/stop_all",
    "safe_mode": "sentinel/cmd/safe_mode",
}


class MqttClient:
    def __init__(self) -> None:
        self.connected = False
        self._client = None

    def start(self) -> None:
        settings = get_settings()
        if settings.mock_mode or mqtt is None:
            return
        self._client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=settings.mqtt_client_id)
        self._client.connect_async(settings.mqtt_host, settings.mqtt_port, 60)
        self._client.loop_start()
        self.connected = True

    def stop(self) -> None:
        if self._client:
            self._client.loop_stop()
            self._client.disconnect()
        self.connected = False

    def publish(self, key: str, payload: dict[str, Any] | None = None) -> None:
        topic = TOPICS[key]
        data = json.dumps(payload or {})
        if self._client and self.connected:
            self._client.publish(topic, data, qos=1)
        else:
            print(f"[mock-mqtt] {topic} {data}")


mqtt_client = MqttClient()
