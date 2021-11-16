import { join } from 'path'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { isDev, rootDir } from '../utils/env'

const config = {
  async: isDev,
  typescript: {
    configFile: join(rootDir, '/tsconfig.json')
  }
}

export const forkTsCheckerWebpackPlugin = new ForkTsCheckerWebpackPlugin(
  config
)
