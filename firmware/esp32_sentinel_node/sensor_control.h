#pragma once
#include <Arduino.h>

void sensorSetup();
bool pirMotion();
bool doorOpen();
bool irBeamBroken();
bool stopButtonPressed();
long ultrasonicCm();
