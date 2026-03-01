import { defineVitestConfig } from '@colada/vitest-config';
import { resolve } from 'node:path';

export default defineVitestConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
