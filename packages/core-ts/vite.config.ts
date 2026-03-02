import { viteBuildBase } from '@colada/vite-config';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    ...viteBuildBase,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'core-ts',
      fileName: 'core-ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    minify: false,
    sourcemap: true,
  },
});
