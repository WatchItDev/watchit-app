#!/bin/bash
# Install and settings  for windows
# npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe" --userconfig ./.npmrc
# npm config set script-shell powershell [--global]

# Run to fix warning sandbox
sudo chown root.root node_modules/electron/dist/chrome-sandbox -R
sudo chmod 4755 -R node_modules/electron/dist/chrome-sandbox

# Needed run scripts
electron-builder install-app-deps
npm rebuild ursa-optional
cd node_modules/unzip/node_modules/fstream/ &&  npm i graceful-fs@4.2.4 --save
