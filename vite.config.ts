import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env': env, // Make sure to define process.env for compatibility
    },
  };
});
