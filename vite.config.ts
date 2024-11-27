import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import inject from '@rollup/plugin-inject';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      inject({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@public': path.resolve(__dirname, 'public'),
        '@redux': path.resolve(__dirname, 'src/redux'),
      },
    },
    define: {
      'process.env': env, // Make sure to define process.env for compatibility
    },
  };
});
