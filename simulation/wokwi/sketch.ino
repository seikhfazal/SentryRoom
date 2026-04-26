#include <ESP32Servo.h>

Servo panServo;
Servo tiltServo;

const int PIN_PAN = 18;
const int PIN_TILT = 19;
const int PIN_LED = 23;
const int PIN_BUZZER = 5;
const int PIN_RGB_R = 25;
const int PIN_RGB_G = 26;
const int PIN_RGB_B = 27;
const int PIN_PIR_BUTTON = 32;
const int PIN_DOOR_BUTTON = 33;
const int PIN_IR_BUTTON = 34;
const int PIN_STOP_BUTTON = 4;
const int PIN_TRIG = 12;
const int PIN_ECHO = 14;

const int PAN_MIN = 20;
const int PAN_MAX = 160;
const int PAN_CENTER = 90;
const int TILT_CENTER = 80;
const int PSEUDO_LASER_MAX_PWM = 80;

enum State { IDLE, SCANNING, MOTION_WAKE, CINEMATIC_ALERT, SAFE_MODE };
State state = IDLE;
unsigned long stateStartedMs = 0;
unsigned long lastScanStepMs = 0;
unsigned long lastSerialMs = 0;
int panAngle = PAN_CENTER;
int scanDirection = 1;
bool alertPlayed = false;

const char* stateName(State value) {
  switch (value) {
    case IDLE: return "IDLE";
    case SCANNING: return "SCANNING";
    case MOTION_WAKE: return "MOTION_WAKE";
    case CINEMATIC_ALERT: return "CINEMATIC_ALERT";
    case SAFE_MODE: return "SAFE_MODE";
  }
  return "UNKNOWN";
}

void setRgb(int r, int g, int b) {
  analogWrite(PIN_RGB_R, r);
  analogWrite(PIN_RGB_G, g);
  analogWrite(PIN_RGB_B, b);
}

void pseudoLaserOff() {
  analogWrite(PIN_LED, 0);
}

void setPseudoLaser(int pwm) {
  analogWrite(PIN_LED, min(pwm, PSEUDO_LASER_MAX_PWM));
}

void setState(State next) {
  state = next;
  stateStartedMs = millis();
  alertPlayed = false;
  Serial.print("STATE ");
  Serial.println(stateName(state));
}

void stopAll() {
  pseudoLaserOff();
  noTone(PIN_BUZZER);
  setRgb(0, 0, 20);
  panServo.write(PAN_CENTER);
  tiltServo.write(TILT_CENTER);
  panAngle = PAN_CENTER;
  setState(SAFE_MODE);
  Serial.println("STOP_ALL: outputs off, servos centered");
}

void lockOnLedPattern() {
  for (int i = 0; i < 2; i++) {
    setPseudoLaser(40);
    delay(180);
    pseudoLaserOff();
    delay(180);
  }
  for (int i = 0; i < 3; i++) {
    setPseudoLaser(70);
    tone(PIN_BUZZER, 2000, 75);
    delay(90);
    pseudoLaserOff();
    delay(90);
  }
  setPseudoLaser(PSEUDO_LASER_MAX_PWM);
  delay(900);
  pseudoLaserOff();
}

long ultrasonicCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duration = pulseIn(PIN_ECHO, HIGH, 30000);
  if (duration == 0) return -1;
  return duration / 58;
}

void setup() {
  Serial.begin(115200);
  panServo.attach(PIN_PAN);
  tiltServo.attach(PIN_TILT);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_RGB_R, OUTPUT);
  pinMode(PIN_RGB_G, OUTPUT);
  pinMode(PIN_RGB_B, OUTPUT);
  pinMode(PIN_PIR_BUTTON, INPUT_PULLUP);
  pinMode(PIN_DOOR_BUTTON, INPUT_PULLUP);
  pinMode(PIN_IR_BUTTON, INPUT_PULLUP);
  pinMode(PIN_STOP_BUTTON, INPUT_PULLUP);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pseudoLaserOff();
  setRgb(0, 0, 30);
  panServo.write(PAN_CENTER);
  tiltServo.write(TILT_CENTER);
  setState(SCANNING);
  Serial.println("Sentinel Room Wokwi mock online");
}

void loop() {
  bool stopPressed = digitalRead(PIN_STOP_BUTTON) == LOW;
  bool pirPressed = digitalRead(PIN_PIR_BUTTON) == LOW;
  bool doorPressed = digitalRead(PIN_DOOR_BUTTON) == LOW;
  bool irPressed = digitalRead(PIN_IR_BUTTON) == LOW;
  long cm = ultrasonicCm();
  bool proximity = cm > 0 && cm < 60;

  if (stopPressed) {
    stopAll();
    delay(250);
    return;
  }

  if (state == SCANNING && millis() - lastScanStepMs > 35) {
    lastScanStepMs = millis();
    panAngle += scanDirection;
    if (panAngle >= PAN_MAX || panAngle <= PAN_MIN) scanDirection *= -1;
    panServo.write(panAngle);
  }

  if ((pirPressed || doorPressed || irPressed || proximity) && (state == IDLE || state == SCANNING)) {
    setState(MOTION_WAKE);
    setRgb(100, 70, 0);
    tone(PIN_BUZZER, 1800, 90);
    panServo.write(PAN_CENTER);
    tiltServo.write(TILT_CENTER);
    Serial.println("Unknown presence sensor wake");
  }

  if (state == MOTION_WAKE && millis() - stateStartedMs > 800) {
    setState(CINEMATIC_ALERT);
  }

  if (state == CINEMATIC_ALERT) {
    setRgb(120, 0, 0);
    if (!alertPlayed) {
      alertPlayed = true;
      Serial.println("SUBJECT ACQUIRED demo text only");
      lockOnLedPattern();
    }
    if (millis() - stateStartedMs > 5000) {
      pseudoLaserOff();
      noTone(PIN_BUZZER);
      setRgb(0, 0, 30);
      setState(SCANNING);
      Serial.println("Alert timeout, returning to scan");
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
    Serial.print(",\"ir_beam\":");
    Serial.print(irPressed ? 1 : 0);
    Serial.print(",\"cm\":");
    Serial.print(cm);
    Serial.println("}");
  }
}
