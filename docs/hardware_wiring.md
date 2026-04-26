# Hardware Wiring

Start on a breadboard. Keep servo power separate if movement is unstable. Tie ESP32 ground and external 5V ground together.

Default firmware pins:

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
| Physical Stop All button | 4 |
| Ultrasonic trig | 12 |
| Ultrasonic echo | 14 |

Change pins in `firmware/esp32_sentinel_node/pins.h`.

For a fuller table with Wokwi part names and real ESP32 warnings, see [pin_map.md](pin_map.md).
