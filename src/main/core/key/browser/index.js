/* global localStorage */
module.exports = class BrowserKey {

  static get engine () {
    return require('level-js')
  }

  static get init () {
    return this
  }

  static get existKey () {
    return this.isLogged()
  }

  static write (data) {
    localStorage.setItem('key', JSON.stringify(data))
  }

  static read () {
    return localStorage.getItem('key')
  }
}
