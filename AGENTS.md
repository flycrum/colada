# Colada Monorepo

## Purpose

- Single entry for stack, commands, packages, and how to add or work in this repo.
- Target audience: AI Agents
- Downstream: [Creating new projects](#creating-new-projects), [Turborepo and dependency management](#turborepo-and-dependency-management), [Markdown file guidelines](#markdown-file-guidelines). Commands: [.claude/commands/root-pnpm-commands.md](./.claude/commands/root-pnpm-commands.md) (full reference; in Claude Code use `/root-pnpm-commands`).
- Don’t put everything in `AGENTS.md`
  - Size limits: Codex uses a cap (e.g. ~32–64 KB); Claude loads the whole file into context, so a long file uses a lot of tokens
  - Effectiveness: “Most effective AGENTS.md files have 6–10 rules and 3–5 command references. Longer files see diminishing returns—agents start ignoring buried instructions.” Target is under ~150 lines; start with 10–15 lines and iterate

## Project Tech Stack

VoidZero stack. Turborepo 2.x, pnpm 10.x (exclusive), TypeScript 5.x strict, Vue 3.x, Vite 6.x, Vitest 2.x, ESLint 9.x flat config, Prettier 3.x. Config sources: [configs/eslint-config](./configs/eslint-config), [configs/prettier-config](./configs/prettier-config), [configs/typescript-config](./configs/typescript-config). Root: [package.json](./package.json), [turbo.json](./turbo.json).

## Code Style

ESM only; TypeScript strict, no `any`; format via shared Prettier. See [configs](./configs).

## Key Commands

From root: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm type-check`, `pnpm test`. Full list: [.claude/commands/root-pnpm-commands.md](./.claude/commands/root-pnpm-commands.md) or `/root-pnpm-commands` in Claude Code.

## Packages

- [packages/colada-store](./packages/colada-store) – Vue 3 stores (global, local, transient).
- [examples/colada-store-examples](./examples/colada-store-examples) – Vite + Vue 3 app consuming colada-store; uses shared configs.

## Creating new projects

- **Categories** – **configs** (tooling), **examples** (apps/demos), **packages** (publishable). Add under one. Naming: `@repo` + category + project name. Refs: [configs/eslint-config/package.json](./configs/eslint-config/package.json), [examples/colada-store-examples/package.json](./examples/colada-store-examples/package.json), [packages/colada-store/package.json](./packages/colada-store/package.json).
- **Configs** – Use [@repo/configs/eslint-config](./configs/eslint-config), [@repo/configs/prettier-config](./configs/prettier-config), [@repo/configs/typescript-config](./configs/typescript-config); devDeps + extend/import in project. No custom config.
- **Examples** – Copy pattern from [examples/colada-store-examples](./examples/colada-store-examples): Vite, Vue, workspace dep, shared configs.

## Markdown file guidelines

- Keep condensed and succinct; sacrifice grammar for concision. Write markdown for AI agents.
- Do not include code examples in markdown. Use markdown links to reference actual code files instead.
- Use markdown links to reference other related markdown files. Backlink markdown-to-markdown so references form a tree (down and back up).
- Require a `## Purpose` section near the top of each markdown file, directly below the primary `#` heading.
- When reading a file, AI agents must also check colocated files with the same base name but different suffix/extension (e.g. `App.vue` → `App.config.vue`, `my-utils.ts` and `my-utils.types.ts`).
- When editing a file, AI agents must look for a colocated `.spec` file with the same base name (e.g. `App.vue` → `App.spec.ts`, `my-utils.ts` → `my-utils.spec.ts`), then run that specific test after editing to ensure it passes.
- Before editing a file, AI agents must look for a colocated requirements file with the same base name and `.reqs.md` extension (e.g. `App.vue` → `App.reqs.md`, `my-utils.ts` → `my-utils.reqs.md`, `package.json` → `package.reqs.md`). Read and satisfy those requirements when making changes. If the agent’s instructions imply changing requirements, update the `.reqs.md` file first, then change the target file. Maintain and respect `.reqs.md` files as the source of immediate requirements and long-term vision for the file.

## Turborepo and dependency management

- **Turborepo 2.x** orchestrates workspaces: parallel tasks, smart caching, root as source of truth. Commands from root: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test` run across all workspaces. Task config in [turbo.json](./turbo.json); `^build` runs dependencies first.

### pnpm (exclusive)

- Use **pnpm only** (no npm/yarn). Fast, strict dependency tree, workspace support. Root [package.json](./package.json) holds shared devDeps (turbo, eslint, prettier, typescript); per-workspace deps in each [package.json](./package.json) under [pnpm-workspace.yaml](./pnpm-workspace.yaml) globs (`configs/*`, `examples/*`, `packages/*`).

### Commands

See [.claude/commands/root-pnpm-commands.md](./.claude/commands/root-pnpm-commands.md) for install, add, filter, and file-scoped commands.

### External vs workspace packages

- **External (npm):** From registry (e.g. vue, vite). Add with `pnpm add <pkg>` in target workspace or `--filter <workspace>`. Shared tooling in root devDeps; app/package-specific in workspace [package.json](./package.json).
- **Workspace:** Under `configs/*`, `examples/*`, `packages/*`. Use `workspace:*` when one workspace depends on another. Name with `@repo/` scope (e.g. `@repo/packages/colada-store`). Turbo runs `^build` so dependents build after their deps.

### Root overrides

- **pnpm.overrides** in root [package.json](./package.json) pin versions for the whole monorepo. Use for: core framework (Vue, etc.), build/tooling (Vite, TypeScript), test/formatter — anything that must be consistent. Don’t use for: package-only deps, or when versions can differ by workspace.
