import baseConfig from './vitest.config';
import { defineConfig } from 'vitest/config';

const baseTest = (baseConfig as any).test ?? {};

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseTest,
    name: 'integration',
    include: ['src/sections/explore/**/__tests__/integration/**/*.test.{ts,tsx}'],
  },
});
