import { join, resolve } from 'path'
import { rootDir } from './utils/env'
const indexPath = process.env.RUNTIME === 'web' ? 'index.web.js' : 'index.js'

export default {
  main: [
    resolve(join(rootDir, `src/render/${indexPath}`))
  ]
}
