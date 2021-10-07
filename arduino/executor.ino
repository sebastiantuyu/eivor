void setup() {
  // connect to serial
  Serial.begin(9600);
}
 
void loop() {
 
  // read value from analog pin
  int sensorValue = analogRead(A0);
  
  // get the high and low byte from value
  byte high = highByte(sensorValue);
  byte low = lowByte(sensorValue);
 
  // write the high and low byte to serial
  Serial.write(high);
  Serial.write(low);
 
}
