import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@colada/colada-store': path.resolve(
        __dirname,
        '../../packages/colada-store/dist/colada-store.js'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
  typecheck: {
    include: ['src/**/*.test-d.ts'],
  },
});
