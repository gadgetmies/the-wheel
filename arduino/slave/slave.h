#ifndef SLAVE_H
#define SLAVE_H

static const byte POT_CHANGE_THRESHOLD = 5;

enum Board {
  BOARD_L2,
  BOARD_L1,
  BOARD_M,
  BOARD_R1,
  BOARD_R2
};

#define NO_BOARD (0)
#define BOARD_FEATURE_ENCODER _BV(0)
#define BOARD_FEATURE_BUTTON _BV(1)
#define BOARD_FEATURE_POT _BV(2)
#define BOARD_FEATURE_TOUCH _BV(3)
#define BOARD_FEATURE_PADS _BV(4)
#define BOARD_FEATURE_LED _BV(5)

static const byte ENCODER_PINS[5][2] = {
  {ENCL2A, ENCL2B},
  {ENCL1A, ENCL1B},
  {ENC1A, ENC1B},
  {ENCR1A, ENCR1B},
  {ENCR2A, ENCR2B}
};

static const byte BUTTON_PINS[] = {
  NOT_POSSIBLE,
  SWL,
  SW1,
  SWR
};

static const byte POT_PINS[] = {
  NOT_POSSIBLE,
  POTL,
  POT1,
  POTR
};

static const byte TOUCH_PINS[] = {
  NOT_POSSIBLE,
  ENCL2B,
  TOUCH,
  ENCR2B
};

static const byte PAD_PINS[][4] {
  {},
  {ENCL2A, ENCL1B, ENCL1A, SWL},
  {TOUCH, ENC1B, ENC1A, SW1},
  {ENCR1B, ENCR1A, ENCR2A, SWR}
};

#define HAS_FEATURE(BOARD, feature) (BOARD_FEATURES_##BOARD & feature)
#define HAS_PADS(BOARD) (HAS_FEATURE(BOARD, BOARD_FEATURE_PADS))
#define HAS_POT(BOARD) (HAS_FEATURE(BOARD, BOARD_FEATURE_POT))
#define HAS_BUTTON(BOARD) (HAS_FEATURE(BOARD, BOARD_FEATURE_BUTTON))
#define HAS_TOUCH(BOARD) (HAS_FEATURE(BOARD, BOARD_FEATURE_TOUCH))

#define ANY_BOARD_HAS_FEATURE(FEATURE) (HAS_FEATURE(L2, FEATURE) | HAS_FEATURE(L1, FEATURE) | HAS_FEATURE(M, FEATURE) | HAS_FEATURE(R1, FEATURE) | HAS_FEATURE(R2, FEATURE))

#endif
