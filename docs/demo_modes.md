# Demo Modes

## Demo sequence

1. Startup sound.
2. RGB blue sweep.
3. Servo center.
4. Servo scan left/right.
5. Servo moves to a calibrated safe zone.
6. Red pseudo-laser LED blinks three times.
7. RGB turns red.
8. Buzzer alert pattern.
9. App shows `Subject acquired`.
10. Return to idle after timeout.

The pseudo-laser is a low-power red LED only and turns off automatically.

## Marker tracking demo

OpenCV tracks a printed ArUco marker/card and outputs `left`, `center`, `right`, or `lost`. This can map to calibrated safe zones. It must not track human body coordinates as targets.
