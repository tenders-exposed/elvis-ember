#!/bin/bash

NODE_VERSION=5.3.0
EMBER_VERSION=2.4.2
NVM_BIN=$(which nvm)
SCRIPT_PATH=`pwd`

source $SCRIPT_PATH/1-prepare.sh
source $SCRIPT_PATH/2-build.sh
source $SCRIPT_PATH/3-finish.sh
