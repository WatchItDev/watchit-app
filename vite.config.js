import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** @type {import('vite').UserConfig} */
const indexPath = process.env.RUNTIME === 'web' ? 'index.web.js' : 'index.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@main': './src/main',
      '@render': './src/render'
    },
  },
  dist: {
    build: {
      outDir: './dist',
      lib: {
        entry: `./src/render/${indexPath}`
      }
    }
  },

})
