#include <ESP32Servo.h>

const int PIN_SERVO_PAN = 18;
const int PIN_SERVO_TILT = 19;
const int PIN_PSEUDO_LASER_LED = 23;
const int PIN_BUZZER = 5;
const int PIN_RGB_R = 25;
const int PIN_RGB_G = 26;
const int PIN_RGB_B = 27;
const int PIN_PIR = 32;
const int PIN_DOOR = 33;
const int PIN_IR_BEAM = 34;
const int PIN_STOP_BUTTON = 4;
const int PIN_ULTRASONIC_TRIG = 12;
const int PIN_ULTRASONIC_ECHO = 14;

const int PAN_CENTER = 90;
const int TILT_CENTER = 80;
const int PSEUDO_LASER_MAX_PWM = 80;

Servo panServo;
Servo tiltServo;

bool stopPressed() {
  return digitalRead(PIN_STOP_BUTTON) == LOW;
}

void setRgb(byte r, byte g, byte b) {
  analogWrite(PIN_RGB_R, r);
  analogWrite(PIN_RGB_G, g);
  analogWrite(PIN_RGB_B, b);
}

void stopAll() {
  analogWrite(PIN_PSEUDO_LASER_LED, 0);
  noTone(PIN_BUZZER);
  digitalWrite(PIN_BUZZER, LOW);
  setRgb(0, 0, 0);
  panServo.write(PAN_CENTER);
  tiltServo.write(TILT_CENTER);
  Serial.println("STOP_ALL: outputs off, servos centered");
}

long readDistanceCm() {
  digitalWrite(PIN_ULTRASONIC_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_ULTRASONIC_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_ULTRASONIC_TRIG, LOW);
  long duration = pulseIn(PIN_ULTRASONIC_ECHO, HIGH, 30000);
  if (duration == 0) return -1;
  return duration / 58;
}

void printSensors() {
  Serial.print("pir=");
  Serial.print(digitalRead(PIN_PIR));
  Serial.print(" door=");
  Serial.print(digitalRead(PIN_DOOR));
  Serial.print(" ir=");
  Serial.print(digitalRead(PIN_IR_BEAM));
  Serial.print(" ultrasonic_cm=");
  Serial.println(readDistanceCm());
}

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room full IO smoke test");
  Serial.println("Use only a normal red LED with a resistor on GPIO23.");

  pinMode(PIN_STOP_BUTTON, INPUT_PULLUP);
  pinMode(PIN_PSEUDO_LASER_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_RGB_R, OUTPUT);
  pinMode(PIN_RGB_G, OUTPUT);
  pinMode(PIN_RGB_B, OUTPUT);
  pinMode(PIN_PIR, INPUT);
  pinMode(PIN_DOOR, INPUT_PULLUP);
  pinMode(PIN_IR_BEAM, INPUT);
  pinMode(PIN_ULTRASONIC_TRIG, OUTPUT);
  pinMode(PIN_ULTRASONIC_ECHO, INPUT);

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

  setRgb(0, 0, 35);
  analogWrite(PIN_PSEUDO_LASER_LED, min(35, PSEUDO_LASER_MAX_PWM));
  tone(PIN_BUZZER, 1800, 60);
  panServo.write(75);
  tiltServo.write(TILT_CENTER);
  printSensors();
  delay(650);

  if (stopPressed()) return;
  analogWrite(PIN_PSEUDO_LASER_LED, 0);
  setRgb(0, 35, 15);
  panServo.write(105);
  printSensors();
  delay(650);

  stopAll();
  delay(1200);
}
