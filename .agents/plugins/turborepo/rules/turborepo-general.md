# Turborepo general

## Purpose

Repo-specific and general Turborepo 2.x and pnpm usage for our Colada monorepo. Agent reference. For dependency specifics see [turborepo-dependencies.md](./turborepo-dependencies.md).

## Orchestration

- Turborepo 2.x orchestrates workspaces: parallel tasks, smart caching, root as source of truth
- Commands from root (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`) run across all workspaces
- Task config in root [turbo.json](../../../turbo.json); `^build` runs dependencies first

## pnpm (exclusive)

- Use pnpm only (no npm/yarn). Fast, strict dependency tree, workspace support
- Root [package.json](../../../package.json) holds shared devDeps (turbo, eslint, prettier, typescript)
- Per-workspace deps in each workspace's package.json under [pnpm-workspace.yaml](../../../pnpm-workspace.yaml) globs (`configs/*`, `examples/*`, `packages/*`)

## Commands

See [.claude/commands/root-pnpm-commands.md](../../../.claude/commands/root-pnpm-commands.md) for install, add, filter, and file-scoped commands
