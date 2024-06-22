import path from 'path'
import react from '@vitejs/plugin-react'

import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import handlebars from 'vite-plugin-handlebars';

/** @type {import('vite').UserConfig} */

export const alias = {
  '@': path.resolve(__dirname, 'src'),
  '#': path.resolve(__dirname),
}

export const polyfill = nodePolyfills({
  // Whether to polyfill specific globals.
  protocolImports: true,
  globals: {
    Buffer: true,
    global: true,
    process: true,
  }
})

export const build = {
  target: 'esnext',
  chunkSizeWarningLimit: 1600,
  rollupOptions: {
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    plugins: [polyfill]
  },
}

export const plugins = (script) => ([
  react(),
  handlebars({ context: { script } }),
  polyfill
])

// https://vitejs.dev/config/
export default defineConfig({
  build,
  root: 'src/renderer',
  envPrefix: 'WATCHIT_',
  resolve: { alias },
  plugins: plugins('index.web.jsx'),
})
