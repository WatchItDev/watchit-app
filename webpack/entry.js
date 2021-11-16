import { join } from 'path'
import { rootDir } from './utils/env'

export default {
  main: [
    join(rootDir, '/src/index.tsx')
  ]
}
