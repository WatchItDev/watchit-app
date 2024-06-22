
import { alias, plugins, build } from './vite.config'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

// electron.vite.config.js
export default defineConfig({
    main: {
        envPrefix: 'WATCHIT_',
        resolve: { alias },
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        build,
        envPrefix: 'WATCHIT_',
        resolve: { alias },
        plugins: plugins('index.jsx')
    }
})