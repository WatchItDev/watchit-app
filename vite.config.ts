import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import preserveDirectives from 'rollup-preserve-directives'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      sourcemap: true
    },
    plugins: [
      react(),
      preserveDirectives(),
      sentryVitePlugin({
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
        org: "watchit",
        project: "watchit-app",
      }),
      nodePolyfills({
        // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
        include: ['process', "module", "buffer", "crypto"],
        globals: { global: true, process: true, Buffer: true },
      }),
    ],
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@types': path.resolve(__dirname, 'src/types'),
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
