# Turborepo new workspace

## Purpose

Creating new workspaces in the Colada monorepo: categories, configs, examples. AI Agent reference. Related: [turborepo-general.md](./turborepo-general.md), [turborepo-dependencies.md](./turborepo-dependencies.md).

## Categories

- **configs** (tooling), **examples** (apps/demos), **packages** (publishable). Add under one. Package name: `@scope/package-name` (e.g. `@colada/colada-store`); directory path separate (e.g. `packages/colada-store/`). Refs: [configs/eslint-config/package.json](../../../configs/eslint-config/package.json), [examples/colada-store-examples/package.json](../../../examples/colada-store-examples/package.json), [packages/colada-store/package.json](../../../packages/colada-store/package.json).

## Configs

- Use [@colada/eslint-config](../../../configs/eslint-config) (dir `configs/eslint-config/`), [@colada/prettier-config](../../../configs/prettier-config), [@colada/typescript-config](../../../configs/typescript-config); devDeps + extend/import in project. No custom tsconfigs

## Samples

- For configs, reference [configs/eslint-config](../../../configs/eslint-config): shared config, extend/import in project
- For examples, reference [examples/colada-store-examples](../../../examples/colada-store-examples): Vite, Vue, workspace dep, shared configs
- For packages, reference [packages/colada-store](../../../packages/colada-store): publishable package, workspace dep, dist output
