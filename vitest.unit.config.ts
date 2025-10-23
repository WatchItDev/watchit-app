import baseConfig from './vitest.config';
import { defineConfig } from 'vitest/config';

const baseTest = (baseConfig as any).test ?? {};

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseTest,
    name: 'unit',
    include: ['src/sections/explore/**/__tests__/unit/**/*.test.{ts,tsx}'],
  },
});
