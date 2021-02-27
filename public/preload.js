/***
 * This script will always have access to node APIs no matter whether node integration is turned on or off.
 * The value should be the absolute file path to the script. When node integration is turned off, the preload script can
 * reintroduce Node global symbols back to the global scope.
 * https://www.electronjs.org/docs/api/browser-window
 */

// Bridge
const Key = require(`./core/key`);
const DLNA = require(`./core/dlna`);
const HLS = require(`./core/hls`);
const Torrent = require(`./core/torrent`);
const Broker = require(`./core/broker`);
const Subs = require('./core/subs')

window.bridge = {
    Key: Key,
    Subs: Subs,
    DLNA: new DLNA(),
    HLA: new HLS(),
    Torrent: new Torrent(),
    Broker: new Broker()
}

