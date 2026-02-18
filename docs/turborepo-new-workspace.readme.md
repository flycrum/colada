# Turborepo new workspace

## Purpose

- Creating new workspaces in the Colada monorepo: categories, configs, examples. Agent reference. Related: [turborepo-general.readme.md](./turborepo-general.readme.md), [turborepo-dependencies.readme.md](./turborepo-dependencies.readme.md).

## Categories

- **configs** (tooling), **examples** (apps/demos), **packages** (publishable). Add under one. Naming: `@repo` + category + project name. Refs: [configs/eslint-config/package.json](../configs/eslint-config/package.json), [examples/colada-store-examples/package.json](../examples/colada-store-examples/package.json), [packages/colada-store/package.json](../packages/colada-store/package.json).

## Configs

- Use [@repo/configs/eslint-config](../configs/eslint-config), [@repo/configs/prettier-config](../configs/prettier-config), [@repo/configs/typescript-config](../configs/typescript-config); devDeps + extend/import in project. No custom config.

## Samples

- For configs, reference [configs/eslint-config](../configs/eslint-config): shared config, extend/import in project.
- For examples, reference [examples/colada-store-examples](../examples/colada-store-examples): Vite, Vue, workspace dep, shared configs.
- For packages, reference [packages/colada-store](../packages/colada-store): publishable package, workspace dep, dist output.
