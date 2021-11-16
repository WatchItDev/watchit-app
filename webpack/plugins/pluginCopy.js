import { join } from 'path'
import CopyPlugin from 'copy-webpack-plugin'
import { rootDir } from '../utils/env'

const config = {
  patterns: [{
    from: join(rootDir, './public/sw.js'),
    to: 'sw.js'
  },{
    from: join(rootDir, './src/assets'),
    to: 'assets'
  }]
}

export const copyPlugin = new CopyPlugin(config)
