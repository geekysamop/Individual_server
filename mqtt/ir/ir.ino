int irSensor = 9;
int led = 13;
int previousState = -1;

void setup() {
  Serial.begin(9600);
  pinMode(irSensor, INPUT);
  pinMode(led, OUTPUT);
}

void loop() {
  int readSensor = digitalRead(irSensor);
  if (readSensor == 0) {
    digitalWrite(led, HIGH);
    if (previousState != readSensor) {
      Serial.println("Motion detected");
      previousState = readSensor;
      delay(500);
    }
  } else {
    digitalWrite(led, LOW);
    if (previousState != readSensor) {
      Serial.println("Motion ended");
      previousState = readSensor;
      delay(500);
    }
  }
}
