import { join } from 'path'
import CopyPlugin from 'copy-webpack-plugin'
import { rootDir } from '../utils/env'

const config = {
  patterns: [
    { from: join(rootDir, './public/icon192.png'), to: '' },
    { from: join(rootDir, './public/icon512.png'), to: '' },
    { from: join(rootDir, './public/favicon.ico'), to: '' },
    { from: join(rootDir, './public/manifest.json'), to: '' },
  ]
}

export const copyPlugin = new CopyPlugin(config)
