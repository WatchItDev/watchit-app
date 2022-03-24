const log = require('logplease').create('PROVIDERS')

module.exports = class Providers {
  /**
     * Dial peers and from provided list
     * @param {object} node IPFS
     * @param {array} multiAddressList
  */
  static async connect (node, multiAddressList) {
    for (const m of multiAddressList) {
      try {
        await node.swarm.connect(m, { timeout: 1000 })
        log.info('Connected to', m)
      } catch (e) {
        log.warn('Cannot connect to', m)
      }
    }
  }

  /**
     * This module find providers to orbit address
     * and connect with them
     * @param key
     * @return {Promise<void>}
  */
  static async findProv (node, key) {
    // Avoid TypeError: Cannot read property 'Symbol(Symbol.asyncIterator)' of undefined
    // Cannot read property 'dht' of null
    if (!node || !node.dht) { return false }

    try {
      for await (const cid of node?.dht?.findProvs(
        key, { numProviders: 5 }
      )) {
        log.info('Connecting to:', cid.id)
        // Sanitize addresses to valid multi address format
        const mAddr = cid.addrs.map((m) => `${m.toString()}/p2p/${cid.id}`)
        await Providers.connect(node, mAddr)
      }
    } catch (e) {
      log.error('Fail finding providers')
      // pass
    }
  }
}
