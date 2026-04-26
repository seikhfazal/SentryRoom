const int PIN_DOOR = 33;
const int DOOR_OPEN_HIGH = 1;

int lastRaw = -1;

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("Sentinel Room door reed/button test");
  Serial.println("Default wiring uses INPUT_PULLUP; high is interpreted as door open.");
  pinMode(PIN_DOOR, INPUT_PULLUP);
}

void loop() {
  int raw = digitalRead(PIN_DOOR);
  bool open = raw == (DOOR_OPEN_HIGH ? HIGH : LOW);
  if (raw != lastRaw) {
    lastRaw = raw;
    Serial.print("Door raw=");
    Serial.print(raw);
    Serial.print(" open=");
    Serial.println(open ? "YES" : "NO");
  }
  delay(100);
}
