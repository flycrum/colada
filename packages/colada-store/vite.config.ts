import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
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
    target: 'es2022',
    minify: false,
    sourcemap: true,
  },
});
