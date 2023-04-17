#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>

#include "arduino_secrets.h"
int irSensor = 9;
int led = 12;
int previousState = -1;

char ssid[] = SECRET_SSID;    // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)



WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

const char broker[] = "broker.hivemq.com";
int        port     = 1883;
const char topic[]  = "/sensorData";



// int count = 0;

void setup() {
  pinMode(irSensor, INPUT);
  pinMode(led, OUTPUT);
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // attempt to connect to WiFi network:
  Serial.print("Attempting to connect to WPA SSID: ");
  Serial.println(ssid);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    // failed, retry
    Serial.print(".");
    delay(5000);
  }

  Serial.println("You're connected to the network");
  Serial.println();



  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1);
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();
}

void loop() {
  mqttClient.poll();
  int readSensor = digitalRead(irSensor);

  if (readSensor == 0) {
    digitalWrite(led, HIGH);
    if (previousState != readSensor) {
      Serial.println("Motion detected");
      mqttClient.beginMessage(topic);
      mqttClient.print("Car Parked");
      mqttClient.endMessage();      
      previousState = readSensor;
      delay(500);
    }
  } else {
    digitalWrite(led, LOW);
    if (previousState != readSensor) {
      Serial.println("Motion ended");
      mqttClient.beginMessage(topic);
      mqttClient.print("Car not parked");
      mqttClient.endMessage(); 
      previousState = readSensor;
      delay(500);
    }
  }
}
