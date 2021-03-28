const log = require('electron-log')


module.exports = class Providers {

    static async connect(node, multiAddressList) {
        for (const m of multiAddressList) {
            try {
                await node.swarm.connect(m, {timeout: 1000})
                log.info(`Connected to`, m);
            } catch (e) {
                log.error(`Cannot connect to`, m);
            }
        }
    }

    static getProvidersFromKey(node, key) {
        return node.dht.findProvs(
            key, {numProviders: 10}
        )
    }

    static async findProv(node, key) {
        /***
         * This module find provs to orbit address and connect with them
         * @param key
         * @return {Promise<void>}
         */

        if (!node.dht) return;
        for await (const cid of this.getProvidersFromKey(node, key)) {
            log.info('Connecting to:', cid.id)
            // Sanitize addresses to valid multi address format
            const mAddr = cid.addrs.map((m) => `${m.toString()}/p2p/${cid.id}`)
            await Providers.connect(node, mAddr)
        }
    }

}



