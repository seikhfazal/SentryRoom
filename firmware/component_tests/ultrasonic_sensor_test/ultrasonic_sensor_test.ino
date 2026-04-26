const int PIN_ULTRASONIC_TRIG = 12;
const int PIN_ULTRASONIC_ECHO = 14;

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

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room ultrasonic sensor test");
  Serial.println("If your HC-SR04 echo is 5V, use level shifting before GPIO14.");
  pinMode(PIN_ULTRASONIC_TRIG, OUTPUT);
  pinMode(PIN_ULTRASONIC_ECHO, INPUT);
}

void loop() {
  long cm = readDistanceCm();
  if (cm < 0) {
    Serial.println("distance_cm=timeout");
  } else {
    Serial.print("distance_cm=");
    Serial.println(cm);
  }
  delay(500);
}
