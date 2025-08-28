import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginImageCompress } from '@rsbuild/plugin-image-compress';

const { publicVars } = loadEnv({ prefixes: ['VITE_'] });

export default defineConfig({
  html: { title: 'Watchit', template: './index.html' },
  plugins: [pluginReact(), pluginNodePolyfill(), pluginImageCompress()],
  dev: {
    lazyCompilation: true,
  },
  source: {
    define: publicVars,
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
    },
  },
});
