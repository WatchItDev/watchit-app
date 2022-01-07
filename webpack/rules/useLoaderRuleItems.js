import { join } from 'path'
import { rootDir } from '../utils/env'

/**
 * @see https://webpack.js.org/loaders/sass-loader/#problems-with-url
 */
export const resolveUrlLoader = {
  loader: 'resolve-url-loader',
  options: {
    sourceMap: true
  }
}

export const babelLoader = {
  loader: 'babel-loader',
  options: {
    configFile: join(rootDir, '/.babelrc.js')
  }
}
