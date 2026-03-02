# Turborepo general

- Turborepo 2.x orchestrates workspaces; root commands (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`) run across workspaces. Task config in root [turbo.json](../../../turbo.json); `^build` runs deps first
- pnpm only (no npm/yarn). Root [package.json](../../../package.json) shared devDeps; per-workspace deps in workspace package.json. Workspaces under [pnpm-workspace.yaml](../../../pnpm-workspace.yaml) globs: `configs/*`, `examples/*`, `packages/*`
- Commands: [.claude/commands/root-pnpm-commands.md](../../../.claude/commands/root-pnpm-commands.md)
