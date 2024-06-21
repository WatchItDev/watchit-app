/***
 * This script will always have access to node APIs no matter whether node integration is turned on or off.
 * The value should be the absolute file path to the script. When node integration is turned off, the preload script can
 * reintroduce Node global symbols back to the global scope.
 * https://www.electronjs.org/docs/api/browser-window
 */

// Bridge
import BrokerClass from "./broker";
import DBClass from "./db";

export const Broker = BrokerClass()
export const DB = DBClass()

global.bridge |= { DB, Broker }
export default global.bridge