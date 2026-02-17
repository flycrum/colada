import { config } from '@repo/configs/eslint-config/base.js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    ignores: ['node_modules/**', 'dist/**'],
  },
];
