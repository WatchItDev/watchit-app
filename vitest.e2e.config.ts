import baseConfig from './vitest.config';
import { defineConfig } from 'vitest/config';

const baseTest = (baseConfig as any).test ?? {};

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseTest,
    name: 'e2e',
    include: ['src/sections/explore/**/__tests__/e2e/**/*.test.{ts,tsx}'],
  },
});
