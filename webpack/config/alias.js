import { join } from 'path'
import { rootDir } from '../utils/env'

export const aliasItems = {
  '@src': join(rootDir, '/src'),
  '@main': join(rootDir, '/src/main'),
  '@public': join(rootDir, '/public'),
  '@pages': join(rootDir, '/src/render/core/app/pages'),
  '@helpers': join(rootDir, '/src/render/core/helpers'),
  '@components': join(rootDir, '/src/render/core/app/components'),
  '@logger': join(rootDir, '/src/render/core/helpers/logger'),
  '@render': join(rootDir, '/src/render'),
  '@db':  join(rootDir, '/src/main/core/db'),
  '@settings': join(rootDir, '/src/render/core/settings'),
  'package.json':  join(rootDir,'package.json')
}
