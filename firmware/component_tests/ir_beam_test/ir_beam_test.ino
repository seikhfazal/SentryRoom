const int PIN_IR_BEAM = 34;
const int IR_BEAM_BROKEN_HIGH = 1;

int lastRaw = -1;

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room IR beam test");
  Serial.println("GPIO34 is input-only and has no internal pullup; use the module output or an external resistor.");
  pinMode(PIN_IR_BEAM, INPUT);
}

void loop() {
  int raw = digitalRead(PIN_IR_BEAM);
  bool broken = raw == (IR_BEAM_BROKEN_HIGH ? HIGH : LOW);
  if (raw != lastRaw) {
    lastRaw = raw;
    Serial.print("IR raw=");
    Serial.print(raw);
    Serial.print(" broken=");
    Serial.println(broken ? "YES" : "NO");
  }
  delay(100);
}
