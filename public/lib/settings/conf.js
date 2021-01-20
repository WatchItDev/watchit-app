const os = require('os')
const path = require('path')
const fs = require('fs')

const ROOT_DIR = os.tmpdir();
const ROOT_URI = 'http://ipfs.io/ipfs/';
const ROOT_URI_TORRENT = `${ROOT_URI}`;
const ROOT_STORE = process.env.appPath;
const ROOT_APP = fs.realpathSync(process.cwd());
const ROOT_TMP_FOLDER = path.join(ROOT_DIR, 'wtmp');
const ROOT_PUBLIC = path.join(ROOT_APP, 'public');
const ROOT_DB_FILE = path.join(ROOT_STORE, 'w_alloc', 'wt.db')

module.exports = {
    'READ_TIMEOUT_FILE': 500,
    'ROOT_APP': ROOT_APP,
    'ROOT_URI': ROOT_URI,
    'ROOT_DIR': ROOT_DIR,
    'ROOT_STORE': ROOT_STORE,
    'ROOT_PUBLIC': ROOT_PUBLIC,
    'ROOT_DB_FILE': ROOT_DB_FILE,
    'ROOT_TMP_FOLDER': ROOT_TMP_FOLDER,
    'ROOT_URI_TORRENT': ROOT_URI_TORRENT
};
