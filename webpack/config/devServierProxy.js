/**
 * @see https://webpack.js.org/configuration/dev-server/#devserverproxy
 */
import { pathRewrite } from '../utils/helpers'

// const httpProxyTarget = {
//   port: 80,
//   protocol: 'http'
// }

const httpsProxyTarget = {
  port: 443,
  protocol: 'https'
}

export const devServerProxyConfig = {
  '/world-time': {
    target: `${httpsProxyTarget.protocol}://worldtimeapi.org:${httpsProxyTarget.port}`,
    pathRewrite: pathRewrite('^/world-time/test', '/api'),
    changeOrigin: true,
    secure: false
  },
  '/someurl/test': {
    target: `${httpsProxyTarget.protocol}://reqres.in:${httpsProxyTarget.port}`,
    pathRewrite: pathRewrite('^/someurl/test', '/api'),
    changeOrigin: true,
    secure: false
  }
}
