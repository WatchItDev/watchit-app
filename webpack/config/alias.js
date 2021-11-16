import { join } from 'path'
import { rootDir } from '../utils/env'

export const aliasItems = {
  '@src': join(rootDir, '/src'),
  '@abi': join(rootDir, '/abi'),
  '@w3': join(rootDir, '/src/w3'),
  '@i18n': join(rootDir, '/src/i18n'),
  '@public': join(rootDir, '/public'),
  '@pages': join(rootDir, '/src/pages'),
  '@hooks': join(rootDir, '/src/hooks'),
  '@assets': join(rootDir, '/src/assets'),
  '@styles': join(rootDir, '/src/styles'),
  '@helpers': join(rootDir, '/src/helpers'),
  '@state': join(rootDir, '/src/redux'),
  '@services': join(rootDir, '/src/services'),
  '@navigation': join(rootDir, '/src/navigation'),
  '@components': join(rootDir, '/src/components'),
  '@layouts': join(rootDir, '/src/pages/__layouts__')
}
