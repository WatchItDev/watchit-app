import { defineConfig, loadEnv } from 'vite';
import react                  from '@vitejs/plugin-react';
import { visualizer }         from 'rollup-plugin-visualizer';
import { sentryVitePlugin }   from '@sentry/vite-plugin';
import { codecovVitePlugin }  from '@codecov/vite-plugin';
import { nodePolyfills }      from 'vite-plugin-node-polyfills';
import compression            from 'vite-plugin-compression';
import preserveDirectives     from 'rollup-preserve-directives';
import path                   from 'node:path';
import dotenv                 from 'dotenv';

dotenv.config();

export default defineConfig(({ mode }) => {
  const env  = loadEnv(mode, process.cwd(), 'VITE_');
  const prod = mode === 'production';

  return {
    build: {
      target: 'es2020',
      sourcemap: !prod,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 700,
    },

    plugins: [
      react(),

      visualizer({
        filename: 'stats.html',
        open: !!process.env.ANALYZE,
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
      }),

      preserveDirectives(),

      prod &&
      sentryVitePlugin({
        org: "watchit",
        project: "watchit-app",
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
        telemetry: false,
        sourcemaps: { assets: './dist/**' },
      }),

      nodePolyfills({
        include: ['buffer', 'process'],
        globals: { Buffer: true, process: true },
      }),

      compression({ algorithm: 'brotliCompress' }),
      codecovVitePlugin({
        bundleName: 'watchit-app',
        enableBundleAnalysis: !!process.env.VITE_CODECOV_TOKEN,
        uploadToken: process.env.VITE_CODECOV_TOKEN,
      }),
    ].filter(Boolean),

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
