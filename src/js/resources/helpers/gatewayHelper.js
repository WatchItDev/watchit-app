import settings from 'js/settings'

const HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m'
const HASH_STRING = 'Hello from IPFS Gateway Checker';
const log = window.require("electron-log");

export default {

    _builtPath(resource) {
        let builtPath = resource.cid
        if ('index' in resource)
            builtPath = `${builtPath}/${resource.index}`
        return builtPath
    },

    parse(resource) {
        const builtPath = this._builtPath(resource)
        return `${this.addr()}${builtPath}`
    },

    dummyParse(resource) {
        const builtPath = this._builtPath(resource)
        const random = Math.floor(Math.random() * settings.gateways.length);
        return `${settings.gateways[random]}/${builtPath}`
    },

    async addr() {
        for (const gateway of settings.gateways) {
            log.warn(`Health checking ${gateway}`)
            const gatewayAndHash = `${gateway}${HASH_TO_TEST}`
            const currentGateway = await this.healthCheck(gatewayAndHash)
            if (currentGateway) {
                log.info(`Gateway healthy ${gateway}`)
                return currentGateway
            }
        }
    },

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
