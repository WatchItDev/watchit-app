const webpack = require('webpack')
export const webWork = new webpack.NormalModuleReplacementPlugin(/^webworkify$/, 'webworkify-webpack')