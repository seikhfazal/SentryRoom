#include "servo_control.h"
#include "config.h"
#include "pins.h"
#include <ESP32Servo.h>

Servo panServo;
Servo tiltServo;
static int panAngle = PAN_CENTER;
static int tiltAngle = TILT_CENTER;

bool servoAnglesValid(int pan, int tilt) {
  return pan >= PAN_MIN && pan <= PAN_MAX && tilt >= TILT_MIN && tilt <= TILT_MAX;
}

void servoSetup() {
  panServo.attach(PIN_SERVO_PAN);
  tiltServo.attach(PIN_SERVO_TILT);
  centerServos();
}

bool moveServoSafe(int pan, int tilt) {
  if (!servoAnglesValid(pan, tilt)) return false;
  while (panAngle != pan || tiltAngle != tilt) {
    if (panAngle < pan) panAngle++;
    if (panAngle > pan) panAngle--;
    if (tiltAngle < tilt) tiltAngle++;
    if (tiltAngle > tilt) tiltAngle--;
    panServo.write(panAngle);
    tiltServo.write(tiltAngle);
    delay(12);
  }
  return true;
}

void centerServos() {
  moveServoSafe(PAN_CENTER, TILT_CENTER);
}

int currentPan() { return panAngle; }
int currentTilt() { return tiltAngle; }
