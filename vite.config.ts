import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import inject from '@rollup/plugin-inject';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import stdLibBrowser from 'vite-plugin-node-stdlib-browser';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      sourcemap: true, // Source map generation must be turned on
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString();
            }
          },
        },
      },
    },
    plugins: [
      react(),
      inject({
        Buffer: ['buffer', 'Buffer'],
      }),
      sentryVitePlugin({
        authToken: process.env.REACT_APP_SENTRY_AUTH_TOKEN,
        org: "watchit",
        project: "watchit-app",
      }),
      stdLibBrowser(),
      nodePolyfills({
        // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
        include: ['process'],
        globals: { global: true, process: true },
      }),
    ],
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@public': path.resolve(__dirname, 'public'),
        '@redux': path.resolve(__dirname, 'src/redux'),
        'enc-utils': path.resolve(__dirname, 'src/fixes/enc-utils.js'),
        'bip39': path.resolve(__dirname, 'src/fixes/bip39.js'),
      },
    },
    define: {
      'process.env': env, // Make sure to define process.env for compatibility
    },
  };
});
