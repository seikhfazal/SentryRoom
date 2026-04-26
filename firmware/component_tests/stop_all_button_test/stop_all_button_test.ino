const int PIN_STOP_BUTTON = 4;
const int PIN_PSEUDO_LASER_LED = 23;
const int PIN_BUZZER = 5;
const int PIN_RGB_R = 25;
const int PIN_RGB_G = 26;
const int PIN_RGB_B = 27;

int lastState = -1;

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
}

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room Stop All button test");
  Serial.println("Pressing Stop All should connect GPIO4 to GND.");
  pinMode(PIN_STOP_BUTTON, INPUT_PULLUP);
  pinMode(PIN_PSEUDO_LASER_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_RGB_R, OUTPUT);
  pinMode(PIN_RGB_G, OUTPUT);
  pinMode(PIN_RGB_B, OUTPUT);
  stopAll();
}

void loop() {
  int raw = digitalRead(PIN_STOP_BUTTON);
  if (raw != lastState) {
    lastState = raw;
    Serial.print("Stop button raw=");
    Serial.print(raw);
    Serial.print(" pressed=");
    Serial.println(raw == LOW ? "YES" : "NO");
  }

  if (raw == LOW) {
    stopAll();
  } else {
    setRgb(0, 0, 30);
    analogWrite(PIN_PSEUDO_LASER_LED, 20);
    tone(PIN_BUZZER, 1600, 40);
    delay(500);
  }
}
