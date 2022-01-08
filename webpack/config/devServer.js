import {devServerProxyConfig} from './devServierProxy'
import {spawn} from "child_process";

const defaultPort = 8082
const devServerHost = '127.0.0.1'

export const devServerUrl = `http://${devServerHost}:${defaultPort}/`
const runElectron = process.env.RUNTIME === 'electron'

export const devServerConfig = {
    publicPath: '/',
    open: true,
    port: defaultPort,
    historyApiFallback: true,
    headers: {'Access-Control-Allow-Origin': '*'},
    proxy: devServerProxyConfig,
    hot: true,
    overlay: false,
    compress: true,
    host: devServerHost,
    after() {
        if (runElectron) {
            console.log('Starting Main Process...')
            spawn('npm', ['run', 'electron'], {
                shell: true,
                env: process.env,
                stdio: 'inherit'
            })
                .on('close', code => process.exit(code))
                .on('error', spawnError => console.error(spawnError))
        }

    },
}
