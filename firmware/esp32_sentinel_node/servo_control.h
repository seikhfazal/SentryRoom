#pragma once
#include <Arduino.h>

void servoSetup();
bool servoAnglesValid(int pan, int tilt);
bool moveServoSafe(int pan, int tilt);
void centerServos();
int currentPan();
int currentTilt();
