#include <Arduino.h>

#include "BluetoothSerial.h"

BluetoothSerial SerialBT;

void setup()
{
  Serial.begin(115200);
  SerialBT.begin("ESP32_Test"); // Name of your device
  Serial.println("Bluetooth ready. Connect to 'ESP32_Test'");
}

void loop()
{
  SerialBT.write((uint8_t *)"Test\n", 6);
  delay(1000); // Send "Test" every second
}
