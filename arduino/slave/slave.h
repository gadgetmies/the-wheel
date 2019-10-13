#ifndef SLAVE_H
#define SLAVE_H

static const byte POT_CHANGE_THRESHOLD = 5;

enum Board {
  BOARD_L2,
  BOARD_L1,
#if PCB_VERSION == 3
  BOARD_M1,
  BOARD_M2,
#else
  BOARD_M,
#endif
  BOARD_R1,
  BOARD_R2
};

enum EncoderType {
  ENCODER_TYPE_RELATIVE,
  ENCODER_TYPE_ABSOLUTE
};

#define NO_BOARD (0)
#define BOARD_FEATURE_ENCODER _BV(0)
#define BOARD_FEATURE_BUTTON _BV(1)
#define BOARD_FEATURE_POT _BV(2)
#define BOARD_FEATURE_TOUCH _BV(3)
#define BOARD_FEATURE_PADS _BV(4)
#define BOARD_FEATURE_LED _BV(5)

static const byte ENCODER_PINS[BOARD_COUNT][2] = {
  {ENCL2A, ENCL2B},
  {ENCL1A, ENCL1B},
#if PCB_VERSION == 3
  {ENCM1A, ENCM1B},
  {ENCM2A, ENCM2B},
#else
  {ENC1A, ENC1B},
#endif
  {ENCR1A, ENCR1B},
  {ENCR2A, ENCR2B}
};

#if PCB_VERSION == 3
static const byte BUTTON_PINS[] = {
  SWL,
  SWL,
  SWM,
  SWM,
  SWR,
  SWR
};
#else
static const byte BUTTON_PINS[] = {
  NOT_POSSIBLE,
  SWL,
  SWM,
  SWR
};
#endif

#if PCB_VERSION != 3
static const byte POT_PINS[] = {
  NOT_POSSIBLE,
  POTL,
  POTM,
  POTR
};
#endif

#if PCB_VERSION != 3
static const byte TOUCH_PINS[] = {
  NOT_POSSIBLE,
  ENCL2B,
  TOUCH,
  ENCR2B
};
#endif

#if PCB_VERSION != 3
static const byte PAD_PINS[][4] {
  {},
  {ENCL2A, ENCL1B, ENCL1A, SWL},
  {TOUCH, ENC1B, ENC1A, SWM}, // TODO: check version 3
  {ENCR1B, ENCR1A, ENCR2A, SWR}
};
#endif

#define HAS_FEATURE(BOARD, feature) (BOARD_FEATURES_##BOARD & feature)
#define HAS_PADS(BOARD) (HAS_FEATURE(BOARD, BOARD_FEATURE_PADS))
#define HAS_POT(BOARD) (HAS_FEATURE(BOARD, BOARD_FEATURE_POT))
#define HAS_BUTTON(BOARD) (HAS_FEATURE(BOARD, BOARD_FEATURE_BUTTON))
#define HAS_TOUCH(BOARD) (HAS_FEATURE(BOARD, BOARD_FEATURE_TOUCH))

#define ANY_BOARD_HAS_FEATURE(FEATURE) (HAS_FEATURE(L2, FEATURE) | HAS_FEATURE(L1, FEATURE) | HAS_FEATURE(M, FEATURE) | HAS_FEATURE(R1, FEATURE) | HAS_FEATURE(R2, FEATURE))
struct ButtonPairStates {
  bool firstButtonState;
  bool secondButtonState;
};

#endif
