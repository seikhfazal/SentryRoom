#include "buzzer_control.h"
#include "pins.h"

void buzzerSetup() {
  pinMode(PIN_BUZZER, OUTPUT);
  buzzerOff();
}

void beepShort() {
  tone(PIN_BUZZER, 1800, 90);
  delay(110);
}

void alertBeeps() {
  for (int i = 0; i < 4; i++) {
    tone(PIN_BUZZER, 2200, 80);
    delay(140);
  }
}

void buzzerOff() {
  noTone(PIN_BUZZER);
  digitalWrite(PIN_BUZZER, LOW);
}
