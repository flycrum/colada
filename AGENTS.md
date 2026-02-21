# Colada Monorepo

## Purpose

- Single entry for stack, commands, packages, and how to add or work in this repo.
- Target audience: AI Agents
- Don’t put everything in `AGENTS.md`
  - Size limits: Codex uses a cap (e.g. ~32–64 KB); Claude loads the whole file into context, so a long file uses a lot of tokens
  - Effectiveness: “Most effective AGENTS.md files have 6–10 rules and 3–5 command references. Longer files see diminishing returns—agents start ignoring buried instructions.” Target is under ~150 lines; start with 10–15 lines and iterate
  - Prefer condensed one-liner in AGENTS.md for critical info, then link to [docs](./docs) for detailed documentation.

## Project Tech Stack

VoidZero stack. Turborepo 2.x, pnpm 10.x (exclusive), TypeScript 5.x strict, Vue 3.x, Vite 6.x, Vitest 2.x, ESLint 9.x flat config, Prettier 3.x. Config sources: [configs/eslint-config](./configs/eslint-config), [configs/prettier-config](./configs/prettier-config), [configs/typescript-config](./configs/typescript-config). Root: [package.json](./package.json), [turbo.json](./turbo.json).

## Turborepo and dependencies

- [docs/turborepo-general.readme.md](./docs/turborepo-general.readme.md) – Turborepo orchestration, pnpm exclusive, root commands.
- [docs/turborepo-dependencies.readme.md](./docs/turborepo-dependencies.readme.md) – Turborepo dependencies management, external vs workspace packages, pnpm overrides.
- [docs/turborepo-new-workspace.readme.md](./docs/turborepo-new-workspace.readme.md) – Creating new workspaces: categories, configs, examples, packages pattern.

## Code Style

ESM only; TypeScript strict, no `any`; format via shared Prettier. See [configs](./configs).

## Key Commands

From root: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm type-check`, `pnpm test`. Full list: [.claude/commands/root-pnpm-commands.md](./.claude/commands/root-pnpm-commands.md) or `/root-pnpm-commands` in Claude Code.

## Packages

- [packages/colada-store](./packages/colada-store) – Vue 3 stores (global, local, transient).
- [examples/colada-store-examples](./examples/colada-store-examples) – Vite + Vue 3 app consuming colada-store; uses shared configs.

## Markdown file guidelines

- Keep condensed and succinct; sacrifice grammar for concision. Write markdown for AI agents.
- Do not include code examples in markdown. Use markdown links to reference actual code files instead.
- Use markdown links to reference other related markdown files. Backlink markdown-to-markdown so references form a tree (down and back up).
- Require a `## Purpose` section near the top of each markdown file, directly below the primary `#` heading.
- When reading a file, AI agents must also check for colocated "companion" files with the same base name but different suffix/extension (e.g. `App.vue` → `App.config.vue`, `my-utils.ts` and `my-utils.types.ts`).
- When editing a file, AI agents must look for a colocated "companion" `.spec` file with the same base name (e.g. `App.vue` → `App.spec.ts`, `my-utils.ts` → `my-utils.spec.ts`), then run that specific test after editing to ensure it passes.
- Before editing a file, AI agents must look for a colocated "companion" reqs/requirements file with the same base name and `.reqs.md` extension (e.g. `App.vue` → `App.reqs.md`, `my-utils.ts` → `my-utils.reqs.md`, `package.json` → `package.reqs.md`). Read and satisfy those requirements when making changes. If the agent’s instructions imply changing requirements, update the `.reqs.md` file first, then change the target file. Maintain and respect `.reqs.md` files as the source of immediate requirements and long-term vision for the file.

## How to refactor code

- **Check imports:** When adding/editing import paths, verify they're correct.
- **Keep filenames up to date:** When renaming function/variable/type, check if filename matches (e.g. `getHelp` → `get-help.ts`); refactor filename and colocated files (`*.spec.ts`, `*.reqs.md`) together.
- **Run tests after refactors:** ESLint and vitest on changed files (e.g. `*.spec.ts`).
