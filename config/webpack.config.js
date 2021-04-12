const baseConf = require('./webpack.base')
const {merge} = require('webpack-merge');
const paths = require('./paths');
const path = require('path');

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function (webpackEnv) {
    const runtime = process.env.RUNTIME;

    return merge(baseConf(webpackEnv), {
        target: runtime === 'web' ? 'web' : 'electron-renderer',

        resolve: {
            alias: {
                'components': path.resolve(paths.appSrc, 'render/core/app/components'),
                'layout': path.resolve(paths.appSrc, 'render/core/app/layout'),
                'pages': path.resolve(paths.appSrc, 'render/core/app/pages'),
                'resource': path.resolve(paths.appSrc, 'render/core/resources'),
                'settings': path.resolve(paths.appSrc, 'render/core/settings'),
                'main': path.resolve(paths.appSrc, 'main/'),
            }
        }
    });
}
