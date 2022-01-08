/**
 * @example
 *  const config = {
 *       $: 'jquery',
 *  }
 */
import { ProvidePlugin } from 'webpack'

const config = {
    Buffer: ['buffer', 'Buffer'],
    process: 'process/browser'
}

export const providePlugin = new ProvidePlugin(config)
