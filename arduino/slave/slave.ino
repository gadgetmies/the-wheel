#include <stdint.h>

#include "config.h" // these imports need to be in this order because slave.h uses defs in config.h
#include "slave.h"

#ifdef USE_DEBUG_LED
#include <MillisTimer.h>
#endif

#include "feature_validation.h"

void sendChangeMessage(byte input, uint16_t value, ControlType type) {
  Slave.toggleBuiltinLed();
  Slave.sendMessageToMaster(input, value, type);
}

void handleChange(Board board, ControlType type, uint8_t input, uint8_t state) {
  switch (type) {
    // TODO: prevent input collisions on different boards
    case CONTROL_TYPE_POSITION: {
      #ifdef USART_DEBUG_ENABLED
        Serial.print("Pos change, board: ");
        Serial.print(board);
        Serial.print(", input: ");
        Serial.print(input);
        Serial.print(", pos: ");
        Serial.println(state);
      #endif
      sendChangeMessage(board, state, type);
      //setLedPosition(board, state);

      break;
    }
    case CONTROL_TYPE_ENCODER: {
      #ifdef USART_DEBUG_ENABLED
        Serial.print("handleEncoderChange, input: ");
        Serial.print(input);
        Serial.print(", state: ");
        Serial.println(state);
      #endif
      sendChangeMessage(board, state, type);
      break;
    }
    case CONTROL_TYPE_BUTTON: {
//      handleButtonChange(boardMatrixIndex * MATRIX_INPUTS * MATRIX_OUTPUTS + MATRIX_INPUTS * output + input, currentState);
//      handleButtonChange(i, (switchStates & switchMask) ? 0 : 1);
//      handleButtonChange(i, pinState);
      sendChangeMessage(board * 20 + input, state, type);
      break;
    }
    default:
      sendChangeMessage(board, state, type);
  }
}

#ifdef USE_DEBUG_LED
void blinkBuiltinLed(MillisTimer &timer __attribute__((unused))) {
  Slave.toggleBuiltinLed();
}
MillisTimer blinkTimer = MillisTimer(1000, blinkBuiltinLed);
#endif

void setup() {
  #ifdef USART_DEBUG_ENABLED
  Serial.begin(115200);
  #endif
  Slave.setup(handleChange);
  #ifdef USE_DEBUG_LED
  blinkTimer.start();
  #endif
}

void loop() {
  Slave.update();

  #ifdef USE_DEBUG_LED
  blinkTimer.run();
  #endif
}
