Verify each finding against the current code and only fix it if needed.

In @.docs/turborepo-general.readme.md at line 17, Replace the misleading "[package.json](../package.json)" link in the line "Per-workspace deps in each [package.json](../package.json) under [pnpm-workspace.yaml](../pnpm-workspace.yaml) globs (`configs/*`, `examples/*`, `packages/*`)." with either plain text "per-workspace package.json files" (removing the link) or change the link to point to an example workspace package.json (not the root) and clarify the phrase to read e.g. "Per-workspace deps in each workspace package.json (under the globs in pnpm-workspace.yaml: `configs/*`, `examples/*`, `packages/*`)." Ensure the link target and text clearly distinguish workspace package.json files from the root package.json.# Turborepo general

## Purpose

- General Turborepo 2.x and pnpm usage for the Colada monorepo. Agent reference. For dependency specifics see [turborepo-dependencies.readme.md](./turborepo-dependencies.readme.md).

## Orchestration

- **Turborepo 2.x** orchestrates workspaces: parallel tasks, smart caching, root as source of truth.
- Commands from root (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`) run across all workspaces.
- Task config in root [turbo.json](../turbo.json); `^build` runs dependencies first.

## pnpm (exclusive)

- Use **pnpm only** (no npm/yarn). Fast, strict dependency tree, workspace support.
- Root [package.json](../package.json) holds shared devDeps (turbo, eslint, prettier, typescript).
- Per-workspace deps in each workspace's `package.json` under [pnpm-workspace.yaml](../pnpm-workspace.yaml) globs (`configs/*`, `examples/*`, `packages/*`).

## Commands

See [.claude/commands/root-pnpm-commands.md](../.claude/commands/root-pnpm-commands.md) for install, add, filter, and file-scoped commands.
