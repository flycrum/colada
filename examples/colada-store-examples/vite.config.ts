import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { defineConfig } from 'vite';

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
  build: {
    target: 'es2022',
    outDir: 'dist',
  },
});
