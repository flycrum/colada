---
description: Root and pnpm command reference for the Colada monorepo
---

# Root pnpm commands

## Purpose

- Full command reference for the Colada monorepo (human and agent use).
- Keeps [AGENTS.md](../AGENTS.md) short; agents can open this file or use `/root-pnpm-commands` when they need a specific command.
- Source of truth: root [package.json](../package.json), [turbo.json](../turbo.json), [pnpm-workspace.yaml](../pnpm-workspace.yaml).

## Root scripts (from repo root)

| Script       | Command           | Notes                    |
|-------------|-------------------|--------------------------|
| build       | `pnpm build`       | Turbo: all workspaces    |
| dev         | `pnpm dev`        | Turbo: dev servers       |
| lint        | `pnpm lint`       | ESLint from root         |
| format      | `pnpm format`     | Prettier write           |
| type-check  | `pnpm type-check` | Turbo: type-check        |
| test        | `pnpm test`       | Turbo: test              |

## pnpm

- `pnpm install` — install all; use `--no-frozen-lockfile` when lockfile must update.
- `pnpm add <pkg>` — add in current workspace (run from that dir).
- `pnpm add -w <pkg>` — add to root.
- `pnpm add <pkg> --filter <workspace>` — add to specific workspace.
- After adding/changing workspace deps, run `pnpm install` so lockfile stays in sync.

## Turbo / single workspace

- `pnpm turbo run <task> --filter <workspace>` — run task in one workspace (e.g. `--filter @colada/colada-store`; workspace dir `packages/colada-store/`). Filter value is the package name from the workspace’s package.json.
- From a package dir: `pnpm build`, `pnpm test`, etc. run in that workspace only.

## File-scoped (for agents)

- Type-check one file: `pnpm exec tsc --noEmit -p <path-to-tsconfig>` or from package: `pnpm type-check` (package-level).
- Lint one file: `pnpm exec eslint <path/to/file.ts>`.
- Format one file: `pnpm exec prettier --write <path>`.
- Tests: from package root, `pnpm vitest run` or `pnpm vitest run <path/to/file.spec.ts>`.
