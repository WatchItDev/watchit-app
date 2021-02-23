import settings from 'js/settings'


const HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m'
const HASH_STRING = 'Hello from IPFS Gateway Checker';
const log = window.require("electron-log");

export default {

    _builtPath(resource) {
        let builtPath = resource.cid
        builtPath = 'quality' in resource ? `${builtPath}/${resource.quality}` : builtPath
        builtPath = 'index' in resource ? `${builtPath}/${resource.index}` : builtPath
        return builtPath
    },

    dummyParse(resource) {
        const builtPath = this._builtPath(resource)
        const random = Math.floor(Math.random() * settings.gateways.length);
        return `${settings.gateways[random]}/ipfs/${builtPath}`
    },

    async addr() {
        const checkedGateways = await Promise.all(settings.gateways.map(this.healthCheck))
        return checkedGateways.filter((g) => g).shift()
    },

    healthCheck(gateway) {
        /**
         * Check gateway health before use it
         * @param gateway
         * return <Promise>
         */
        return new Promise((res) => {
            const now = Date.now()
            const gatewayAndHash = `${gateway}/ipfs/${HASH_TO_TEST}`
            const testUrl = `${gatewayAndHash}?now=${now}#x-ipfs-companion-no-redirect`
            log.warn(`Health checking ${gateway}`)

            fetch(testUrl).then((r) => r.text()).then((text) => {
                const matched = (HASH_STRING === text.trim())
                if (matched) return res(matched)
            }).catch(() => {
                log.warn(`${gateway} down..`)
            })
        })
    }
}
