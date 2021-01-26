window.env = require(`${__dirname}/core/settings`);
window.Auth = require(`${__dirname}/core/auth`);
window.Sub = require(`${__dirname}/core/subs`);

const TorrentStreamer = require(`${__dirname}/core/streamer`);
window.Streamer = new TorrentStreamer();

const IngestDb = require(`${__dirname}/core/ingest`);
window.Ingest = new IngestDb();

const CastDNLA = require(`${__dirname}/core/dlna`)
window.Cast = new CastDNLA();

