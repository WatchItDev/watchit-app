/// <reference types="vitest" />
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import preserveDirectives from 'rollup-preserve-directives'
import { codecovVitePlugin } from "@codecov/vite-plugin";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dotenv from "dotenv";

dotenv.config();

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const pure = mode === 'production' ? ['console.log', 'console.info', 'console.warn'] : []

  return {
    esbuild: { pure },
    plugins: [
      react(),
      preserveDirectives(),
      sentryVitePlugin({
        org: "watchit",
        project: "watchit-app",
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
        telemetry: false,
      }),
      nodePolyfills({
        // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
        include: ['process', "module", "buffer"],
        globals: { global: true, process: true, Buffer: true },
      }),
      codecovVitePlugin({
        bundleName: "watchit-app",
        enableBundleAnalysis: process.env.VITE_CODECOV_TOKEN !== undefined,
        uploadToken: process.env.VITE_CODECOV_TOKEN,
      }),
    ],
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@types': path.resolve(__dirname, 'src/types'),
        '@public': path.resolve(__dirname, 'public'),
        '@redux': path.resolve(__dirname, 'src/redux'),
        '@notifications': path.resolve(__dirname, 'src/utils/notifications'),
        'enc-utils': path.resolve(__dirname, 'src/fixes/enc-utils.js'),
        'bip39': path.resolve(__dirname, 'src/fixes/bip39.js'),
      },
    },
    define: {
      'process.env': env, // Make sure to define process.env for compatibility
    },

    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./setupTest.tsx'],
      include: ['**/__test__/**/*.test.{js,ts,jsx,tsx}'],
      coverage: {
        provider: 'v8'
      }
    },
  };

});
