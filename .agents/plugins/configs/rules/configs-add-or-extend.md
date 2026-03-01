# Add or extend a config

## Purpose

Steps and constraints for introducing a new shared config or changing an existing one so agents can do it autonomously and keep configs DRY.

## When to add a new config package

- Two or more workspaces repeat the same tool config (or the same workaround)
- The repeated slice is stable (e.g. build target, test env, typecheck glob) and not one-off
- The tool supports extend/merge (tsconfig extends, Vite/Vitest mergeConfig or a wrapper)

## Steps to add a new config under configs/

1. **Create directory** `configs/<name>-config/` (e.g. `configs/vitest-config`). Match existing pattern: `package.json` (name `@colada/<name>-config`), exports, `files`, and peerDependencies for the tool.
2. **Implement shared slice** in JS (or JSON for tsconfig-only). Export a base object or a wrapper function that applies the shared options (and any type assertion) once. Prefer ESM (`"type": "module"`).
3. **Ship types if consumed from TS.** Add `.d.ts` next to `.js` (or types in package.json) so workspaces that import the config don’t get “no declaration file” errors.
4. **Document** in this plugin: add the package and its exports to [configs-current.md](./configs-current.md) and note how workspaces should consume it.
5. **Refactor workspaces** that duplicate the same options to import or extend the new config; remove the duplicated block and the workaround (e.g. per-file type assertion).
6. **Wire deps:** In each consuming workspace, add `"@colada/<name>-config": "workspace:*"` (or `workspace:^`) to devDependencies; run `pnpm install` from root.

## When to extend an existing config

- A new workspace needs the same tooling as an existing one: add the same devDeps and the same extend/import pattern (see [configs-current.md](./configs-current.md)).
- A new shared option applies to all current consumers (e.g. new Vitest default): add it to the shared base in the config package and bump or document; no change in workspaces unless they override.

## TypeScript config gotcha (paths)

- **Extended config paths are resolved relative to the config file.** In a shared `configs/typescript-config/foo.json`, `include`, `exclude`, `rootDir`, `outDir` are resolved from `configs/typescript-config/`, not from the workspace that extends it. So:
  - **Do** put in shared tsconfig only non-path options (e.g. `compilerOptions` like `declaration`, `emitDeclarationOnly`).
  - **Do not** put `include`, `exclude`, `rootDir`, `outDir` in a shared tsconfig that is extended by other packages; each workspace tsconfig that extends it must set those so paths are relative to the workspace.
- **Convention:** Shared preset = compiler options only; workspace adds `include`, `exclude`, and if needed `outDir`/`rootDir`.

## Checklist for “make this config DRY”

- [ ] Identify the repeated slice (options or workaround) and which tool it belongs to.
- [ ] If a suitable config package exists: add the option or workaround there and refactor workspaces to use it.
- [ ] If not: create a new config package under configs/, implement the shared slice + types, document in configs-current.md, refactor workspaces, add workspace deps.
- [ ] Verify: build and type-check (and test if applicable) in each affected workspace; ensure no duplicate workarounds remain.

## Relation

- [configs-current.md](./configs-current.md) – list of configs and usage
- [configs-purpose-and-context.md](./configs-purpose-and-context.md) – principles
- [.agents/plugins/\_plugin-example/rules/add-new-plugin.md](../_plugin-example/rules/add-new-plugin.md) – when the “new config” is a new agent plugin rather than a config package
