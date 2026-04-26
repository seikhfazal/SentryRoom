#include "led_control.h"
#include "config.h"
#include "pins.h"

void ledSetup() {
  pinMode(PIN_RGB_R, OUTPUT);
  pinMode(PIN_RGB_G, OUTPUT);
  pinMode(PIN_RGB_B, OUTPUT);
  pinMode(PIN_PSEUDO_LASER, OUTPUT);
  pseudoLaserOff();
  setRgb(0, 0, 20);
}

void setRgb(byte r, byte g, byte b) {
  analogWrite(PIN_RGB_R, r);
  analogWrite(PIN_RGB_G, g);
  analogWrite(PIN_RGB_B, b);
}

void setPseudoLaser(byte pwm) {
  byte safePwm = min(pwm, (byte)PSEUDO_LASER_MAX_PWM);
  analogWrite(PIN_PSEUDO_LASER, safePwm);
}

void pseudoLaserOff() {
  analogWrite(PIN_PSEUDO_LASER, 0);
}

void pseudoLaserLockOnPattern() {
  for (int i = 0; i < 2; i++) { setPseudoLaser(45); delay(220); pseudoLaserOff(); delay(220); }
  for (int i = 0; i < 3; i++) { setPseudoLaser(70); delay(90); pseudoLaserOff(); delay(90); }
  setPseudoLaser(PSEUDO_LASER_MAX_PWM);
  delay(1200);
  pseudoLaserOff();
}
