import path from 'path'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'
import dynamicImport from 'vite-plugin-dynamic-import'

import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// import { ViteFaviconsPlugin } from 'vite-plugin-favicon';

/** @type {import('vite').UserConfig} */

const polyfill = nodePolyfills({
  // Whether to polyfill specific globals.
  globals: {
    Buffer: true,
    global: true,
    process: true,
  },
  protocolImports: true,
})

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  envPrefix: 'WATCHIT_',
  plugins: [
    react(),
    // ViteFaviconsPlugin('public/icon512.png'),
    commonjs(/* options */),
    dynamicImport(/* options */),
    polyfill
  ],
  rollupOptions: {
    external: ["react", "react-router"],
    output: {
      globals: {
        react: "React",
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname),
    }
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1600,
    // commonjsOptions: { transformMixedEsModules: true },
    rollupOptions: {
      entryFileNames: '[name].js',
      chunkFileNames: '[name].js',
      // Enable rollup polyfills plugin
      // used during production bundling
      plugins: [polyfill]
    },
  },
})
