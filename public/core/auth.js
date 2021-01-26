const fs = require('fs-extra');
const path = require('path');
const orbit = require('orbit-db')
const {ROOT_DB_DIR, ROOT_STORE} = require('./settings')

module.exports = class Auth {

    static get db() {
        return ROOT_DB_DIR
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

    static isValidKey(key) {
        return orbit.isValidAddress(
            this.sanitizedKey(key)
        )
    }

    static sanitizedKey(key) {
        return `/orbitdb/${key}/wt.movies.db`
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
        return fileCollection && 'ingest' in fileCollection
            ? fileCollection.ingest.trim() : null

    }

    static write(data, file = Auth.keyFile) {
        fs.writeFileSync(file, JSON.stringify(data));
    }

    static read() {
        return this.existKey ?
            fs.readFileSync(Auth.keyFile) : null
    }
};

