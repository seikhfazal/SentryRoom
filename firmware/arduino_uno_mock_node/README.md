# Arduino Uno Mock Node

This is a no-Wi-Fi fallback sketch for Arduino IDE. It does not use MQTT. It lets you test the physical sentry head basics with an Arduino Uno:

- Pan servo
- Tilt servo
- Red LED pseudo-laser effect
- Buzzer
- PIR/button input
- Door/button input
- Physical Stop All button
- Serial monitor state output

Use the ESP32 firmware for the real Sentinel Room build because MQTT and Wi-Fi are required for app control.
