# Firmware

ESP32/Arduino firmware for the Sentinel Room sentry node.

## Compile-time flags

Edit `config.h`:

- `USE_MOCK_SENSORS`
- `USE_REAL_SENSORS`
- `USE_WIFI_MQTT`
- `USE_SERIAL_DEBUG`

## Arduino IDE entry points

Main ESP32 firmware:

```text
firmware\esp32_sentinel_node\esp32_sentinel_node.ino
```

Standalone ESP32 component tests:

```text
firmware\component_tests
```

Arduino Uno no-Wi-Fi mock fallback:

```text
firmware\arduino_uno_mock_node\arduino_uno_mock_node.ino
```

Use the ESP32 sketch for the real project. Use the Uno sketch only to test servos, LED, buzzer, buttons, and safe demo behavior without MQTT.

Use the component tests before building the full node. Each test sketch lives in its own same-named Arduino IDE folder, for example:

```text
firmware\component_tests\stop_all_button_test\stop_all_button_test.ino
firmware\component_tests\pan_tilt_servos_test\pan_tilt_servos_test.ino
```

## Safety

The pseudo-laser output is only a normal red LED with a resistor. MQTT disconnect for more than 5 seconds enters failsafe: LED off, buzzer off, demo stopped, servos centered, RGB low blue/off.

## Main pins

| Function | GPIO |
|---|---:|
| Pan servo | 18 |
| Tilt servo | 19 |
| Pseudo-laser red LED | 23 |
| Buzzer | 5 |
| RGB R/G/B | 25 / 26 / 27 |
| PIR | 32 |
| Door | 33 |
| IR beam | 34 |
| Stop All button | 4 |
| Ultrasonic trig/echo | 12 / 14 |

Full wiring notes are in `docs/materials_and_wiring.md` and `docs/pin_map.md`.

## MQTT command behavior

- `sentinel/cmd/sentry/mode` accepts `IDLE`, `SCANNING`, `CINEMATIC_ALERT`, `DEMO_SEQUENCE`, `CALIBRATION`, and `SAFE_MODE`.
- `sentinel/cmd/sentry/move` accepts JSON-like payloads with `pan` and `tilt`.
- Invalid pan/tilt values are rejected and published to `sentinel/error`.
- `sentinel/cmd/stop_all` disables pseudo-laser, buzzer, demo behavior, and centers servos.
