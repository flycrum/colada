# Configs purpose and context

## Purpose

Single source of truth for build, lint, test, and type-check config. Avoid duplicate options and workarounds (e.g. type assertions, glob patterns) across workspaces.

## Principles

- **Shared configs live in [configs/](../../../configs)**. Workspaces under `packages/*`, `examples/*` depend on them via `workspace:*` and extend or import.
- **Prefer extend/merge over copy.** Workspace configs should only declare what differs; common options (target, outDir, test globals, typecheck include) belong in a config package.
- **One workaround per concern.** If a tool’s types are wrong (e.g. Vitest `typecheck` not on `UserConfig`), fix it once in a shared helper (e.g. [configs/vitest-config](../../../configs/vitest-config)) so workspaces don’t repeat assertions or comments.
- **Path-related options often stay local.** TypeScript resolves `include`, `exclude`, `rootDir`, `outDir` in an extended config relative to that config file’s directory. So shared tsconfigs can only safely share non-path compiler options; each workspace keeps its own `include`/`exclude` (and often `rootDir`/`outDir`) so paths resolve relative to the workspace.

## Relation

- [configs-current.md](./configs-current.md) – what exists and what each provides
- [configs-add-or-extend.md](./configs-add-or-extend.md) – how to add or change config
- Root [AGENTS.md](../../../AGENTS.md) – Code style points at configs
