# base.agents.md

## Purpose

Single shared ESLint config for the repo; workspaces extend it via [base.js](./base.js). Ensures consistent lint rules and editor diagnostics (squiggles, Problems panel) across packages.

## Requirements

- Export a flat config array from [base.js](./base.js) (`config`) used by root and workspace `eslint.config.js`
- Use `@eslint/js` recommended, `eslint-config-prettier` (disable rules that conflict with Prettier), and `typescript-eslint` recommended
- Keep `ignores` for `dist/**` and `node_modules/**` in the shared config
- **Prettier as ESLint rule**: use `eslint-plugin-prettier` with rule `prettier/prettier: 'error'` so Prettier violations appear as ESLint diagnostics in the editor (squiggles, Problems). Reason: Prettier extension does not show inline diagnostics; only the formatter runs on save/command. Running Prettier via ESLint makes formatting mismatches visible without formatting. Use with `eslint-config-prettier` to avoid duplicate/conflicting rules. Pros: single source of truth (Prettier config), violations visible on open/save. Cons: ESLint runs Prettier per file when linting, so can be slower on large runs; keep format-on-save via Prettier extension for fixes
- Do not add rules that duplicate or override Prettier formatting; use `eslint-config-prettier` and let `eslint-plugin-prettier` report Prettier issues
- Dependencies live in [package.json](./package.json); workspaces depend on `@colada/eslint-config` and do not duplicate ESLint/Prettier plugin deps
