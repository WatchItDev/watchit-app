import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginImageCompress } from '@rsbuild/plugin-image-compress';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const { publicVars } = loadEnv({ prefixes: ['VITE_'] });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  html: { title: 'Watchit', template: './index.html' },
  plugins: [pluginReact(), pluginNodePolyfill(), pluginImageCompress()],
  dev: {
    lazyCompilation: true,
  },
  source: {
    define: publicVars,
  },
  resolve: {
    alias: {
      '@mui/material': resolve(__dirname, 'node_modules/@mui/material/node/index.js'),
      '@mui/utils': resolve(__dirname, 'node_modules/@mui/utils/index.js'),
      '@tabler/icons-react': resolve(
        __dirname,
        'node_modules/@tabler/icons-react/dist/cjs/tabler-icons-react.cjs'
      ),
      viem: resolve(__dirname, 'node_modules/viem/_cjs/index.js'),
      'date-fns': resolve(__dirname, 'node_modules/date-fns/index.js'),
    },
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
    },
  },
});
