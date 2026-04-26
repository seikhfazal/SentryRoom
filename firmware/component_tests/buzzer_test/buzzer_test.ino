const int PIN_BUZZER = 5;
const int PIN_STOP_BUTTON = 4;

bool stopPressed() {
  return digitalRead(PIN_STOP_BUTTON) == LOW;
}

void stopAll() {
  noTone(PIN_BUZZER);
  digitalWrite(PIN_BUZZER, LOW);
  Serial.println("STOP_ALL: buzzer off");
}

void chirp(int frequency, int durationMs) {
  if (stopPressed()) {
    stopAll();
    delay(250);
    return;
  }
  tone(PIN_BUZZER, frequency, durationMs);
  delay(durationMs + 40);
  noTone(PIN_BUZZER);
}

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room buzzer test");
  pinMode(PIN_STOP_BUTTON, INPUT_PULLUP);
  pinMode(PIN_BUZZER, OUTPUT);
  stopAll();
}

void loop() {
  Serial.println("short beep");
  chirp(1800, 90);
  delay(500);

  Serial.println("alert pattern");
  for (int i = 0; i < 4; i++) {
    chirp(2200, 80);
    delay(60);
  }

  stopAll();
  delay(1500);
}
