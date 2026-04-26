#include "config.h"
#include "pins.h"
#include "mqtt_topics.h"
#include "servo_control.h"
#include "led_control.h"
#include "sensor_control.h"
#include "buzzer_control.h"
#include "safety.h"

#if USE_WIFI_MQTT
#include <WiFi.h>
#include <PubSubClient.h>
WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);
#endif

enum FirmwareState {
  IDLE,
  SCANNING,
  MOTION_WAKE,
  CINEMATIC_ALERT,
  DEMO,
  CALIBRATION,
  SAFE_MODE
};

FirmwareState state = IDLE;
unsigned long lastMqttOkMs = 0;
unsigned long lastMqttAttemptMs = 0;
unsigned long lastPublishMs = 0;
unsigned long lastScanStepMs = 0;
unsigned long stateStartedMs = 0;
int scanDirection = 1;
bool alertPatternPlayed = false;

const char* stateName(FirmwareState value) {
  switch (value) {
    case IDLE: return "IDLE";
    case SCANNING: return "SCANNING";
    case MOTION_WAKE: return "MOTION_WAKE";
    case CINEMATIC_ALERT: return "CINEMATIC_ALERT";
    case DEMO: return "DEMO";
    case CALIBRATION: return "CALIBRATION";
    case SAFE_MODE: return "SAFE_MODE";
  }
  return "UNKNOWN";
}

void publishRaw(const char* topic, const String& payload) {
  #if USE_WIFI_MQTT
  if (mqtt.connected()) mqtt.publish(topic, payload.c_str());
  #endif
}

void publishEvent(const char* msg) {
  #if USE_SERIAL_DEBUG
  Serial.println(msg);
  #endif
  publishRaw(TOPIC_EVENT_LOG, String(msg));
}

void setState(FirmwareState next) {
  state = next;
  stateStartedMs = millis();
  alertPatternPlayed = false;
  publishRaw(TOPIC_SENTRY_STATE, String(stateName(state)));
}

int extractJsonInt(const String& body, const char* key, int fallback) {
  int keyIndex = body.indexOf(String("\"") + key + "\"");
  if (keyIndex < 0) return fallback;
  int colonIndex = body.indexOf(':', keyIndex);
  if (colonIndex < 0) return fallback;
  int endIndex = colonIndex + 1;
  while (endIndex < body.length() && (body[endIndex] == ' ' || body[endIndex] == '\t')) endIndex++;
  int startIndex = endIndex;
  if (endIndex < body.length() && body[endIndex] == '-') endIndex++;
  while (endIndex < body.length() && isDigit(body[endIndex])) endIndex++;
  if (endIndex == startIndex) return fallback;
  return body.substring(startIndex, endIndex).toInt();
}

void publishError(const char* msg) {
  #if USE_SERIAL_DEBUG
  Serial.print("ERROR: ");
  Serial.println(msg);
  #endif
  publishRaw(TOPIC_ERROR, String(msg));
}

void stopAllAndIdle(const char* reason) {
  stopAllOutputs();
  publishEvent(reason);
  setState(IDLE);
}

void enterFirmwareSafeMode(const char* reason) {
  enterSafeMode(reason);
  publishError(reason);
  setState(SAFE_MODE);
}

void runDemoSequenceBlocking() {
  setState(DEMO);
  publishEvent("DEMO_SEQUENCE start");
  setRgb(0, 40, 90);
  beepShort();
  centerServos();
  moveServoSafe(55, TILT_CENTER);
  moveServoSafe(125, TILT_CENTER);
  moveServoSafe(90, 80);
  setRgb(120, 0, 0);
  pseudoLaserLockOnPattern();
  alertBeeps();
  stopAllAndIdle("DEMO_SEQUENCE complete");
}

void handleMoveCommand(const String& body) {
  int pan = extractJsonInt(body, "pan", currentPan());
  int tilt = extractJsonInt(body, "tilt", currentTilt());
  if (!servoAnglesValid(pan, tilt)) {
    publishError("Rejected MOVE_TO outside servo limits");
    return;
  }
  setState(CALIBRATION);
  moveServoSafe(pan, tilt);
  publishEvent("MOVE_TO accepted");
}

void handleModeCommand(const String& body) {
  if (body.indexOf("STOP_ALL") >= 0 || body.indexOf("SAFE_MODE") >= 0) {
    enterFirmwareSafeMode("mode command requested safe mode");
  } else if (body.indexOf("DEMO_SEQUENCE") >= 0 || body.indexOf("DEMO") >= 0) {
    runDemoSequenceBlocking();
  } else if (body.indexOf("CINEMATIC_ALERT") >= 0) {
    setState(CINEMATIC_ALERT);
    publishEvent("CINEMATIC_ALERT start");
  } else if (body.indexOf("SCANNING") >= 0) {
    setRgb(0, 30, 80);
    setState(SCANNING);
    publishEvent("Sentry scanning");
  } else if (body.indexOf("CALIBRATION") >= 0) {
    setState(CALIBRATION);
    publishEvent("Calibration mode");
  } else {
    stopAllAndIdle("Sentry idle");
  }
}

void handleCommand(char* topic, byte* payload, unsigned int length) {
  lastMqttOkMs = millis();
  String body;
  for (unsigned int i = 0; i < length; i++) body += (char)payload[i];
  String topicString = String(topic);

  if (topicString == CMD_STOP_ALL || topicString == CMD_SAFE_MODE) {
    enterFirmwareSafeMode("Remote STOP_ALL");
    return;
  }
  if (topicString == CMD_SENTRY_MODE) {
    handleModeCommand(body);
    return;
  }
  if (topicString == CMD_SENTRY_MOVE) {
    handleMoveCommand(body);
    return;
  }
  if (topicString == CMD_PSEUDO_LASER) {
    int pwm = extractJsonInt(body, "pwm", PSEUDO_LASER_MAX_PWM / 2);
    setPseudoLaser(min(pwm, PSEUDO_LASER_MAX_PWM));
    publishEvent("Pseudo-laser LED effect requested");
    return;
  }
  if (topicString == CMD_BUZZER) {
    beepShort();
    publishEvent("Buzzer test");
    return;
  }
  if (topicString == CMD_RGB) {
    int r = extractJsonInt(body, "r", 0);
    int g = extractJsonInt(body, "g", 0);
    int b = extractJsonInt(body, "b", 20);
    setRgb(constrain(r, 0, 120), constrain(g, 0, 120), constrain(b, 0, 120));
    publishEvent("RGB update");
    return;
  }
}

void connectWifi() {
  #if USE_WIFI_MQTT
  if (WiFi.status() == WL_CONNECTED) return;
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  #if USE_SERIAL_DEBUG
  Serial.print("Connecting Wi-Fi");
  #endif
  unsigned long started = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - started < 8000) {
    delay(250);
    #if USE_SERIAL_DEBUG
    Serial.print(".");
    #endif
  }
  #if USE_SERIAL_DEBUG
  Serial.println();
  #endif
  #endif
}

void connectMqttIfNeeded() {
  #if USE_WIFI_MQTT
  if (mqtt.connected()) {
    lastMqttOkMs = millis();
    return;
  }
  if (millis() - lastMqttAttemptMs < MQTT_RECONNECT_MS) return;
  lastMqttAttemptMs = millis();
  connectWifi();
  if (WiFi.status() != WL_CONNECTED) return;
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
  mqtt.setCallback(handleCommand);
  String clientId = String("sentinel-room-") + DEVICE_ID;
  if (mqtt.connect(clientId.c_str())) {
    mqtt.subscribe("sentinel/cmd/#");
    lastMqttOkMs = millis();
    publishEvent("Sentinel Room ESP32 online");
  }
  #endif
}

void publishSensors(bool motion, bool door, bool irBroken, long distanceCm) {
  String payload = "{\"id\":\"";
  payload += DEVICE_ID;
  payload += "\",\"state\":\"";
  payload += stateName(state);
  payload += "\"}";
  publishRaw(TOPIC_DEVICE_STATUS, payload);
  publishRaw(TOPIC_SENSOR_PIR, motion ? "1" : "0");
  publishRaw(TOPIC_SENSOR_DOOR, door ? "1" : "0");
  publishRaw(TOPIC_SENSOR_IR_BEAM, irBroken ? "1" : "0");
  publishRaw(TOPIC_SENSOR_ULTRASONIC, String(distanceCm));
}

void updateScan() {
  if (state != SCANNING || millis() - lastScanStepMs < SCAN_STEP_MS) return;
  lastScanStepMs = millis();
  int nextPan = currentPan() + scanDirection;
  if (nextPan >= PAN_MAX || nextPan <= PAN_MIN) scanDirection *= -1;
  moveServoSafe(constrain(nextPan, PAN_MIN, PAN_MAX), TILT_CENTER);
}

void updateAlertState() {
  if (state != CINEMATIC_ALERT) return;
  setRgb(120, 0, 0);
  if (!alertPatternPlayed) {
    alertPatternPlayed = true;
    pseudoLaserLockOnPattern();
    alertBeeps();
  }
  if (millis() - stateStartedMs > ALERT_TIMEOUT_MS) {
    stopAllAndIdle("CINEMATIC_ALERT timeout");
  }
}

void setup() {
  #if USE_SERIAL_DEBUG
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room ESP32 boot");
  #endif
  servoSetup();
  ledSetup();
  buzzerSetup();
  sensorSetup();
  centerServos();
  setRgb(0, 0, 20);
  stateStartedMs = millis();
  lastMqttOkMs = millis();
  connectMqttIfNeeded();
}

void loop() {
  connectMqttIfNeeded();
  #if USE_WIFI_MQTT
  if (mqtt.connected()) mqtt.loop();
  if (!mqtt.connected() && state != SAFE_MODE && mqttFailsafeDue(lastMqttOkMs)) {
    enterFirmwareSafeMode("MQTT disconnected failsafe");
  }
  #endif

  if (stopButtonPressed()) {
    enterFirmwareSafeMode("Physical STOP button");
    delay(250);
    return;
  }

  bool motion = pirMotion();
  bool door = doorOpen();
  bool irBroken = irBeamBroken();
  long distanceCm = ultrasonicCm();

  if (millis() - lastPublishMs > SENSOR_PUBLISH_MS) {
    lastPublishMs = millis();
    publishSensors(motion, door, irBroken, distanceCm);
  }

  bool proximityAlert = distanceCm > 0 && distanceCm < ULTRASONIC_ALERT_CM;
  if ((motion || door || irBroken || proximityAlert) && (state == IDLE || state == SCANNING)) {
    setState(MOTION_WAKE);
    setRgb(90, 60, 0);
    beepShort();
    moveServoSafe(PAN_CENTER, TILT_CENTER);
    publishEvent("Unknown presence sensor wake");
  }

  if (state == MOTION_WAKE && millis() - stateStartedMs > 1200) {
    setState(CINEMATIC_ALERT);
  }

  updateScan();
  updateAlertState();
}
