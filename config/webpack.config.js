const webpack = require('webpack')
const { GenerateSW } = require('workbox-webpack-plugin')
const baseConf = require('./webpack.base')
const { merge } = require('webpack-merge')
const paths = require('./paths')
const path = require('path')

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function (webpackEnv) {
  const runtime = process.env.RUNTIME
  const isWeb = runtime === 'web'

  return merge(baseConf(webpackEnv), {
    plugins: [
      new GenerateSW(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          RUNTIME: JSON.stringify('web')
        }
      }),
    ],
    target: isWeb ? 'web' : 'electron-renderer',
    resolve: {
      alias: {
        '@public': paths.appPublic,
        '@components': path.resolve(paths.appSrc, 'render/core/app/components'),
        '@pages': path.resolve(paths.appSrc, 'render/core/app/pages'),
        '@helpers': path.resolve(paths.appSrc, 'render/core/helpers'),
        '@logger': path.resolve(paths.appSrc, 'render/core/helpers/logger'),
        '@main': path.resolve(paths.appSrc, 'main'),
        '@render': path.resolve(paths.appSrc, 'render'),
        '@db': path.resolve(paths.appSrc, 'main/core/db'),
        '@settings': path.resolve(paths.appSrc, 'render/core/settings'),
        'package.json': paths.appPackageJson,

      }
    }
  })
}
