const fs = require('fs-extra');
const path = require('path');
const Key = require('../key')
const {
    ROOT_DB_DIR,
    ROOT_STORE
} = require('../../settings')

module.exports = class NodeKey extends Key {

    static get db() {
        return ROOT_DB_DIR
    }

    static get engine() {
        return 'leveldown'
    }

    static get init() {
        fs.ensureDirSync(NodeKey.db)
        return this
    }

    static get existKey() {
        return fs.existsSync(NodeKey.keyFile)
    }

    static get keyFile() {
        return path.join(ROOT_STORE, 'key.json')
    }

    static write(data, file = NodeKey.keyFile) {
        fs.writeFileSync(file, JSON.stringify(data));
    }

    static read() {
        return this.existKey ?
            fs.readFileSync(NodeKey.keyFile) : null
    }
};

