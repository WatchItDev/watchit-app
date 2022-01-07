import {join} from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import {isProd, rootDir} from '../utils/env'

const config = Object.assign({
        inject: true,
        template: join(rootDir, '/public/index.html'),
    }, isProd ? {
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        },
    } : undefined
)

export const htmlWebpackPlugin = new HtmlWebpackPlugin(config)
