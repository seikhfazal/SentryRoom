#pragma once
#include <Arduino.h>

void enterSafeMode(const char* reason);
void stopAllOutputs();
bool mqttFailsafeDue(unsigned long lastMqttMs);
