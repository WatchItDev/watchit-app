const fs = require('fs-extra');
const path = require('path');
const orbit = require('orbit-db')
const {ROOT_DB_DIR, ROOT_STORE} = require('./settings')

module.exports = class Broker {

    static get db() {
        return ROOT_DB_DIR
    }

    static get init() {
        fs.ensureDirSync(this.db)
        return this
    }

    static get existKey() {
        return fs.existsSync(Broker.keyFile)
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
        return !!Broker.read();
    }

    static readFromStorage() {
        try {
            return JSON.parse(
                Broker.read()
            );
        } catch (e) {
            console.log('Invalid JSON');
            return {}
        }

    }

    static removeFromStorage(index) {
        let currentData = Broker.readFromStorage()
        if (currentData && index in currentData) {
            delete currentData[index]
            Broker.write(currentData)
        }
    }

    static addToStorage(data = {}) {
        let currentData = Broker.readFromStorage()
        let extendedData = Object.assign({}, currentData, data)
        Broker.write(extendedData)
    }

    static getPubKey() {
        let fileCollection = Broker.readFromStorage()
        return fileCollection && 'public' in fileCollection
            ? fileCollection.public.trim() : null
    }


    static getIngestKey() {
        let fileCollection = Broker.readFromStorage()
        return fileCollection && 'ingest' in fileCollection
            ? fileCollection.ingest.trim() : null

    }

    static write(data, file = Broker.keyFile) {
        fs.writeFileSync(file, JSON.stringify(data));
    }

    static read() {
        return this.existKey ?
            fs.readFileSync(Broker.keyFile) : null
    }
};

