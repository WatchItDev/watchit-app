import isWindows from 'is-windows'
import {devServerProxyConfig} from './devServierProxy'
import {spawn} from "child_process";
import {join, resolve} from "path";
import {rootDir} from "../utils/env";

const buildPath = process.env.BUILD_PATH || 'src/build';


const defaultPort = 8082
const devServerHost = 'localhost'

export const devServerUrl = `http://${devServerHost}:${defaultPort}/`
const runElectron = process.env.RUNTIME === 'electron'

export const devServerConfig = {
    publicPath: '/',
    open: true,
    port: defaultPort,
    historyApiFallback: true,
    headers: {'Access-Control-Allow-Origin': '*'},
    proxy: devServerProxyConfig,
    contentBase: resolve(join(rootDir, buildPath)),
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
