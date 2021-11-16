import { babelLoader } from './useLoaderRuleItems'

/**
 * @see https://webpack.js.org/guides/typescript/#loader
 */
export const typescriptRule = {
  test: /\.tsx?$/,
  loader: 'ts-loader',
  options: {
    transpileOnly: true
  },
  exclude: /node_modules/
}
/**
 * @see https://webpack.js.org/loaders/babel-loader
 */
export const javascriptRule = {
  test: /\.(js|jsx)$/,
  use: [babelLoader],
  exclude: /node_modules/
}

/**
 * @see https://webpack.js.org/loaders/html-loader
 */
export const htmlRule = {
  test: /\.(html)$/,
  use: {
    loader: 'html-loader'
  }
}
/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const imagesRule = {
  test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
  type: 'asset/resource'
}
/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const fontsRule = {
  test: /\.(woff(2)?|eot|ttf|otf|)$/,
  type: 'asset/inline'
}

export const cssRule = {
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
}
