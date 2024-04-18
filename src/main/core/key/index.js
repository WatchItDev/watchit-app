const ParentKey = require(
  // Handle multiple envs for browser or node package
  process.env.RUNTIME === 'web' ? './browser' : './node'
)

module.exports = class Key extends ParentKey {
  static generateKey (data) {
    return this.addToStorage(data)
  }

  static isLogged () {
    return !!this.read()
  }

  static readFromStorage () {
    try {
      return JSON.parse(
        this.read()
      )
    } catch (e) {
      console.log('Invalid JSON')
      return {}
    }
  }

  static removeFromStorage (index) {
    const currentData = this.readFromStorage()
    if (currentData && index in currentData) {
      delete currentData[index]
      this.write(currentData)
    }
  }

  static addToStorage (data = {}) {
    const currentData = this.readFromStorage()
    const extendedData = Object.assign({}, currentData, data)
    this.write(extendedData)
  }

  static getIngestKey () {
    const fileCollection = this.readFromStorage()
    return fileCollection && 'ingest' in fileCollection
      ? fileCollection.ingest.trim()
      : null
  }
}
