from functools import lru_cache
from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="Sentinel Room", validation_alias="SENTINEL_APP_NAME")
    env: str = Field(default="dev", validation_alias="SENTINEL_ENV")
    db_path: str = Field(default="./sentinel_room.db", validation_alias="SENTINEL_DB_PATH")
    mock_mode: bool = Field(default=True, validation_alias="SENTINEL_MOCK_MODE")
    bind_host: str = Field(default="127.0.0.1", validation_alias="SENTINEL_BIND_HOST")
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
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
