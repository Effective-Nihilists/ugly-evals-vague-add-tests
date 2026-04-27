import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      './src/inventory.js': './src/inventory.ts',
      './src/pricing.js': './src/pricing.ts',
    },
  },
});