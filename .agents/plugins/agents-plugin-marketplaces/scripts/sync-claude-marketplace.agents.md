# sync-claude-marketplace.js

## Purpose

Env-gated sync for Claude Code local marketplace. Invoked from root by the **git post-merge** hook ([.githooks/post-merge](../../../.githooks/post-merge)) after `git pull` (when pull merges), and optionally via `pnpm run marketplace-claude-sync`. Reads `ENABLE_LOCAL_AGENT_CLAUDE`. When true: create or surgically update `.claude-plugin/marketplace.json` and `.claude/settings.json` at repo root so the monorepo can self-host plugins without publishing. The generated settings include `extraKnownMarketplaces` and `enabledPlugins` for all discovered plugins so the process is automatic—no manual `/plugin` steps; only opt-in (env var) and one-time `pnpm run setup:githooks` are required (see [automatic-only-opt-in.md](../rules/automatic-only-opt-in.md)). When false: surgically remove only our fields (or delete the file if content was entirely ours) so the repo returns to a pristine state (clean slate). Toggling on/off must leave no leftover generated JSON or symlinks. Uses fast-json-patch (RFC 6902) for surgical edits; if the dep is missing (e.g. pull before pnpm install), script exits 0. Plugin list is discovered by scanning `.agents/plugins/*/.claude-plugin/plugin.json`; no hand-maintained list in script. **Excluded from marketplaces:** `_plugin-example` is never included in any marketplace manifest (script constant `PLUGINS_EXCLUDED_FROM_MARKETPLACE`); same exclusion applies to future Cursor local marketplace support.

## Requirements

- **Never break the caller:** On any error (including missing fast-json-patch) script must exit 0 so git post-merge or manual invocations never fail. Uses fast-json-patch for applyOps; dynamic import so missing dep is caught and exited 0
- **Env:** Before reading env, load `.env` then `.envrc.local` from repo root (`loadLocalEnv()`) so script uses current file state. Then read `ENABLE_LOCAL_AGENT_CLAUDE`; default `'false'`. Treat only `'true'` (case-insensitive) as enabled; any other value runs disable logic
- **Run context:** Execute from repo root; ROOT = `path.resolve(__dirname, '..', '..', '..', '..')` (script lives under .agents/plugins/agents-plugin-marketplaces/scripts/)
- **Enable (ENABLE_LOCAL_AGENT_CLAUDE=true):**
  - **Target files:** `.claude-plugin/marketplace.json`, `.claude/settings.json`
  - If file missing: create with full canonical content (name `colada-plugins`, owner Colada, plugins from `discoverPlugins()`; `extraKnownMarketplaces.colada-plugins` with `source: { source: "directory", path: ROOT }` (absolute path per [Claude Code settings schema](https://json.schemastore.org/claude-code-settings.json)); `enabledPlugins` for each plugin `*@colada-plugins`)
  - If file exists: surgical edit only—add or replace our keys via fast-json-patch replace/add. For marketplace: replace `/name`, `/owner`, `/plugins`. For settings: replace or add `extraKnownMarketplaces` and `enabledPlugins` (merged with existing). Write with `JSON.stringify(patched, null, 2)`
- **Disable (ENABLE_LOCAL_AGENT_CLAUDE not true):**
  - **Marketplace:** If file contains only our data (name === MARKETPLACE_NAME, has plugins array, ≤3 keys), delete file. Else apply remove ops for `/name`, `/owner`, `/plugins` via fast-json-patch, then write
  - **Settings:** Delete our keys in memory; if a parent key becomes empty, apply remove op for it; if settings has no keys left, delete file
  - No other keys or files may be removed
- **Plugin discovery:** Scan `.agents/plugins/` for directories that contain `.claude-plugin/plugin.json`; skip any dir name in `PLUGINS_EXCLUDED_FROM_MARKETPLACE` (e.g. `_plugin-example`). Build plugin entry from manifest (name, source `./.agents/plugins/<dir>`, description, version). Sort plugins by name. Do not hard-code plugin list
- **Idempotent:** Running with same env state twice must produce identical result (no duplicate entries, no stray keys)
- **Constants:** MARKETPLACE_NAME = `colada-plugins`; paths under ROOT. See [sync-claude-marketplace.js](./sync-claude-marketplace.js) for exact paths and function names
- **Contract:** Documented in this plugin and [.agents/plugins/env-variables](../../env-variables); script must not run Cursor-side logic (ENABLE_LOCAL_AGENT_CURSOR is documented but not used by this script)
- **CLI override:** `--enable=true` or `--enable=false` overrides env; used by test scripts to force mode regardless of .env / .envrc.local. When present, env files are not read for ENABLE_LOCAL_AGENT_CLAUDE
- **Test scripts (not vitest):** [sync-claude-marketplace-test-a-single-condition.js](./sync-claude-marketplace-test-a-single-condition.js) runs sync with one forced mode and asserts filesystem; [sync-claude-marketplace-test-all-conditions.js](./sync-claude-marketplace-test-all-conditions.js) backs up .claude and .claude-plugin, runs disabled → enabled → disabled → enabled, then restores. Run via `pnpm run marketplace-claude:test-sync`. Do not run as part of normal test suite (slow, real filesystem changes)
