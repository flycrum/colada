import { viteBuildBase } from '@colada/vite-config';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    ...viteBuildBase,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'colada-store',
      fileName: 'colada-store',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    minify: false,
    sourcemap: true,
  },
});
