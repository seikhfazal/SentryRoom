# Materials And Wiring

## Materials

| Part | Quantity | Purpose | Notes |
|---|---:|---|---|
| ESP32 Dev Board | 1 | Main controller | Preferred because Wi-Fi is useful |
| Arduino Uno/Nano | optional | Offline mock fallback | No MQTT/Wi-Fi unless extra hardware is added |
| SG90/MG90S Servo | 2 | Pan/tilt sentry head | Use external 5V supply if unstable |
| 5mm Red LED | 1-3 | Fake laser effect | Must use resistor, not real laser |
| 220 ohm resistor | several | LED current limiting | Value may vary depending on LED |
| RGB LED ring / WS2812 ring | 1 | Sentry eye/status | Optional but cinematic |
| Buzzer | 1 | Alert sound | Active buzzer is easiest |
| PIR sensor | 1 | Motion detection | Can be mocked with button in simulator |
| HC-SR04 ultrasonic sensor | 1 | Distance/proximity | Optional |
| Reed switch | 1 | Door open/close | Can be mocked with button |
| Momentary pushbutton | 1 | Physical Stop All | Wire GPIO4 to GND when pressed |
| 10k ohm resistor | several | Pullup/pulldown support | Useful for real IR/reed/button wiring |
| Jumper wires | many | Connections | Male-male/female as needed |
| Breadboard | 1 | Prototype wiring | Use before soldering |
| 5V power supply | 1 | Servos/LEDs | Do not power too much from USB |

## Pseudo-laser LED

Do not use a real laser. Build this:

```text
ESP32 PWM pin -> 220 ohm resistor -> red LED anode
red LED cathode -> GND
LED mounted behind black tube/straw/pen barrel with tiny hole or stencil
```

Default max PWM is 80/255. The firmware turns it off on Stop All, Safe Mode, and MQTT disconnect.

## Minimal prototype wiring

1. ESP32 GND to breadboard ground rail.
2. Pan servo signal to GPIO 18, tilt servo signal to GPIO 19.
3. Servo red wires to 5V supply, servo brown/black wires to common ground.
4. Red LED anode through 220 ohm resistor to GPIO 23.
5. Red LED cathode to ground.
6. Buzzer positive to GPIO 5, negative to ground.
7. Pushbutton or PIR output to GPIO 32.
8. Physical Stop All button between GPIO 4 and GND.

## Pin map

| Function | ESP32 GPIO | Wire to | Notes |
|---|---:|---|---|
| Pan servo signal | 18 | Servo signal/orange wire | External 5V power recommended |
| Tilt servo signal | 19 | Servo signal/orange wire | External 5V power recommended |
| Pseudo-laser LED | 23 | 220 ohm resistor -> red LED anode | Normal LED only |
| Buzzer | 5 | Buzzer positive | Negative to GND |
| RGB red | 25 | RGB red input/resistor | Common cathode example |
| RGB green | 26 | RGB green input/resistor | Common cathode example |
| RGB blue | 27 | RGB blue input/resistor | Common cathode example |
| PIR motion | 32 | PIR OUT | Active high by default |
| Door reed/button | 33 | Reed/button signal | Uses `INPUT_PULLUP` in firmware |
| IR break beam | 34 | IR receiver signal | GPIO34 needs external pull resistor if module requires it |
| Stop All button | 4 | Button to GND | Uses `INPUT_PULLUP` in firmware |
| Ultrasonic trig | 12 | HC-SR04 TRIG | Move if your ESP32 has boot issues |
| Ultrasonic echo | 14 | HC-SR04 ECHO | Level-shift 5V echo to 3.3V if needed |

## Full sentry head wiring

Add RGB status:

- GPIO 25 to red channel resistor/input.
- GPIO 26 to green channel resistor/input.
- GPIO 27 to blue channel resistor/input.
- Common cathode to ground for a simple RGB LED.

Add sensors:

- Reed switch one side to GPIO 33, other side to ground with `INPUT_PULLUP`.
- HC-SR04 trig to GPIO 12, echo to GPIO 14.
- PIR output to GPIO 32, VCC to 5V or 3.3V depending on module, GND to ground.
- IR break-beam receiver output to GPIO 34. Use an external pullup/pulldown if your module output floats.
- Stop All button from GPIO 4 to GND.

## Firmware behavior to expect

- Normal startup centers pan/tilt and turns pseudo-laser off.
- `SCANNING` slowly sweeps pan between safe limits.
- PIR, door, IR beam, or ultrasonic proximity triggers `MOTION_WAKE`.
- `MOTION_WAKE` turns RGB yellow, beeps once, and centers the sentry.
- `CINEMATIC_ALERT` runs the low-power pseudo-laser blink pattern, then times out.
- Stop All or MQTT disconnect turns pseudo-laser and buzzer off, centers servos, and enters safe behavior.

## Arduino IDE files

Use this for the real Wi-Fi/MQTT build:

```text
E:\SentinelRoom\firmware\esp32_sentinel_node\esp32_sentinel_node.ino
```

Use this only as a no-Wi-Fi fallback for basic servo/LED/button testing:

```text
E:\SentinelRoom\firmware\arduino_uno_mock_node\arduino_uno_mock_node.ino
```

Required ESP32 Arduino IDE libraries:

- `ESP32Servo`
- `PubSubClient`

## Optional relay/door feature

Use only low-voltage DC simulation during prototyping. Do not wire mains AC. Add relay control only after you understand isolation, flyback protection, and local electrical safety rules.

## Build order

1. Minimal prototype: ESP32, 2 servos, red LED pseudo-laser, buzzer, one motion/button input.
2. Add RGB ring.
3. Add PIR.
4. Add door/reed switch.
5. Add ultrasonic sensor.
6. Add optional relay only for low-voltage DC simulation.
7. Do not wire mains AC.
