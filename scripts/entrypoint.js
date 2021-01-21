const os = require('os');
const isWin = os.type() === 'Windows_NT'
const execPassthru = require('util')

if (isWin) execPassthru('npm i windows-elevate')
const {exec} = require(isWin ? 'windows-elevate' : 'child_process')

execPassthru('npm install go-ipfs@0.6.0', exec)
execPassthru('electron-builder install-app-deps', exec)
execPassthru('npm rebuild ursa-optional', exec)
execPassthru('cd node_modules/unzip/node_modules/fstream/ && npm i graceful-fs@4.2.4 --save', exec)



