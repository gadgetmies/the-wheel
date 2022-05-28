#include <MIDIUSB.h>
#include <Wire.h>
#include <EEPROM.h>
#include <limits.h>

#include "shared.h"

// #define USART_DEBUG_ENABLED // This will slow down MIDI message receiving -> disable on 

volatile byte nextAddress;
volatile byte nextChannel = 0;

const byte CHANNEL_COUNT = 15;
const byte ADDRESS_NOT_FOUND = CHAR_MAX;
volatile byte midiChannelToAddress[CHANNEL_COUNT];
const byte MIDI_CHANNEL_EEPROM_ADDRESS_OFFSET = 1;

const uint8_t SS1Pin = 4;

const byte I2C_RX_LED_PIN = 10;
const byte I2C_TX_LED_PIN = 9;

void setup() {
  nextAddress = EEPROM.read(0);
  nextAddress = nextAddress == 255 ? 0 : nextAddress;

  Serial.begin(115200);
  Wire.begin(MASTER_ADDRESS);

  Serial.println("Reading addresses from EEPROM");
  for (byte i = 0; i < CHANNEL_COUNT; ++i) {
    byte address = EEPROM.read(i+1);
    if (address == 255) break;

    midiChannelToAddress[i] = address;
    nextChannel = findNextAvailableChannel();
    Serial.println(address);
  }

  Wire.onRequest(sendAddress);
  Wire.onReceive(handleControlChange);

  Serial.begin(115200);

  Serial.println("Boot");
  printChannels();

  pinMode(SS1Pin, OUTPUT);
  digitalWrite(SS1Pin, LOW);
  Serial.print("Next address: ");
  Serial.println(nextAddress);

  pinMode(I2C_RX_LED_PIN, OUTPUT);
  digitalWrite(I2C_RX_LED_PIN, HIGH);

  pinMode(I2C_TX_LED_PIN, OUTPUT);
  digitalWrite(I2C_TX_LED_PIN, HIGH);
}

uint8_t loopCounter = 0;
uint8_t slaveAddress = 0;
void loop() {
  delay(100);
  Serial.print(".");
  loopCounter++;
  if (loopCounter % 50 == 0) {
    Serial.println();
  }
  midiEventPacket_t rx = MidiUSB.read();

  if (rx.header != 0) {
    uint8_t slaveAddress = midiChannelToAddress[rx.byte1 & 0xF];
    ControlType type = rx.header == 0x9 || rx.header == 0x8 ? CONTROL_TYPE_BUTTON : CONTROL_TYPE_POSITION;
    MasterToSlaveMessage message = {rx.byte2, type, rx.byte3};
    Wire.beginTransmission(slaveAddress);
    byte data[] = {message.input, (byte)message.type, highByte(message.value), lowByte(message.value)};
    Wire.write(data, MasterToSlaveMessageSize);
    Wire.endTransmission();
    
#ifdef USART_DEBUG_ENABLED
    Serial.println("Got MIDI message:");
    Serial.print("Header: ");
    Serial.println(rx.header);
    Serial.print("Slave:");
    Serial.println(slaveAddress);
    Serial.print("Type:");
    Serial.println(message.type);
    Serial.print("Value");
    Serial.println(message.value);
#endif
  }
}

void printChannels() {
  for (byte i = 0; i < CHANNEL_COUNT; ++i) {
    Serial.print("Restored ");
    Serial.print(midiChannelToAddress[i]);
    Serial.print(" to index ");
    Serial.println(i);
  }
}

inline void togglePin(byte outputPin) {
  digitalWrite(outputPin, !digitalRead(outputPin));
}

inline void toggleRxLed() {
  togglePin(I2C_RX_LED_PIN);
}

inline void toggleTxLed() {
  togglePin(I2C_TX_LED_PIN);
}

void sendAddress() {
  toggleTxLed();
  Wire.write(nextAddress);
  nextAddress++;
  EEPROM.write(0, nextAddress);
  Serial.println("Sent address:");
  Serial.println(nextAddress);
}

SlaveToMasterMessage readMessage() {
  byte address = Wire.read();
  byte input = Wire.read();
  byte type = Wire.read();
  byte valueHighByte = Wire.read();
  byte valueLowByte = Wire.read();

  SlaveToMasterMessage message = {address, input, type, word(valueHighByte, valueLowByte)};
  return message;
}

byte findChannelForAddress(byte address) {
  for (byte i = 0; i < CHANNEL_COUNT; ++i) {
    if (midiChannelToAddress[i] == address) return i;
  }

  return ADDRESS_NOT_FOUND;
}

byte findNextAvailableChannel() {
  nextChannel = (nextChannel + 1) % CHANNEL_COUNT;

  if (findChannelForAddress(nextChannel) == ADDRESS_NOT_FOUND) {
    return nextChannel;
  } else {
    return findNextAvailableChannel;
  }
}

void saveAddressAsNextChannel(byte address) {
  Serial.print("Storing ");
  Serial.print(address);
  Serial.print(" to index ");
  Serial.println(nextChannel);

  midiChannelToAddress[nextChannel] = address;
  EEPROM.write(nextChannel + MIDI_CHANNEL_EEPROM_ADDRESS_OFFSET, address);
  nextChannel = findNextAvailableChannel();
}

void handleControlChange(int bytes) {
  toggleRxLed();
  Serial.print("Received ");
  Serial.print(bytes);
  Serial.println(" bytes");
  
  Serial.println("Received event:");

  SlaveToMasterMessage message = readMessage();
  const uint16_t value = message.value;
  const ControlType type = message.type;
  const uint8_t input = message.input;
  const uint8_t address = message.address;

#ifdef USART_DEBUG_ENABLED
  Serial.print("Address: ");
  Serial.print(address);
  Serial.print(", Control: ");
  Serial.print(input);
  Serial.print(", Type: ");
  Serial.print(type);
  Serial.print(", Position: ");
  Serial.print(CONTROL_TYPE_POSITION);
  Serial.print(", Value: ");
  Serial.println(value);
#endif

  if (type == CONTROL_TYPE_DEBUG) {
    if (value == DEBUG_BOOT) {
      saveAddressAsNextChannel(address); // TODO: slaves do not send their address at boot :facepalm:
    } else if (value == DEBUG_VALUE) {
#ifdef USART_DEBUG_ENABLED
      Serial.print("Got value from slave: ");
      Serial.println();
#endif
    }
  }  

  byte channel = findChannelForAddress(address);
  if (channel == ADDRESS_NOT_FOUND) {
    channel = nextChannel;
    saveAddressAsNextChannel(address);
    Serial.print("Channel for address not found, using:");
    Serial.println(channel);
  }
  
  if (type == CONTROL_TYPE_POSITION) {
#ifdef USART_DEBUG_ENABLED
    Serial.println("Sending CC");
#endif
    // Scale value to 7 bits for MIDI
    controlChange(channel, input, value >> 3);
  } else if (type == CONTROL_TYPE_ENCODER) {
#ifdef USART_DEBUG_ENABLED
    Serial.println("Sending CC");
#endif
    controlChange(channel, input, value == 1 ? 1 : 127);
  } else if (type == CONTROL_TYPE_BUTTON) {
#ifdef USART_DEBUG_ENABLED
    Serial.println("Sending note");
#endif
    if (value == 1) {
      noteOn(channel, input, 127);
    } else {
      noteOff(channel, input, 0);
    }
  }
}

void controlChange(byte channel, byte control, byte value) {
#ifdef USART_DEBUG_ENABLED
  Serial.print("Sending CC: channel: ");
  Serial.print(channel);
  Serial.print(", control: ");
  Serial.print(control);
  Serial.print(", value: ");
  Serial.println(value);
#endif

  midiEventPacket_t event = {0x0B, 0xB0 | channel, control, value};
  MidiUSB.sendMIDI(event);
  MidiUSB.flush();
}

void noteOn(byte channel, byte pitch, byte velocity) {
#ifdef USART_DEBUG_ENABLED
  Serial.print("Sending NoteOn: channel: ");
  Serial.print(channel);
  Serial.print(", pitch: ");
  Serial.print(pitch);
  Serial.print(", velocity: ");
  Serial.println(velocity);
#endif

  midiEventPacket_t noteOn = {0x09, 0x90 | channel, pitch, velocity};
  MidiUSB.sendMIDI(noteOn);
  MidiUSB.flush();
}

void noteOff(byte channel, byte pitch, byte velocity) {
#ifdef USART_DEBUG_ENABLED
  Serial.print("Sending NoteOff: channel: ");
  Serial.print(channel);
  Serial.print(", pitch: ");
  Serial.print(pitch);
  Serial.print(", velocity: ");
  Serial.println(velocity);
#endif

  midiEventPacket_t noteOff = {0x08, 0x80 | channel, pitch, velocity};
  MidiUSB.sendMIDI(noteOff);
  MidiUSB.flush();
}
