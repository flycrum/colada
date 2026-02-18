# Turborepo dependencies

## Purpose

- Dependency management in the Colada monorepo: external vs workspace packages, root overrides. Agent reference. For general Turborepo/pnpm usage see [turborepo-general.readme.md](./turborepo-general.readme.md).

## External vs workspace packages

- **External (npm):** From registry (e.g. vue, vite). Add with `pnpm add <pkg>` in target workspace or `--filter <workspace>`. Shared tooling in root devDeps; app/package-specific in workspace [package.json](../package.json).
- **Workspace:** Under `configs/*`, `examples/*`, `packages/*`. Use `workspace:*` when one workspace depends on another. Name with `@colada/` scope using `@scope/package-name` (e.g. `@colada/colada-store`); directory path is separate (e.g. `packages/colada-store/`). Turbo runs `^build` so dependents build after their deps.

## Root overrides

- **pnpm.overrides** in root [package.json](../package.json) pin versions for the whole monorepo. Use for: core framework (Vue, etc.), build/tooling (Vite, TypeScript), test/formatter — anything that must be consistent. Don't use for: package-only deps, or when versions can differ by workspace.
