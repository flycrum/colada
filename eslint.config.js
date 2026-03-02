import { config } from '@colada/eslint-config/base.js';
import globals from 'globals';

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
  {
    files: ['scripts/**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['.agents/plugins/agents-plugin-marketplaces/scripts/**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },
];
