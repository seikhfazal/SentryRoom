# Wokwi Simulation

Open this folder in Wokwi or create a new Wokwi ESP32 project and paste:

- `sketch.ino`
- `diagram.json`
- `libraries.txt`

The simulation includes ESP32, pan/tilt servos, red LED pseudo-laser, RGB status LEDs, buzzer, buttons for PIR, door, IR beam, physical Stop All, and HC-SR04 ultrasonic sensor. MQTT is mocked with serial output because Wokwi network setup depends on account/project settings.

The pseudo-laser LED is only a normal LED with a resistor.

## Controls

- `PIR`: simulates motion wake.
- `DOOR`: simulates door open.
- `IR`: simulates a broken IR beam.
- `STOP`: turns off pseudo-laser/buzzer, centers servos, and enters `SAFE_MODE`.
- HC-SR04 distance below 60 cm triggers the same safe alert demo path.

The serial monitor prints JSON-like state lines once per second.
