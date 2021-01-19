module.exports = async (ipfs, key) => {
    /***
     * This module find provs to orbit address and connect with them
     * @param ipfs
     * @param key
     * @return {Promise<void>}
     */
    for await (const cid of ipfs.dht.findProvs(key)) {
        console.info('Connecting to:', cid.id)
        const mAddr = cid.addrs.map((m) => `${m.toString()}/ipfs/${cid.id}`)

        for (const m of mAddr) {
            try {
                await ipfs.swarm.connect(m)
                console.log(`Connected to`, m);
            } catch (e) {
                console.log(`Cannot connect to`, m);
            }
        }
    }
}
