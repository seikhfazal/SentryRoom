# Sentinel Room Arduino Component Tests

Open each folder's `.ino` file directly in Arduino IDE. Each sketch is standalone so you can test one component before uploading the full Sentinel Room ESP32 firmware.

Use board:

```text
ESP32 Dev Module
```

Serial Monitor:

```text
115200 baud
```

## Required library

Only the servo sketches require an Arduino library:

```text
ESP32Servo
```

Install it from `Tools > Manage Libraries`.

The full firmware also needs:

```text
PubSubClient
```

## Test order

1. `stop_all_button_test`
2. `rgb_led_test`
3. `pseudo_laser_led_test`
4. `buzzer_test`
5. `pan_tilt_servos_test`
6. `pir_sensor_test`
7. `door_reed_button_test`
8. `ir_beam_test`
9. `ultrasonic_sensor_test`
10. `full_io_smoke_test`

## Safety

The pseudo-laser test is for a normal red LED with a resistor only. Do not connect a real laser module. Stop All sketches turn outputs off and center servos where servos are present.

## ESP32 pin map

| Component | GPIO |
|---|---:|
| Pan servo | 18 |
| Tilt servo | 19 |
| Pseudo-laser red LED | 23 |
| Buzzer | 5 |
| RGB R/G/B | 25 / 26 / 27 |
| PIR | 32 |
| Door reed/button | 33 |
| IR beam | 34 |
| Stop All button | 4 |
| Ultrasonic trig/echo | 12 / 14 |
