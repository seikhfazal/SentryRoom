# Wiring

## Default ESP32 pins

| Signal | ESP32 Pin |
|---|---:|
| Pan servo | 18 |
| Tilt servo | 19 |
| Pseudo-laser red LED | 23 |
| Buzzer | 5 |
| RGB red | 25 |
| RGB green | 26 |
| RGB blue | 27 |
| PIR | 32 |
| Door reed/button | 33 |
| IR beam | 34 |
| Stop All button | 4 |
| Ultrasonic trig | 12 |
| Ultrasonic echo | 14 |

Change pins in:

```text
firmware\esp32_sentinel_node\pins.h
```

Arduino IDE entry point:

```text
firmware\esp32_sentinel_node\esp32_sentinel_node.ino
```

Offline Arduino Uno fallback:

```text
firmware\arduino_uno_mock_node\arduino_uno_mock_node.ino
```

## Pseudo-laser LED

Safe prop only:

```text
ESP32 GPIO 23 -> 220 ohm resistor -> red LED anode
red LED cathode -> GND
LED behind black tube/straw/pen barrel -> tiny hole or stencil
```

Do not use a real laser diode or laser module.

## Physical Stop All

Wire a momentary button:

```text
GPIO 4 -> button -> GND
```

The firmware uses `INPUT_PULLUP`, so pressing the button pulls GPIO4 low and immediately enters Safe Mode.

## Servo power

If servos shake, reset, or brown out:

1. Power servos from a separate 5V supply.
2. Connect ESP32 GND and servo power supply GND together.
3. Keep signal wires on GPIO 18 and GPIO 19.

## Build stages

1. ESP32 + servos + LED + buzzer + button.
2. Add RGB ring/status LEDs.
3. Add PIR.
4. Add reed switch.
5. Add ultrasonic sensor.
6. Add optional low-voltage relay simulation only.
