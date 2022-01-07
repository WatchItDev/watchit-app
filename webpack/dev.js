import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { devServerConfig } from './config'

export default {
  devtool: 'cheap-module-source-map',
  plugins: [new ReactRefreshWebpackPlugin()],
  devServer: devServerConfig
}
