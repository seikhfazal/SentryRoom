#include "sensor_control.h"
#include "config.h"
#include "pins.h"

void sensorSetup() {
  pinMode(PIN_PIR, INPUT);
  pinMode(PIN_DOOR, INPUT_PULLUP);
  pinMode(PIN_IR_BEAM, INPUT);
  pinMode(PIN_STOP_BUTTON, INPUT_PULLUP);
  pinMode(PIN_ULTRASONIC_TRIG, OUTPUT);
  pinMode(PIN_ULTRASONIC_ECHO, INPUT);
}

bool pirMotion() {
  return digitalRead(PIN_PIR) == (PIR_ACTIVE_HIGH ? HIGH : LOW);
}

bool doorOpen() {
  return digitalRead(PIN_DOOR) == (DOOR_OPEN_HIGH ? HIGH : LOW);
}

bool irBeamBroken() {
  return digitalRead(PIN_IR_BEAM) == (IR_BEAM_BROKEN_HIGH ? HIGH : LOW);
}

bool stopButtonPressed() {
  return digitalRead(PIN_STOP_BUTTON) == LOW;
}

long ultrasonicCm() {
  digitalWrite(PIN_ULTRASONIC_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_ULTRASONIC_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_ULTRASONIC_TRIG, LOW);
  long duration = pulseIn(PIN_ULTRASONIC_ECHO, HIGH, 30000);
  if (duration == 0) return -1;
  return duration / 58;
}
