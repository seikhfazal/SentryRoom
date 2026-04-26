# Sentinel Room ESP32 Pin Map

This pin map matches:

```text
firmware\esp32_sentinel_node\pins.h
simulation\wokwi\diagram.json
```

## Default ESP32 pins

| Function | ESP32 GPIO | Direction | Wokwi part | Notes |
|---|---:|---|---|---|
| Pan servo signal | 18 | Output | `pan` servo PWM | Use external 5V servo power if unstable |
| Tilt servo signal | 19 | Output | `tilt` servo PWM | Use external 5V servo power if unstable |
| Pseudo-laser red LED | 23 | PWM output | red LED through 220 ohm resistor | Normal LED only, not a laser |
| Buzzer | 5 | Output | buzzer | Active buzzer is easiest |
| RGB red | 25 | PWM output | RGB LED R | Common cathode RGB LED in Wokwi |
| RGB green | 26 | PWM output | RGB LED G | Common cathode RGB LED in Wokwi |
| RGB blue | 27 | PWM output | RGB LED B | Common cathode RGB LED in Wokwi |
| PIR motion sensor | 32 | Input | yellow `PIR` button | Active high by default |
| Door reed switch | 33 | Input pullup | green `DOOR` button | Open/high by default in firmware |
| IR break beam | 34 | Input | blue `IR` button | GPIO34 has no internal pullup on real ESP32 |
| Physical Stop All button | 4 | Input pullup | red `STOP` button | Press connects GPIO4 to GND |
| Ultrasonic trig | 12 | Output | HC-SR04 TRIG | Optional |
| Ultrasonic echo | 14 | Input | HC-SR04 ECHO | Use level shifting if your module echoes 5V |

## Pins to change first

Edit:

```text
firmware\esp32_sentinel_node\pins.h
```

If a pin conflicts with your ESP32 board, change it in both:

```text
firmware\esp32_sentinel_node\pins.h
simulation\wokwi\diagram.json
```

## Real ESP32 notes

- GPIO34 is input-only and has no internal pullup/pulldown. Add an external resistor for a real IR beam module if needed.
- GPIO12 can affect boot mode on some ESP32 boards. If your board has boot issues, move ultrasonic trig to another safe GPIO and update `pins.h`.
- Servos should usually use external 5V power. Connect grounds together.
- Do not power multiple servos and LEDs from the ESP32 3.3V pin.

## Arduino Uno mock pin map

The Uno mock sketch is offline only and does not use MQTT.

| Function | Arduino Uno Pin |
|---|---:|
| Pan servo | 9 |
| Tilt servo | 10 |
| Pseudo-laser red LED | 6 |
| Buzzer | 5 |
| PIR/button | 2 |
| Door/button | 3 |
| Stop All button | 4 |
