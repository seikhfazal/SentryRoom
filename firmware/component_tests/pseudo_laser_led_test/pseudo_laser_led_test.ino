const int PIN_PSEUDO_LASER_LED = 23;
const int PIN_STOP_BUTTON = 4;
const int PSEUDO_LASER_MAX_PWM = 80;

bool stopPressed() {
  return digitalRead(PIN_STOP_BUTTON) == LOW;
}

void ledOff() {
  analogWrite(PIN_PSEUDO_LASER_LED, 0);
}

void stopAll() {
  ledOff();
  Serial.println("STOP_ALL: pseudo-laser red LED off");
}

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room pseudo-laser LED test");
  Serial.println("Use only a normal red LED with a resistor. Do not connect a real laser.");
  pinMode(PIN_STOP_BUTTON, INPUT_PULLUP);
  pinMode(PIN_PSEUDO_LASER_LED, OUTPUT);
  stopAll();
}

void loop() {
  for (int pwm = 0; pwm <= PSEUDO_LASER_MAX_PWM; pwm += 5) {
    if (stopPressed()) {
      stopAll();
      delay(250);
      return;
    }
    analogWrite(PIN_PSEUDO_LASER_LED, pwm);
    delay(45);
  }

  delay(200);

  for (int pwm = PSEUDO_LASER_MAX_PWM; pwm >= 0; pwm -= 5) {
    if (stopPressed()) {
      stopAll();
      delay(250);
      return;
    }
    analogWrite(PIN_PSEUDO_LASER_LED, pwm);
    delay(45);
  }

  ledOff();
  delay(800);
}
