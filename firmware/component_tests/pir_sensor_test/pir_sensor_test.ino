const int PIN_PIR = 32;
const int PIR_ACTIVE_HIGH = 1;

int lastRaw = -1;

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room PIR sensor test");
  pinMode(PIN_PIR, INPUT);
}

void loop() {
  int raw = digitalRead(PIN_PIR);
  bool motion = raw == (PIR_ACTIVE_HIGH ? HIGH : LOW);
  if (raw != lastRaw) {
    lastRaw = raw;
    Serial.print("PIR raw=");
    Serial.print(raw);
    Serial.print(" motion=");
    Serial.println(motion ? "YES" : "NO");
  }
  delay(100);
}
