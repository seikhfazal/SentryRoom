---
title: Sentinel Room Backend Demo
emoji: 🛡️
colorFrom: green
colorTo: blue
sdk: docker
app_port: 8000
---

# Sentinel Room Backend Demo Space

This optional Hugging Face Space is for mock/demo mode only.

Set these Space variables:

```env
SENTINEL_MODE=mock
SENTINEL_MOCK_MODE=true
SENTINEL_ENABLE_HARDWARE=false
SENTINEL_ENABLE_MQTT=false
SENTINEL_PUBLIC_DEMO=true
SENTINEL_PIN=change-this
SENTINEL_CORS_ORIGINS=*
SENTINEL_HOST=0.0.0.0
SENTINEL_PORT=8000
```

Do not use a Hugging Face Space for real ESP32/Arduino hardware control. Free Space disk is not persistent by default, so SQLite demo data may reset.
