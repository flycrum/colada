import { config } from '@colada/eslint-config/base.js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**'] },
  ...config,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    ignores: ['node_modules/**', 'dist/**', '.turbo/**', '**/dist/**'],
  },
];
