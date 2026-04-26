#include "safety.h"
#include "config.h"
#include "servo_control.h"
#include "led_control.h"
#include "buzzer_control.h"

void stopAllOutputs() {
  pseudoLaserOff();
  buzzerOff();
  setRgb(0, 0, 20);
  centerServos();
}

void enterSafeMode(const char* reason) {
  stopAllOutputs();
  #if USE_SERIAL_DEBUG
  Serial.print("SAFE_MODE: ");
  Serial.println(reason);
  #endif
}

bool mqttFailsafeDue(unsigned long lastMqttMs) {
  return millis() - lastMqttMs > MQTT_FAILSAFE_MS;
}
