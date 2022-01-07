import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const config = {
  cleanOnceBeforeBuildPatterns: [
    '**/*',
    '!profile.json',
    '!tsconfig.tsbuildinfo'
  ]
}

export const cleanWebpackPlugin = new CleanWebpackPlugin(config)
