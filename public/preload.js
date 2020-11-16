window.env = require(__dirname + '/lib/settings/conf');
window.Auth = require(__dirname + '/lib/auth');
window.Sub = require(__dirname + '/lib/subs');

const TorrentStreamer = require(__dirname + '/lib/streamer');
window.Streamer = new TorrentStreamer();

const IngestDb = require(__dirname + '/lib/ingest');
window.Ingest = new IngestDb();

const CastDnla = require(__dirname + '/lib/dlna')
window.Cast = new CastDnla();

