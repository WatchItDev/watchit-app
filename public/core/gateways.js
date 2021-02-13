const log = require('electron-log')
const gateways = require('./settings/gateways')
const HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m'
const HASH_STRING = 'Hello from IPFS Gateway Checker';

module.exports = class Gateways {

    parse(uri) {
        return `${this.addr()}${uri}`
    }

    async addr() {
        for (const gateway of gateways) {
            log.warn(`Health checking ${gateway}`)
            const gatewayAndHash = `${gateway}${HASH_TO_TEST}`
            const currentGateway = await this.healthCheck(gatewayAndHash)
            if (currentGateway) {
                log.info(`Gateway healthy ${gateway}`)
                return currentGateway
            }
        }
    }

    healthCheck(gateway) {
        return new Promise((res) => {
            const now = Date.now()
            const testUrl = `${gateway}?now=${now}#x-ipfs-companion-no-redirect`
            fetch(testUrl).then((r) => r.text()).then((text) => {
                const matched = (HASH_STRING === text.trim())
                if (matched) return res(true)
                res(false)
            }).catch(() => {
                log.warn(`${gateway} down..`)
                res(false)
            })
        })
    }


}