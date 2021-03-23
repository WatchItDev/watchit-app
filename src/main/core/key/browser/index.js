const Key = require('../key')

module.exports = class BrowserKey extends Key {

    static get db() {
        return 'w_db'
    }

    static get engine() {
        return 'level-js'
    }

    static get init() {
        return this
    }

    static get existKey() {
        return Key.isLogged()
    }


    static write(data) {
        localStorage.setItem('key', JSON.stringify(data))
    }

    static read() {
        return localStorage.getItem('key')
    }
};

