# Hardware Overview

Preferred controller: ESP32 Dev Board because Wi-Fi and MQTT are built into the prototype flow.

Core sentry head:

- Pan servo
- Tilt servo
- RGB LED ring or RGB status LEDs
- 5mm red LED pseudo-laser with resistor
- Buzzer
- PIR, reed switch, ultrasonic, and button inputs

The pseudo-laser is a visual LED prop only:

```text
Red LED -> resistor -> black tube/straw/pen barrel -> tiny hole or stencil
```

See [docs/materials_and_wiring.md](docs/materials_and_wiring.md) for the full beginner-friendly wiring guide.
