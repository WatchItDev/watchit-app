/***
 * This script will always have access to node APIs no matter whether node integration is turned on or off.
 * The value should be the absolute file path to the script. When node integration is turned off, the preload script can
 * reintroduce Node global symbols back to the global scope.
 * https://www.electronjs.org/docs/api/browser-window
 */

// Bridge
const Broker = require("./broker");
const DB = require("./db");

// Preload bridge
module.exports = global.bridge = {
  Broker: new Broker(),
  DB: new DB(),
};
