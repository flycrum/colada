import { defineVitestConfig } from '@colada/vitest-config';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineVitestConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@colada/colada-store': path.resolve(
        __dirname,
        '../../packages/colada-store/dist/colada-store.js'
      ),
    },
  },
});
