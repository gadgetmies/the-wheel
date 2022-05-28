#pragma once

#include "features.h"
#include "types.h"

#define BOARD_FEATURES_L1 (BOARD_FEATURE_ENCODER | BOARD_FEATURE_LED)
#define BOARD_FEATURES_L2 (NO_FEATURES)
#define BOARD_FEATURES_M1 (NO_FEATURES)
#define BOARD_FEATURES_M2 (NO_FEATURES)
#define BOARD_FEATURES_R1 (NO_FEATURES)
#define BOARD_FEATURES_R2 (NO_FEATURES)
  
static const byte BOARD_FEATURES[] = {
  BOARD_FEATURES_L1,
  BOARD_FEATURES_L2,
  BOARD_FEATURES_M1,
  BOARD_FEATURES_M2,
  BOARD_FEATURES_R1,
  BOARD_FEATURES_R2,
};

static const byte LED_COUNTS[] = {
13,
0,
0,
0,
0,
0
};

static const int LED_COUNT_L = LED_COUNTS[BOARD_L1] + LED_COUNTS[BOARD_L2];
static const int LED_COUNT_M = LED_COUNTS[BOARD_M1] + LED_COUNTS[BOARD_M2];
static const int LED_COUNT_R = LED_COUNTS[BOARD_R1] + LED_COUNTS[BOARD_R2];


static const byte ENCODER_TYPES[] = {
ENCODER_TYPE_RELATIVE,
ENCODER_TYPE_RELATIVE,
ENCODER_TYPE_RELATIVE,
ENCODER_TYPE_RELATIVE,
ENCODER_TYPE_RELATIVE,
ENCODER_TYPE_RELATIVE
};

static const EncoderDirection ENCODER_DIRECTIONS[] = {
ENCODE_DIRECTION_CW,
ENCODE_DIRECTION_CW,
ENCODE_DIRECTION_CW,
ENCODE_DIRECTION_CW,
ENCODE_DIRECTION_CW,
ENCODE_DIRECTION_CW
};

static const byte ENCODER_POSITION_LIMITS[] = {
0, 255,
0,0,
0,0,
0,0,
0,0,
0,0
};

static const bool ENCODER_LOOP[] {
false,
false,
false,
false,
false,
false
};

#include "feature_validation.h"

// This for some reason triggers constant changes on input 0
//#define INTERRUPT_DEBUG
//#define USART_DEBUG_ENABLED // Disable some LEDs if you enable this. Otherwise you will run out of memory!
