# Arduino IDE Setup For ESP32 Sentinel Node

Open this file in Arduino IDE:

```text
E:\SentinelRoom\firmware\esp32_sentinel_node\esp32_sentinel_node.ino
```

Arduino IDE will automatically load the other `.h` and `.cpp` tabs from the same folder.

## Board setup

1. Open Arduino IDE.
2. Go to `File > Preferences`.
3. Add this ESP32 Boards Manager URL:

```text
https://espressif.github.io/arduino-esp32/package_esp32_index.json
```

4. Go to `Tools > Board > Boards Manager`.
5. Search `esp32`.
6. Install `esp32 by Espressif Systems`.
7. Select a board like:

```text
ESP32 Dev Module
```

## Required libraries

Install from `Tools > Manage Libraries`:

| Library | Purpose |
|---|---|
| ESP32Servo | Pan/tilt servo control |
| PubSubClient | MQTT messaging |

For standalone component tests, open:

```text
E:\SentinelRoom\firmware\component_tests
```

Most component tests use only built-in ESP32 Arduino APIs. The servo and full IO smoke tests require `ESP32Servo`.

## Before upload

Edit:

```text
config.h
```

Set:

```cpp
#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASSWORD "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.10"
```

Use your computer's LAN IP for `MQTT_HOST` when Mosquitto is running on the Windows machine.

## Upload settings

Typical settings:

| Setting | Value |
|---|---|
| Board | ESP32 Dev Module |
| Upload Speed | 921600 or 115200 if upload fails |
| CPU Frequency | 240 MHz |
| Flash Frequency | 80 MHz |
| Port | Your ESP32 COM port |

## Serial monitor

Open Serial Monitor at:

```text
115200 baud
```

Expected startup text:

```text
Sentinel Room ESP32 boot
Sentinel Room ESP32 online
```

## First safe test

1. Upload with only ESP32 connected.
2. Open Serial Monitor.
3. Open and upload `component_tests\stop_all_button_test\stop_all_button_test.ino`.
4. Confirm the physical Stop All button reads correctly.
5. Connect pan/tilt servos.
6. Connect red LED with resistor.
7. Upload `component_tests\pan_tilt_servos_test\pan_tilt_servos_test.ino`.
8. Press physical Stop All button.
9. Confirm pseudo-laser LED turns off and servos center before running the full firmware.
