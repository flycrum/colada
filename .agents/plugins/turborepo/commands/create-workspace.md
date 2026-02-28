# Create workspace

## Purpose

Agent-executable steps for creating a new workspace in the Colada monorepo.

## Steps

1. Pick category: **configs** (tooling), **examples** (apps/demos), or **packages** (publishable)
2. Create directory under `configs/*`, `examples/*`, or `packages/*` (e.g. `packages/my-pkg/`)
3. Add package.json with name `@colada/<package-name>` (e.g. `@colada/colada-store`). Directory path is separate from package name
4. For configs: use [@colada/eslint-config](../../../configs/eslint-config), [@colada/prettier-config](../../../configs/prettier-config), [@colada/typescript-config](../../../configs/typescript-config); devDeps + extend/import
5. For examples: reference [examples/colada-store-examples](../../../examples/colada-store-examples) (Vite, Vue, workspace dep, shared configs)
6. For packages: reference [packages/colada-store](../../../packages/colada-store) (publishable, workspace dep, dist output)
7. Ensure workspace is included in [pnpm-workspace.yaml](../../../pnpm-workspace.yaml) globs (`configs/*`, `examples/*`, `packages/*`)

See [turborepo-new-workspace.md](../rules/turborepo-new-workspace.md) for full context.
