#!/bin/bash

if [ -x "$NVM_BIN" ] ; then
    echo "NVM installed, moving on..."
else
    echo -ne "NVM not found, attempting install... "
    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
    echo "done."
fi

cd ..

echo -ne "Installing node.js version "$NODE_VERSION
nvm install $NODE_VERSION
nvm use $NODE_VERSION
echo "done."

echo -ne "Installing ember-cli version "$EMBER_VERSION
npm i --silent -g ember-cli@$EMBER_VERSION
echo "done."
echo -ne "Installing bower..."
npm i --silent -g bower
echo "done."

