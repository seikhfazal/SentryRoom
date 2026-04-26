# Materials

| Part | Quantity | Purpose | Notes |
|---|---:|---|---|
| ESP32 Dev Board | 1 | Main controller | Preferred because Wi-Fi is useful |
| SG90/MG90S Servo | 2 | Pan/tilt sentry head | Use external 5V supply if unstable |
| 5mm Red LED | 1-3 | Fake laser effect | Must use resistor, not real laser |
| 220 ohm resistor | several | LED current limiting | Value may vary depending on LED |
| RGB LED ring / WS2812 ring | 1 | Sentry eye/status | Optional but cinematic |
| Buzzer | 1 | Alert sound | Active buzzer is easiest |
| PIR sensor | 1 | Motion detection | Can be mocked with button in simulator |
| HC-SR04 ultrasonic sensor | 1 | Distance/proximity | Optional |
| Reed switch | 1 | Door open/close | Can be mocked with button |
| Jumper wires | many | Connections | Male-male/female as needed |
| Breadboard | 1 | Prototype wiring | Use before soldering |
| 5V power supply | 1 | Servos/LEDs | Do not power too much from USB |

Optional later:

- RFID module placeholder
- Keypad placeholder
- LDR light sensor
- Mic/noise sensor placeholder
- Low-voltage relay demo module, never mains AC
