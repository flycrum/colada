# Colada Monorepo

## Purpose

A single, condensed `AGENTS.md` for this monorepo's tech stack, packages, and how ai agents should work in this codebase that links off to more specific details, if necessary

## `AGENTS.md` guidelines

- Don't put everything in `AGENTS.md`
- Size limits: Codex uses a cap (e.g. ~32–64 KB); Claude loads the whole file into context, so a long file uses a lot of tokens
- Effectiveness: "Most effective AGENTS.md files have 6–10 rules and 3–5 command references. Longer files see diminishing returns—agents start ignoring buried instructions." Target is under ~150 lines; start with 10–15 lines and iterate
- Prefer condensed one-liner in AGENTS.md for critical info, then link to [.agents/plugins](./.agents/plugins) for detailed documentation

## Project Tech Stack

VoidZero stack. Turborepo 2.x, pnpm 10.x (exclusive), TypeScript 5.x strict, Vue 3.x, Vite 6.x, Vitest 2.x, ESLint 9.x flat config, Prettier 3.x. Config sources: [configs/](./configs) (eslint, prettier, typescript, vite, vitest). Root: [package.json](./package.json), [turbo.json](./turbo.json)

## Turborepo and dependencies

- [.agents/plugins/turborepo](./.agents/plugins/turborepo) – Turborepo orchestration, pnpm exclusive, root commands; dependencies; creating new workspaces (categories, configs, examples, packages pattern)

## Configs (DRY)

- [.agents/plugins/configs](./.agents/plugins/configs) – Shared config pattern: [configs/](./configs) packages (TypeScript, ESLint, Prettier, Vite, Vitest); extend/import; how to add or extend. Use when adding or changing workspace or shared config

## Code Style

ESM only; TypeScript strict, no `any`; format via shared Prettier. See [configs](./configs)

## Key Commands

From root: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm type-check`, `pnpm test`. Full list: [.claude/commands/root-pnpm-commands.md](./.claude/commands/root-pnpm-commands.md) or `/root-pnpm-commands` in Claude Code

## Packages

- [packages/colada-store](./packages/colada-store) – Vue 3 stores (global, local, transient)
- [examples/colada-store-examples](./examples/colada-store-examples) – Vite + Vue 3 app consuming colada-store; uses shared configs

## Markdown file guidelines

- **Keep documentation DRY**
- Do not include code examples in markdown. Use markdown links to reference actual code files instead
- **File companions** – Companion markdown for a **specific file** uses the **same base name as that file** (no leading underscore). E.g. `registry.rs` → `registry.readme.md`; `registry.agents.md`; `App.vue` → `App.agents.md`. These colocated companion files are meant to be 1:1 representations for a main file and provide things like unit tests, ai agents content, human content, configurations, etc...depending on their extension thus purpose
- Before editing a file, AI agents must look for a colocated **file** companion `.agents.md` (same base name as the file, e.g. `registry.rs` → `registry.agents.md`, `App.vue` → `App.agents.md`). Read and satisfy those requirements when making changes. If the agent's instructions imply changing requirements, update the `.agents.md` file first, then change the target file. Maintain and respect `.agents.md` files as the source of immediate requirements and long-term vision for the file
- **Folder companions** – Companion markdown for a **folder** (describing the folder as a whole, not a single file) uses the **folder name with a leading `_`**. E.g. `domains/` → `domains/_domains.readme.md`, `domains/` → `domains/_domains.agents.md`; `src-tauri/` → `domains/_src-tauri.agents.md`. When working with files within a folder, check for these folder-level companion files and maintain the folder requirements.
- A reminder: **do not** use a leading `_` for file companions (good: `registry.rs` → `registry.readme.md`; bad: `_registry.readme.md`). Leading `_` underscores are for folder-level companion markdown files only

### Types of markdown files

- **`.agents.md`** – Written for AI Agents. Specific, hard requirements. Keep condensed succinct and without trailing punctuation; sacrifice grammar for concision. Never link back to `.readme.md`. Use `## Purpose` towards top of file; put requirements in their own `## Requirements` section (bullets). Link to code or other reqs only. Don't include diagrams. Cite specific variable/class/function names if necessary, but don't include entire code snippets.
- **`.readme.md`** – Written for Humans. Be succinct; split short ideas into bullet points; keep details DRY by linking to other `.readme.md`. Use `## Purpose` towards top of file. Must link to colocated companion files (e.g. `.agents.md`) where they exist; do not repeat details from companion `.agents.md`. Include mermaid diagrams when they make sense. Don't include specific code examples (though CLI commands are acceptable). – Prefer brief descriptors and links to more specific markdown deeper in the tree. Backlinks are acceptable when they connect ideas

### Testing changed files

- When editing a file, AI agents must look for a colocated "companion" `.spec` file with the same base name (e.g. `App.vue` → `App.spec.ts`; `App.vue` → `App.spec-d.ts`). If a colocated companion file is located, then run that specific test after editing to ensure it passes. AI agents should also evaluate whether new tests should be added, old tests should be removed, or current tests should be revised to new requirements and functionality

## How to refactor code

- **Check imports:** When adding/editing import paths, verify they're correct
- **Keep filenames up to date:** When renaming function/variable/type, check if filename matches (e.g. `getHelp` → `get-help.ts`); refactor filename and colocated files (`*.spec.ts`, `*.agents.md`) together
- **Run tests after refactors:** ESLint and vitest on changed files (e.g. `*.spec.ts`)
- **Type tests:** `*.spec-d.ts` must verify that the library’s typings come through when calling the APIs. See [.agents/plugins/vitest](./.agents/plugins/vitest)

## TypeScript: Writing good typings

Keep typings minimal and compact. Keep types DRY. Prefer narrowed types for returned values; widened types are mostly unacceptable. Use mapped types so "go to definition" in the IDE works correctly. Never require consumers to statically cast their accessors or callback params; inference must flow from libraries/utils/helpers/composables/etc

### Prefer `const` type parameters for narrowing

Use **`const` on generic type parameters** (e.g. `const TEntries extends readonly StructureAccessorConfigEntry[]`) when the API needs to infer narrow literal types from the consumer's argument. That way the library infers the narrowest type and downstream types stay precise. Prefer this over requiring the consumer to add runtime `as const`; the `const` modifier on the generic is the right place to enforce narrowing so consumers can write normal literals without extra assertions

### core-ts shared types

Check [packages/core-ts/src/types](./packages/core-ts/src/types) first before creating new or duplicating existing simple or complex types, type utilities, etc. Use existing helpers when available, example: `ExtractStrict` (extract-strict.ts), `OmitStrict` (omit-strict.ts), `FunctionAny` (function-any.ts), `FunctionAnyPromise` (function-any-promise.ts)

### TypeScript libraries

- **lodash-es** — Type/object helpers: e.g. `isObject`, `isFunction`, `isUndefined`, `cloneDeep`, `pick`/`omit`
- **luxon** — Date/time: e.g. `DateTime`, `Duration`, `Interval`, `Settings`
- **type-fest** — Type utilities: e.g. `ReadonlyDeep`, `ArrayValues`, `SetRequired`, `Simplify`
- **neverthrow** — Result types: e.g. `ok`, `err`, `okAsync`, `ResultAsync`

## Plugins for AI Agents

- **`.agents`** – Project root directory for agent-facing config, docs, and plugins; keep agent-agnostic where possible
- **`.agents/plugins`** – Holds plugin bundles (e.g. Cursor, Claude) that group rules, skills, commands, MCP, etc.; one subdirectory per plugin
- **Guidelines**: plugin content should be condensed, no trailing punctuation, sacrifice grammar for concision
