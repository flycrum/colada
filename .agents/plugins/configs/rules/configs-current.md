# Current configs

## Purpose

Inventory of [configs/](../../../configs) packages and how workspaces use them. Agents should prefer these over per-workspace duplication.

## Packages

| Package | Exports | Consumed by | Purpose |
|--------|---------|-------------|---------|
| **@colada/typescript-config** | `base.json`, `library.json`, `node.json`, `declaration.json` | All TS workspaces | Shared compiler options; library/node/declaration presets. Path options (`include`, `exclude`, `rootDir`, `outDir`) stay in workspace tsconfigs. |
| **@colada/eslint-config** | `base`, `base.js` | Root, packages, examples | Shared ESLint flat config. |
| **@colada/prettier-config** | (Prettier resolution) | Root, packages, examples | Shared formatting. |
| **@colada/vite-config** | `.`, `./base` | colada-store, colada-store-examples | [viteBuildBase](../../../configs/vite-config/base.js): `target: 'es2022'`, `outDir: 'dist'`. Merge into workspace `build`. |
| **@colada/vitest-config** | `.`, `./base` | colada-store, colada-store-examples | [defineVitestConfig](../../../configs/vitest-config/index.js) merges [vitestBase](../../../configs/vitest-config/base.js) (test globals/env, typecheck `src/**/*.spec-d.ts`) with workspace overrides; applies type assertion once so workspaces don’t repeat it. |

## Workspace usage (reference)

- **tsconfig:** Extend `@colada/typescript-config/<preset>.json`. Add `include`/`exclude` (and if needed `compilerOptions.outDir`/`rootDir`) in the workspace so paths are relative to that workspace.
- **vite.config:** `import { viteBuildBase } from '@colada/vite-config'`; spread into `build` or set `build: viteBuildBase`.
- **vitest.config:** `import { defineVitestConfig } from '@colada/vitest-config'`; call `defineVitestConfig({ resolve, plugins, ... })` with only workspace-specific options.
- **eslint:** Extend or import from `@colada/eslint-config` per existing usage.
- **prettier:** Reference `@colada/prettier-config` in workspace package.json or config.

## Relation

- [configs-add-or-extend.md](./configs-add-or-extend.md) – adding or changing a config
- [configs-purpose-and-context.md](./configs-purpose-and-context.md) – why and when to use shared config
