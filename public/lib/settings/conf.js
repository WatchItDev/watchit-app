const os = require('os')
const path = require('path')
const fs = require('fs')

const ROOT_DIR = os.tmpdir();
const READ_TIMEOUT_FILE = 500
const ROOT_URI = 'https://vps1.phillm.netipfs/';
const ROOT_URI_TORRENT = `${ROOT_URI}`;
const ROOT_STORE = process.env.appPath;
const ROOT_APP = fs.realpathSync(process.cwd());
const ROOT_TMP_FOLDER = path.join(ROOT_DIR, 'wtmp');
const ROOT_PUBLIC = path.join(ROOT_APP, 'public');
const ROOT_RUNNING_DB = path.join(ROOT_STORE, 'w_alloc')
const ROOT_DB_DIR = path.join(ROOT_RUNNING_DB, 'linvo')
const ROOT_ORBIT_DIR = path.join(ROOT_RUNNING_DB, 'orbit')

module.exports = {
    ROOT_APP,
    ROOT_URI,
    ROOT_DIR,
    ROOT_STORE,
    ROOT_PUBLIC,
    ROOT_DB_DIR,
    ROOT_ORBIT_DIR,
    ROOT_RUNNING_DB,
    ROOT_TMP_FOLDER,
    ROOT_URI_TORRENT,
    READ_TIMEOUT_FILE
};
