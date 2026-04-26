const int PIN_RGB_R = 25;
const int PIN_RGB_G = 26;
const int PIN_RGB_B = 27;
const int PIN_STOP_BUTTON = 4;

bool stopPressed() {
  return digitalRead(PIN_STOP_BUTTON) == LOW;
}

void setRgb(byte r, byte g, byte b) {
  analogWrite(PIN_RGB_R, r);
  analogWrite(PIN_RGB_G, g);
  analogWrite(PIN_RGB_B, b);
}

void stopAll() {
  setRgb(0, 0, 0);
  Serial.println("STOP_ALL: RGB LED off");
}

void showColor(const char* name, byte r, byte g, byte b) {
  if (stopPressed()) {
    stopAll();
    delay(250);
    return;
  }
  Serial.println(name);
  setRgb(r, g, b);
  delay(700);
}

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room RGB LED test");
  pinMode(PIN_STOP_BUTTON, INPUT_PULLUP);
  pinMode(PIN_RGB_R, OUTPUT);
  pinMode(PIN_RGB_G, OUTPUT);
  pinMode(PIN_RGB_B, OUTPUT);
  stopAll();
}

void loop() {
  showColor("red", 120, 0, 0);
  showColor("green", 0, 120, 0);
  showColor("blue", 0, 0, 120);
  showColor("amber", 90, 50, 0);
  showColor("low blue idle", 0, 0, 20);
  stopAll();
  delay(800);
}
