#pragma once
#include <Arduino.h>

void ledSetup();
void setRgb(byte r, byte g, byte b);
void setPseudoLaser(byte pwm);
void pseudoLaserLockOnPattern();
void pseudoLaserOff();
