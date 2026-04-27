from functools import lru_cache
from pathlib import Path
from typing import Literal
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="Sentinel Room", validation_alias="SENTINEL_APP_NAME")
    env: str = Field(default="dev", validation_alias="SENTINEL_ENV")
    db_path: str = Field(default="./sentinel_room.db", validation_alias="SENTINEL_DB_PATH")
    mode: Literal["mock", "hardware"] = Field(default="mock", validation_alias="SENTINEL_MODE")
    mock_mode: bool = Field(default=True, validation_alias="SENTINEL_MOCK_MODE")
    enable_hardware: bool = Field(default=False, validation_alias="SENTINEL_ENABLE_HARDWARE")
    enable_mqtt: bool = Field(default=False, validation_alias="SENTINEL_ENABLE_MQTT")
    public_demo: bool = Field(default=False, validation_alias="SENTINEL_PUBLIC_DEMO")
    bind_host: str = Field(default="127.0.0.1", validation_alias=AliasChoices("SENTINEL_BIND_HOST", "SENTINEL_HOST"))
    port: int = Field(default=8000, validation_alias="SENTINEL_PORT")
    allow_lan: bool = Field(default=False, validation_alias="SENTINEL_ALLOW_LAN")
    pin: str = Field(default="1234", validation_alias="SENTINEL_PIN")
    readonly_status_without_auth: bool = Field(default=True, validation_alias="SENTINEL_READONLY_STATUS_WITHOUT_AUTH")
    cors_origins: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173,tauri://localhost",
        validation_alias="SENTINEL_CORS_ORIGINS",
    )
    mqtt_host: str = Field(default="127.0.0.1", validation_alias="MQTT_HOST")
    mqtt_port: int = Field(default=1883, validation_alias="MQTT_PORT")
    mqtt_client_id: str = Field(default="sentinel-room-backend", validation_alias="MQTT_CLIENT_ID")
    pseudo_laser_max_pwm: int = Field(default=80, validation_alias="PSEUDO_LASER_MAX_PWM")
    servo_pan_min: int = Field(default=20, validation_alias="SERVO_PAN_MIN")
    servo_pan_max: int = Field(default=160, validation_alias="SERVO_PAN_MAX")
    servo_tilt_min: int = Field(default=40, validation_alias="SERVO_TILT_MIN")
    servo_tilt_max: int = Field(default=120, validation_alias="SERVO_TILT_MAX")
    session_ttl_minutes: int = Field(default=720, validation_alias="SESSION_TTL_MINUTES")

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @property
    def resolved_db_path(self) -> Path:
        return Path(self.db_path).resolve()

    @property
    def cors_origin_list(self) -> list[str]:
        origins = [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
        return ["*"] if "*" in origins else origins

    @property
    def is_mock_mode(self) -> bool:
        return self.mode == "mock" or self.public_demo

    @property
    def hardware_enabled(self) -> bool:
        return self.mode == "hardware" and self.enable_hardware and not self.public_demo

    @property
    def mqtt_enabled(self) -> bool:
        return self.hardware_enabled and self.enable_mqtt

    @property
    def safe_for_public_demo(self) -> bool:
        return self.mode == "mock" and self.public_demo and not self.hardware_enabled and not self.mqtt_enabled


@lru_cache
def get_settings() -> Settings:
    return Settings()
