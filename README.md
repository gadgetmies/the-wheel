# Interface module for modular controllers

## Purpose
Build physical user interfaces without reinventing The Wheel, i.e. compile
interfaces using ready-made components connected together via I2C.

## Definition

In order to build a complex interface with multiple controls, you need a lot
of I/O ports. You can expand the amount of I/O available by using a larger
microcontroller, but at some point, you will hit a limit and have to look
for other solutions for expanding. While there are separate ADC/DAC modules, 
I/O port expanders, multiplexers etc. you can use, these can be relatively
expensive, yet still somewhat limiting. By using familiar microcontrollers
that are easy to configure, this project aims to make interface building
fast, fun and f... cheap.

The library resembles (AFAICT) the (Adafruit seesaw library)[https://github.com/adafruit/seesaw]
in many ways. The main differences are:
* The modules operate in a I2C multi-master configuration. This removes the need for a polling and separate interrupt lines.
* The modules are connected with FFC/FPC cables reducing the costs of the cables. Also there's no need for crimping terminals.
* This project is based on Arduino bootloaders and microcontrollers used in Arduino boards which should make it relatively easy to approach.
* ATMega microcontrollers are used instead of STM32 used in seesaw. This perhaps cuts the costs, but also reduces the performance making this project less suitable for high performance modules (e.g. large touch sensing controllers)
* **This project is very much work in progress** where as (I suppose) seesaw is ready for production use

## Currently supported components and settings
* Encoders
  * Absolute / Relative
  * Loop around / constrained between values
  * With or without push buttons
* Potentiometers, sliders and other analog readouts
* Single switches and 3x3 button matrices
* AT42QT1010 capacitive touch sensor
* Sparkfun 2x2 button pads with SMT LED
* SK6812 / WS2812 serially addressable LEDs
Currently supported components include:

You can connect up to 112 microcontroller 
boards to a single bus to e.g. create a device with up to 672 encoders!
By connecting a USB enabled / WiFi enabled microcontroller to the I2C 
bus you can create an UI for all kinds of devices such as musical instruments,
DJ controllers, home automation control panels, etc.

The PCBs are connected using FFC cables making building, reusing
reconfiguring and debugging the parts easy while at the same time
keeping the BOM cost low.

You can find a proof of concept programming jig / bed of nails tester
for the microcontroller board here: https://a360.co/2ylXmQ3

## Configurator

There is a web app for configuring the controllers in the 
controller-configurator folder. You can start it by running:
```
yarn
yarn start
```

You need to have node and yarn installed in order to run the 
configurator locally. You can also use the online version at:
https://gadgetmies.github.com/encoder/

## Project status
* If you would like to use the designs and the code in your project, please add a issue to this repository
  so that I can check whether the needed features have been implemented.
* There have been multiple iterations of the PCBs and not all software has been updated to work on the
  latest PCBs. The current implementation uses the PCB_VERSION constant with value 3 in the code.
  * Features not updated currently:
    * Touch
    * Pads
    * Potentiometers
    * Button matrices (?)
