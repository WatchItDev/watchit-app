import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

const resolveFromRoot = (path: string) => resolve(__dirname, path);

export default defineConfig({
  resolve: {
    alias: {
      '@src': resolveFromRoot('src'),
      '@types': resolveFromRoot('src/types'),
      '@redux': resolveFromRoot('src/redux'),
      '@notifications': resolveFromRoot('src/utils/notifications'),
      '@public': resolveFromRoot('public'),
    },
  },
  test: {
    name: 'all',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['setupTest.tsx'],
    include: ['src/sections/explore/**/__tests__/**/*.test.{ts,tsx}'],
    css: false,
    coverage: {
      reporter: ['text', 'html'],
      reportsDirectory: resolveFromRoot('coverage'),
    },
  },
});
