# Build Guide

## Build order

1. Run software in mock mode.
2. Open the web dashboard and test Stop All.
3. Open `/mobile` and test phone-sized controls locally.
4. Open Wokwi simulation and test the virtual ESP32.
5. Build the minimal physical prototype.
6. Add RGB/status lighting.
7. Add PIR, reed switch, and ultrasonic sensor.
8. Tune calibration zones.
9. Only then test real MQTT hardware mode.

## Minimal prototype

Build this first:

- ESP32 Dev Board
- Pan servo
- Tilt servo
- Red LED pseudo-laser with resistor
- Buzzer
- One button or PIR sensor input

Do not wire mains AC. Use breadboard and low-voltage DC only.

## Software stack

- Backend: FastAPI
- Database: SQLite
- Live updates: WebSocket
- Device messaging: MQTT with Mosquitto
- Web app: Vite + React
- Desktop app: Tauri
- Firmware: ESP32/Arduino C++
- Simulation: Wokwi first
- Vision demo: OpenCV ArUco marker tracking

## Key folders

```text
backend\                 FastAPI control server
apps\web\                browser/PWA dashboard
apps\desktop\            Windows desktop app scaffold
packages\ui\             shared React UI
firmware\esp32_sentinel_node\  ESP32 firmware
simulation\wokwi\        virtual hardware demo
vision\                  OpenCV marker demos
docs\                    full documentation
```
