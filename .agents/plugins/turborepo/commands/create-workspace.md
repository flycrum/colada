# Create workspace

1. Pick category: **configs**, **examples**, or **packages**
2. Create dir under `configs/*`, `examples/*`, or `packages/*`
3. Add package.json with name `@colada/<package-name>`
4. Configs: use @colada/eslint-config, @colada/prettier-config, @colada/typescript-config; devDeps + extend/import
5. Examples: reference [examples/colada-store-examples](../../../examples/colada-store-examples)
6. Packages: reference [packages/colada-store](../../../packages/colada-store)
7. Ensure [pnpm-workspace.yaml](../../../pnpm-workspace.yaml) globs include the dir

See [turborepo-new-workspace.md](../rules/turborepo-new-workspace.md).
