import TerserJSPlugin from 'terser-webpack-plugin'
import * as plugins from './plugins'

export default {
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({})]
  },
  plugins: [plugins.cleanWebpackPlugin],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
}
