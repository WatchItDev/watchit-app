const fs = require('fs-extra');
const path = require('path');
const crypto = require("crypto");
const {ROOT_STORE} = require(__dirname + '/settings/conf')

module.exports = class Auth {

    static get db() {
        return path.join(
            ROOT_STORE, 'w_source', 'linvo'
        )
    }

    static get sanitizedPublic() {
        let pub = Auth.getPubKey();
        return pub.split('.')
    }

    static get chain() {
        const [root, id, hash] = Auth.sanitizedPublic
        return [root, `links/${hash}/keys/${id}/`]
    }


    static get init() {
        fs.ensureDirSync(this.db)
        return this
    }

    static get existKey() {
        return fs.existsSync(Auth.keyFile)
    }

    static get keyFile() {
        return path.join(ROOT_STORE, 'key.json')
    }

    static generateKey(data) {
        return this.addToStorage(data)
    }


    static isLogged() {
        return !!Auth.read();
    }

    static readFromStorage() {
        try {
            return JSON.parse(
                Auth.read()
            );
        } catch (e) {
            console.log('Invalid JSON');
            return {}
        }

    }

    static removeFromStorage(index) {
        let currentData = Auth.readFromStorage()
        if (currentData && index in currentData) {
            delete currentData[index]
            Auth.write(currentData)
        }
    }

    static addToStorage(data = {}) {
        let currentData = Auth.readFromStorage()
        let extendedData = Object.assign({}, currentData, data)
        Auth.write(extendedData)
    }

    static getPubKey() {
        let fileCollection = Auth.readFromStorage()
        return fileCollection && 'public' in fileCollection
            ? fileCollection.public.trim() : null
    }


    static getIngestKey() {
        let fileCollection = Auth.readFromStorage()
        let ingestKey = fileCollection && 'ingest' in fileCollection
            ? fileCollection.ingest.trim() : null

        if (!ingestKey) return false;
        return crypto.privateDecrypt(
            Auth.getPrivateKey(),
            Buffer.from(ingestKey, 'base64')
        ).toString("utf8");
    }

    static convertToPem(string) {
        return `-----BEGIN RSA PRIVATE KEY-----\n${string}\n-----END RSA PRIVATE KEY-----\n`;
    }

    static getPrivateKey() {
        let fileCollection = Auth.readFromStorage()
        let privateKey = fileCollection && 'private' in fileCollection
            ? fileCollection.private.trim().replace(/\s/g, '') : null

        if (!privateKey) return false
        return Auth.convertToPem(privateKey)
    }

    static write(data, file = Auth.keyFile) {
        fs.writeFileSync(file, JSON.stringify(data));
    }

    static read() {
        return this.existKey ?
            fs.readFileSync(Auth.keyFile) : null
    }
};

