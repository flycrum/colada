# sync-claude-marketplace.js

## Purpose

Env-gated sync for Claude Code local marketplace. Invoked from root **pnpm:devPreinstall** (and optionally via `pnpm run sync:claude-marketplace`); reads `ENABLE_LOCAL_AGENT_CLAUDE`. When true: create or surgically update `.claude-plugin/marketplace.json` and `.claude/settings.json` at repo root so the monorepo can self-host plugins without publishing. The generated settings include `extraKnownMarketplaces` and `enabledPlugins` for all discovered plugins so the process is automatic—no manual `/plugin` steps; only opt-in (env var) is required (see [.agents/plugins/agents-plugin-marketplaces/rules/automatic-only-opt-in.md](../.agents/plugins/agents-plugin-marketplaces/rules/automatic-only-opt-in.md)). When false: surgically remove only our fields (or delete the file if content was entirely ours) so the repo returns to a pristine state (clean slate). Toggling on/off must leave no leftover generated JSON or symlinks. Uses fast-json-patch (RFC 6902) for path-based add/replace/remove. Plugin list is discovered by scanning `.agents/plugins/*/.claude-plugin/plugin.json`; no hand-maintained list in script. **Excluded from marketplaces:** `_plugin-example` is never included in any marketplace manifest (script constant `PLUGINS_EXCLUDED_FROM_MARKETPLACE`); same exclusion applies to future Cursor local marketplace support.

## Requirements

- **Never break pnpm install:** On any error (e.g. `fast-json-patch` not installed yet, first clone, after nuking node_modules), script must exit 0 so install always completes. Use dynamic `import('fast-json-patch')` and top-level try/catch + `main().catch(() => process.exit(0))`
- **Known limitation:** pnpm:devPreinstall runs before deps are installed, so on first install or after removing node_modules the script may exit 0 without syncing (deps unavailable). Run `pnpm run sync:claude-marketplace` or run `pnpm install` again after deps exist
- **Env:** Before reading env, load `.env` then `.envrc.local` from repo root (`loadLocalEnv()`) so script uses current file state. Then read `ENABLE_LOCAL_AGENT_CLAUDE`; default `'false'`. Treat only `'true'` (case-insensitive) as enabled; any other value runs disable logic
- **Run context:** Execute from repo root (ROOT = `path.resolve(__dirname, '..')`); assume CWD or script location gives correct repo root
- **Enable (ENABLE_LOCAL_AGENT_CLAUDE=true):**
  - **Target files:** `.claude-plugin/marketplace.json`, `.claude/settings.json`
  - If file missing: create with full canonical content (name `colada-plugins`, owner Colada, plugins from `discoverPlugins()`; `extraKnownMarketplaces.colada-plugins` with `source: { source: "directory", path: ROOT }` (absolute path per [Claude Code settings schema](https://json.schemastore.org/claude-code-settings.json)); `enabledPlugins` for each plugin `*@colada-plugins`)
  - If file exists: surgical edit only—add or replace our keys; do not remove or overwrite user-added keys. For marketplace: replace `/name`, `/owner`, `/plugins`. For settings: merge into `extraKnownMarketplaces` and `enabledPlugins` (spread existing + canonical)
  - Use fast-json-patch: `validate` then `applyPatch`; write with `JSON.stringify(obj, null, 2)`
- **Disable (ENABLE_LOCAL_AGENT_CLAUDE not true):**
  - **Marketplace:** If file contains only our data (name === MARKETPLACE_NAME, has plugins array, ≤3 keys), delete file. Else apply remove ops for `/name`, `/owner`, `/plugins` if present
  - **Settings:** Delete `extraKnownMarketplaces[MARKETPLACE_NAME]` and every `enabledPlugins` key ending with `@colada-plugins`. If `extraKnownMarketplaces` or `enabledPlugins` becomes empty, remove that key; if settings object has no keys left, delete file
  - No other keys or files may be removed
- **Plugin discovery:** Scan `.agents/plugins/` for directories that contain `.claude-plugin/plugin.json`; skip any dir name in `PLUGINS_EXCLUDED_FROM_MARKETPLACE` (e.g. `_plugin-example`). Build plugin entry from manifest (name, source `./.agents/plugins/<dir>`, description, version). Sort plugins by name. Do not hard-code plugin list
- **Idempotent:** Running with same env state twice must produce identical result (no duplicate entries, no stray keys)
- **JSON integrity:** Use fast-json-patch only; no naive string replace. Validate patch before apply
- **Constants:** MARKETPLACE_NAME = `colada-plugins`; paths under ROOT. See [sync-claude-marketplace.js](./sync-claude-marketplace.js) for exact paths and function names
- **Contract:** Documented in [.agents/plugins/agents-plugin-marketplaces](../.agents/plugins/agents-plugin-marketplaces) and [.agents/plugins/env-variables](../.agents/plugins/env-variables); script must not run Cursor-side logic (ENABLE_LOCAL_AGENT_CURSOR is documented but not used by this script)
- **CLI override:** `--enable=true` or `--enable=false` overrides env; used by test scripts to force mode regardless of .env / .envrc.local. When present, env files are not read for ENABLE_LOCAL_AGENT_CLAUDE
- **Test scripts (not vitest):** [sync-claude-marketplace-test-a-single-condition.js](./sync-claude-marketplace-test-a-single-condition.js) runs sync with one forced mode and asserts filesystem; [sync-claude-marketplace-test-all-conditions.js](./sync-claude-marketplace-test-all-conditions.js) backs up .claude and .claude-plugin, runs disabled → enabled → disabled → enabled, then restores. Run via `pnpm run test:sync-claude-marketplace`. Do not run as part of normal test suite (slow, real filesystem changes)
