import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** @type {import('vite').UserConfig} */
const indexPath = process.env.RUNTIME === 'web' ? 'index.web.js' : 'index.js'

// https://vitejs.dev/config/
export default defineConfig({
  root: './public',
  dist: {
    build: {
      outDir: './dist',
      lib: {
        entry: `./src/render/${indexPath}`
      }
    }
  },
  plugins: [react()],
})
