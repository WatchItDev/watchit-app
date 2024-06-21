import settings from '@/render/settings'

// TODO write tests
export default {
  parse (resource) {
    const gateways = settings.gateways()
    const random = Math.floor(Math.random() * gateways.length)
    return `${gateways[random]}/ipfs/${resource}`
  }
}
