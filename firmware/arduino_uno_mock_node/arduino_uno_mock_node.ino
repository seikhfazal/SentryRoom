#include <Servo.h>

const int PIN_SERVO_PAN = 9;
const int PIN_SERVO_TILT = 10;
const int PIN_PSEUDO_LASER = 6;
const int PIN_BUZZER = 5;
const int PIN_PIR_BUTTON = 2;
const int PIN_DOOR_BUTTON = 3;
const int PIN_STOP_BUTTON = 4;

const int PAN_MIN = 20;
const int PAN_MAX = 160;
const int PAN_CENTER = 90;
const int TILT_CENTER = 80;
const int PSEUDO_LASER_MAX_PWM = 80;

Servo panServo;
Servo tiltServo;

enum State {
  IDLE,
  SCANNING,
  MOTION_WAKE,
  CINEMATIC_ALERT,
  SAFE_MODE
};

State state = SCANNING;
int panAngle = PAN_CENTER;
int scanDirection = 1;
unsigned long stateStartedMs = 0;
unsigned long lastScanMs = 0;
unsigned long lastSerialMs = 0;
bool alertPlayed = false;

const char* stateName(State current) {
  switch (current) {
    case IDLE: return "IDLE";
    case SCANNING: return "SCANNING";
    case MOTION_WAKE: return "MOTION_WAKE";
    case CINEMATIC_ALERT: return "CINEMATIC_ALERT";
    case SAFE_MODE: return "SAFE_MODE";
  }
  return "UNKNOWN";
}

void setState(State next) {
  state = next;
  stateStartedMs = millis();
  alertPlayed = false;
  Serial.print("STATE ");
  Serial.println(stateName(state));
}

void pseudoLaserOff() {
  analogWrite(PIN_PSEUDO_LASER, 0);
}

void centerServos() {
  panAngle = PAN_CENTER;
  panServo.write(PAN_CENTER);
  tiltServo.write(TILT_CENTER);
}

void stopAll() {
  pseudoLaserOff();
  noTone(PIN_BUZZER);
  centerServos();
  setState(SAFE_MODE);
  Serial.println("STOP_ALL: outputs off, servos centered");
}

void lockOnLedPattern() {
  for (int i = 0; i < 2; i++) {
    analogWrite(PIN_PSEUDO_LASER, 35);
    delay(180);
    pseudoLaserOff();
    delay(180);
  }
  for (int i = 0; i < 3; i++) {
    analogWrite(PIN_PSEUDO_LASER, 65);
    tone(PIN_BUZZER, 2000, 80);
    delay(100);
    pseudoLaserOff();
    delay(100);
  }
  analogWrite(PIN_PSEUDO_LASER, PSEUDO_LASER_MAX_PWM);
  delay(900);
  pseudoLaserOff();
}

void setup() {
  Serial.begin(115200);
  panServo.attach(PIN_SERVO_PAN);
  tiltServo.attach(PIN_SERVO_TILT);
  pinMode(PIN_PSEUDO_LASER, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_PIR_BUTTON, INPUT_PULLUP);
  pinMode(PIN_DOOR_BUTTON, INPUT_PULLUP);
  pinMode(PIN_STOP_BUTTON, INPUT_PULLUP);
  pseudoLaserOff();
  centerServos();
  setState(SCANNING);
  Serial.println("Sentinel Room Arduino Uno mock node ready");
}

void loop() {
  bool stopPressed = digitalRead(PIN_STOP_BUTTON) == LOW;
  bool pirPressed = digitalRead(PIN_PIR_BUTTON) == LOW;
  bool doorPressed = digitalRead(PIN_DOOR_BUTTON) == LOW;

  if (stopPressed) {
    stopAll();
    delay(250);
    return;
  }

  if (state == SCANNING && millis() - lastScanMs > 35) {
    lastScanMs = millis();
    panAngle += scanDirection;
    if (panAngle >= PAN_MAX || panAngle <= PAN_MIN) scanDirection *= -1;
    panServo.write(constrain(panAngle, PAN_MIN, PAN_MAX));
  }

  if ((pirPressed || doorPressed) && (state == IDLE || state == SCANNING)) {
    setState(MOTION_WAKE);
    centerServos();
    tone(PIN_BUZZER, 1800, 90);
    Serial.println("Unknown presence sensor wake");
  }

  if (state == MOTION_WAKE && millis() - stateStartedMs > 900) {
    setState(CINEMATIC_ALERT);
  }

  if (state == CINEMATIC_ALERT) {
    if (!alertPlayed) {
      alertPlayed = true;
      Serial.println("SUBJECT ACQUIRED demo text only");
      lockOnLedPattern();
    }
    if (millis() - stateStartedMs > 5000) {
      pseudoLaserOff();
      noTone(PIN_BUZZER);
      setState(SCANNING);
    }
  }

  if (millis() - lastSerialMs > 1000) {
    lastSerialMs = millis();
    Serial.print("{\"state\":\"");
    Serial.print(stateName(state));
    Serial.print("\",\"pir\":");
    Serial.print(pirPressed ? 1 : 0);
    Serial.print(",\"door\":");
    Serial.print(doorPressed ? 1 : 0);
    Serial.println("}");
  }
}
