const orbit = require('orbit-db')


module.exports = class Key {

    static get db() {

    }

    static get engine() {

    }

    static get init() {

    }

    static get existKey() {

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
        return !!Key.read();
    }

    static readFromStorage() {
        try {
            return JSON.parse(
                Key.read()
            );
        } catch (e) {
            console.log('Invalid JSON');
            return {}
        }

    }

    static removeFromStorage(index) {
        let currentData = Key.readFromStorage()
        if (currentData && index in currentData) {
            delete currentData[index]
            Key.write(currentData)
        }
    }

    static addToStorage(data = {}) {
        let currentData = Key.readFromStorage()
        let extendedData = Object.assign({}, currentData, data)
        Key.write(extendedData)
    }

    static getIngestKey() {
        let fileCollection = Key.readFromStorage()
        return fileCollection && 'ingest' in fileCollection
            ? fileCollection.ingest.trim() : null

    }

    static write(data) {

    }

    static read() {

    }
};

