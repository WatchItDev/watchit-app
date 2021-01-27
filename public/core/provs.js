const log = require('electron-log')
const {consume} = require('streaming-iterables')

const findProv = async (ipfs, key) => {
    /***
     * This module find provs to orbit address and connect with them
     * @param ipfs
     * @param key
     * @return {Promise<void>}
     */

    for await (const cid of ipfs.dht.findProvs(key, {numProviders: 10})) {
        log.info('Connecting to:', cid.id)
        const mAddr = cid.addrs.map((m) => `${m.toString()}/p2p/${cid.id}`)

        for (const m of mAddr) {
            try {
                await ipfs.swarm.connect(m, {timeout: 1000})
                log.info(`Connected to`, m);
            } catch (e) {
                log.error(`Cannot connect to`, m);
            }
        }
    }
}

const provide = async (ipfs, key) => {
    /***
     * This module provides key to dht
     * @param ipfs
     * @param key
     * @return {Promise<void>}
     */
    log.info('Providing address', key);
    await consume(ipfs.dht.provide(key))
    log.info('Provided done')
}


module.exports.findProv = findProv
module.exports.provide = provide


