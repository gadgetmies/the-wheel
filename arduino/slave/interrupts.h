#pragma once

#include "slave.h"
#include "config.h"

#define TICK_BOARD(BOARD_ID) \
if (HAS_FEATURE(BOARD_ID, BOARD_FEATURE_ENCODER)) {\
  Slave.tickEncoder(BOARD_##BOARD_ID);\
}

// !!NOTE!!: Do not call sendChangeMessage in ISRs
ISR(PCINT0_vect) {
// TODO: where to put interrupter?
#if defined(USART_DEBUG_ENABLED) && defined(INTERRUPT_DEBUG)
  Slave.setInterrupter(0);
#endif

  TICK_BOARD(R2);

#if PCB_VERSION == 3
  TICK_BOARD(M2);
#else
  TICK_BOARD(R1);
#endif
  
#if ANY_BOARD_HAS_FEATURE(BOARD_FEATURE_PADS)
  Slave.updatePadStates();
#endif
}

// !!NOTE!!: Do not call sendChangeMessage in ISRs
ISR(PCINT1_vect) {
// TODO: where to put interrupter?
#if defined(USART_DEBUG_ENABLED) && defined(INTERRUPT_DEBUG)
  Slave.setInterrupter(1);
#endif

#if PCB_VERSION == 3
  TICK_BOARD(L1);

#elif PCB_VERSION == 1
  TICK_BOARD(R2);
  TICK_BOARD(L2);

#else
  TICK_BOARD(M);

#endif

#if ANY_BOARD_HAS_FEATURE(BOARD_FEATURE_PADS)
  Slave.updatePadStates();
#endif

#if ANY_BOARD_HAS_FEATURE(BOARD_FEATURE_BUTTON)
  Slave.updateSwitchStates();
#endif
}

// !!NOTE!!: Do not call sendChangeMessage in ISRs
ISR(PCINT2_vect) {
// TODO: where to put interrupter?
#if defined(USART_DEBUG_ENABLED) && defined(INTERRUPT_DEBUG)
  Slave.setInterrupter(2);
#endif

#if PCB_VERSION == 3
  TICK_BOARD(M1);
  TICK_BOARD(L2);
  TICK_BOARD(R1);
#else
  TICK_BOARD(M);
  TICK_BOARD(L1);
#endif

#if ANY_BOARD_HAS_FEATURE(BOARD_FEATURE_PADS)
  Slave.updatePadStates();
#endif

  TICK_BOARD(L2);

#if ANY_BOARD_HAS_FEATURE(BOARD_FEATURE_BUTTON)
  Slave.updateSwitchStates();
#endif

#if PCB_VERSION != 3 // TODO
#if ANY_BOARD_HAS_FEATURE(BOARD_FEATURE_TOUCH)
  Slave.updateTouchStates();
#endif
#endif
}
