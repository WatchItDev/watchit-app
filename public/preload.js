/***
 * his script will always have access to node APIs no matter whether node integration is turned on or off.
 * The value should be the absolute file path to the script. When node integration is turned off, the preload script can
 * reintroduce Node global symbols back to the global scope.
 * https://www.electronjs.org/docs/api/browser-window
 */

// Global windows.env vars
window.env = require(`${__dirname}/core/settings`);
window.Auth = require(`${__dirname}/core/auth`);
window.Sub = require(`${__dirname}/core/subs`);

// Interface to streamer access from windows object
const TorrentStreamer = require(`${__dirname}/core/streamer`);
window.Streamer = new TorrentStreamer();
// Interface to ingest access from windows object
const IngestDb = require(`${__dirname}/core/ingest`);
window.Ingest = new IngestDb();
// Interface to cast DNLA access from windows object
const CastDNLA = require(`${__dirname}/core/dlna`)
window.Cast = new CastDNLA();

