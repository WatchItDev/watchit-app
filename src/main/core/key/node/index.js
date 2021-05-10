const fs = require('fs-extra');
const path = require('path');
const {
    ROOT_DB_DIR, ROOT_STORE
} = require('../../settings')

module.exports = class NodeKey {

    static get db() {
        return ROOT_DB_DIR
    }

    static get engine() {
        return require('leveldown')
    }

    static get init() {
        fs.ensureDirSync(this.db)
        return this
    }

    static get existKey() {
        return fs.existsSync(this.keyFile)
    }

    static get keyFile() {
        return path.join(ROOT_STORE, 'key.json')
    }

    static write(data, file = this.keyFile) {
        fs.writeFileSync(file, JSON.stringify(data));
    }

    static read() {
        return this.existKey ?
            fs.readFileSync(this.keyFile) : null
    }
};

