/**
 * Using file-loader for handling svg files
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const svgRule = {
  test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
  type: 'asset/inline'
}

export const svgRules = [svgRule]
