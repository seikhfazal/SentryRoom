# Safety Checklist

Before powering hardware:

- [ ] No real laser diode/module is installed.
- [ ] Red LED has a resistor.
- [ ] Pseudo-laser LED is behind a tube, pinhole, or stencil.
- [ ] Servos are within mechanical limits.
- [ ] Servo power is stable.
- [ ] ESP32 and external supply share ground.
- [ ] No mains AC is wired.
- [ ] Mist/spray output is disconnected unless fixed-direction and manually confirmed.

Before demos:

- [ ] Stop All works in the web UI.
- [ ] Stop All works in mobile UI.
- [ ] Backend logs STOP_ALL.
- [ ] Pseudo-laser turns off on Stop All.
- [ ] Buzzer turns off on Stop All.
- [ ] Demo mode times out.
- [ ] Safe Mode returns sentry to idle/center.

Vision safety:

- [ ] ArUco marker tracking only maps to safe zones.
- [ ] Person detection is display/log text only.
- [ ] No human body/face/torso aiming is implemented.
