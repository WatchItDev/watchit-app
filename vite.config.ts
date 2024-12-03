import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import inject from '@rollup/plugin-inject';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import stdLibBrowser from 'vite-plugin-node-stdlib-browser';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      sourcemap: true, // Source map generation must be turned on
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react',
              'react-dom',
              'redux',
              'react-redux',
              '@reduxjs/toolkit',
              'lodash',
              'axios',
              'moment',
              'date-fns',
            ],
            ui: [
              '@mui/material',
              '@mui/lab',
              '@mui/system',
              'framer-motion',
              'react-quill',
              'notistack',
            ],
            lens: [
              '@lens-protocol/api-bindings',
              '@lens-protocol/client',
              '@lens-protocol/metadata',
              '@lens-protocol/react',
              '@lens-protocol/react-web',
              '@lens-protocol/wagmi',
            ],
            web3auth: [
              '@web3auth/account-abstraction-provider',
              '@web3auth/base',
              '@web3auth/default-evm-adapter',
              '@web3auth/ethereum-provider',
              '@web3auth/modal',
              '@web3auth/modal-react-hooks',
              '@web3auth/web3auth-wagmi-connector',
            ],
            charts: [
              'apexcharts',
            ],
            map: [
              'react-map-gl',
            ],
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
