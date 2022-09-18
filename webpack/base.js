import path, { join, resolve } from 'path'
import { aliasItems, devServerUrl, externalItems } from './config'
import entry from './entry'
import { rootDir } from './utils/env'
import optimization from './optimization'
import * as plugins from './plugins'
import * as rules from './rules'
import { isDevServer, isProd } from './utils/env'
import { arrayFilterEmpty } from './utils/helpers'

const runtime = process.env.RUNTIME
const isWeb = runtime === 'web'
const buildPath = process.env.BUILD_PATH || 'src/build';


export default {
    context: __dirname,
    target: isWeb ? 'browserslist' : 'electron-renderer',
    mode: isProd ? 'production' : 'development',
    entry,
    output: {
        path: resolve(join(rootDir, buildPath)),
        publicPath: isDevServer ? devServerUrl : './',
        filename: isDevServer
            ? '[name].[fullhash].js'
            : '[name].[contenthash].js'
    },
    module: {
        strictExportPresence: true,
        rules: arrayFilterEmpty([
            rules.javascriptRule,
            rules.typescriptRule,
            rules.htmlRule,
            rules.fontsRule,
            rules.cssRule,
            rules.sassRule,
            rules.imagesRule,
            ...rules.svgRules
        ]),
        noParse: [
            // WORKAROUND: For `hls.js >=0.6.x` -- against the `This seems to be a pre-built javascript file.` warning. @see https://github.com/dailymotion/hls.js/issues/265#issuecomment-233661596
            /\/node_modules\/hls\.js\/.+$/,
        ],
    },
    plugins: arrayFilterEmpty([
        plugins.htmlWebpackPlugin,
        plugins.providePlugin,
        plugins.definePlugin,
        plugins.nodePolyfillPlugin,
        plugins.copyPlugin,
        plugins.webWork,
        ...(isProd && [plugins.workBoxSW] || [])
    ]),
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname)
        ],
        alias: aliasItems,
        extensions: ['.js', '.jsx', '.css', '.json', '.scss'],
        fallback: {
            stream: require.resolve("stream-browserify"),
            module: false,
            dgram: false,
            dns: 'mock',
            fs: false,
            http2: false,
            net: false,
            tls: false,
            child_process: false,
        }
    },
    watchOptions: {
        ignored: '**/node_modules',
    },
    node: {
        global: true,
        __dirname: true,
        __filename: true
    },
    optimization,
    externals: externalItems,
    devtool: 'inline-source-map',
}

