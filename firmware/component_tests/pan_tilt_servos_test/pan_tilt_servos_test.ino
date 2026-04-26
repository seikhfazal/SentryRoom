#include <ESP32Servo.h>

const int PIN_SERVO_PAN = 18;
const int PIN_SERVO_TILT = 19;
const int PIN_STOP_BUTTON = 4;

const int PAN_MIN = 20;
const int PAN_MAX = 160;
const int TILT_MIN = 40;
const int TILT_MAX = 120;
const int PAN_CENTER = 90;
const int TILT_CENTER = 80;

Servo panServo;
Servo tiltServo;
int panAngle = PAN_CENTER;
int tiltAngle = TILT_CENTER;

bool stopPressed() {
  return digitalRead(PIN_STOP_BUTTON) == LOW;
}

void writeServos(int pan, int tilt) {
  panAngle = constrain(pan, PAN_MIN, PAN_MAX);
  tiltAngle = constrain(tilt, TILT_MIN, TILT_MAX);
  panServo.write(panAngle);
  tiltServo.write(tiltAngle);
}

void stopAll() {
  writeServos(PAN_CENTER, TILT_CENTER);
  Serial.println("STOP_ALL: servos centered");
}

bool moveSafe(int targetPan, int targetTilt) {
  targetPan = constrain(targetPan, PAN_MIN, PAN_MAX);
  targetTilt = constrain(targetTilt, TILT_MIN, TILT_MAX);
  while (panAngle != targetPan || tiltAngle != targetTilt) {
    if (stopPressed()) {
      stopAll();
      return false;
    }
    if (panAngle < targetPan) panAngle++;
    if (panAngle > targetPan) panAngle--;
    if (tiltAngle < targetTilt) tiltAngle++;
    if (tiltAngle > targetTilt) tiltAngle--;
    panServo.write(panAngle);
    tiltServo.write(tiltAngle);
    delay(15);
  }
  return true;
}

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room pan/tilt servo test");
  pinMode(PIN_STOP_BUTTON, INPUT_PULLUP);
  panServo.setPeriodHertz(50);
  tiltServo.setPeriodHertz(50);
  panServo.attach(PIN_SERVO_PAN, 500, 2400);
  tiltServo.attach(PIN_SERVO_TILT, 500, 2400);
  stopAll();
}

void loop() {
  if (stopPressed()) {
    stopAll();
    delay(250);
    return;
  }

  Serial.println("Sweep left");
  if (!moveSafe(PAN_MIN, TILT_CENTER)) return;
  delay(300);

  Serial.println("Sweep right");
  if (!moveSafe(PAN_MAX, TILT_CENTER)) return;
  delay(300);

  Serial.println("Tilt check");
  if (!moveSafe(PAN_CENTER, TILT_MIN)) return;
  delay(250);
  if (!moveSafe(PAN_CENTER, TILT_MAX)) return;
  delay(250);
  moveSafe(PAN_CENTER, TILT_CENTER);
  delay(1000);
}
