# package.json

## Purpose

Provide context and requirements for why the colocated [package.json](./package.json) is configured as it is and has the dependencies it does. Root workspace for the Colada monorepo; scripts and devDependencies here apply to the repo as a whole.

## devDependencies

- **@colada/eslint-config** (workspace:*) — Shared ESLint flat config; root and workspaces extend it for lint rules and Prettier integration
- **@colada/prettier-config** (workspace:*) — Shared Prettier config; format script and editor formatting use it
- **@colada/typescript-config** (workspace:*) — Shared tsconfig bases (base, library, node, declaration); workspaces extend for type-check and build
- **eslint** — Lint runner; root `pnpm lint` runs eslint; config in [eslint.config.js](./eslint.config.js) extends shared config
- **fast-json-patch** — RFC 6902 JSON Patch; used by [scripts/sync-claude-marketplace.js](./scripts/sync-claude-marketplace.js) for surgical edits to `.claude-plugin/marketplace.json` and `.claude/settings.json`. Script is run via **pnpm:devPreinstall** (runs every `pnpm install`; exits 0 if deps missing so install never fails) and via `pnpm run sync:claude-marketplace`. Optional script test (not vitest): `pnpm run test:sync-claude-marketplace` runs [sync-claude-marketplace-test-all-conditions.js](./scripts/sync-claude-marketplace-test-all-conditions.js) which backs up `.claude`/`.claude-plugin`, runs disabled → enabled → disabled → enabled, then restores; does not run as part of `pnpm test`
- **globals** — Node/browser globals for ESLint; root [eslint.config.js](./eslint.config.js) uses `globals.node` for `scripts/**/*.js` so `process` etc are defined
- **prettier** — Formatter; root format script and shared Prettier config dependency
- **turbo** — Turborepo; runs build, dev, test, type-check across workspaces per [turbo.json](./turbo.json)
- **typescript** — Compiler and type-check; workspaces use shared tsconfig; root does not compile, only orchestrates via turbo

## packageManager and engines

- **packageManager** — `pnpm@10.0.0`; repo uses pnpm exclusively for install and workspace resolution; lockfile and scripts assume pnpm
- **engines.node** — `>=20`; minimum Node version for the monorepo
  - **Type-in:** [configs/typescript-config/node.json](./configs/typescript-config/node.json) sets `compilerOptions.types: ["node"]` for Node typings; used by configs that need Node globals (e.g. script targets)
  - **Sync with .nvmrc:** [.nvmrc](./.nvmrc) pins a single Node version (e.g. `20`) for `nvm use` and CI; keep it within the range allowed by `engines.node` (e.g. `20` satisfies `>=20`). When changing Node minimum: update `engines.node` in package.json and the value in .nvmrc so they stay in sync
