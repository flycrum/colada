# marketplace-cursor-sync.js

## Purpose

Env-gated sync for Cursor: populate `.cursor/commands` and `.cursor/rules` from `.agents/plugins` via symlinks. Invoked from root by the **git post-merge** hook ([.githooks/post-merge](../../../.githooks/post-merge)) after `git pull` (when pull merges), and optionally via `pnpm run marketplace-cursor:sync`. Reads `ENABLE_LOCAL_AGENT_CURSOR`. When true: create symlinks from each plugin's `commands/*.md` and `rules/*.md` into `.cursor/commands` and `.cursor/rules/<plugin-name>/`, and write manifest `.cursor/.colada-cursor-sync.json` (commands and rules paths) so the monorepo can self-host Cursor commands and rules without publishing. When false: remove only our symlinks and the manifest (clean slate); prune empty plugin subdirs and parent dirs. Toggling on/off must leave no leftover symlinks or manifest. Plugin list is discovered by scanning `.agents/plugins/*/.cursor-plugin/plugin.json`; no hand-maintained list in script. **Excluded from sync:** `_plugin-example` is always excluded (script constant `PLUGINS_EXCLUDED_FROM_SYNC`). Optional per-developer exclusions: `CURSOR_EXCLUDED_PLUGINS` (comma-separated plugin dir names); only applied when enabled.

## Requirements

- **Never break the caller:** On any error script must exit 0 so git post-merge or manual invocations never fail. All logic wrapped in try/catch; main() catches and exits 0
- **Env:** Before reading env, load `.env` then `.envrc.local` from repo root (`loadLocalEnv()`). Lines may contain multiple KEY=value pairs. Then read `ENABLE_LOCAL_AGENT_CURSOR`; default `'false'`. Treat only `'true'` (case-insensitive) as enabled; any other value runs disable logic
- **Run context:** Execute from repo root; ROOT = `path.resolve(__dirname, '..', '..', '..', '..')` (script lives under .agents/plugins/agents-plugin-marketplaces/scripts/)
- **Enable (ENABLE_LOCAL_AGENT_CURSOR=true):**
  - **Target dirs:** `.cursor/commands`, `.cursor/rules/<plugin-name>/` per plugin
  - **Manifest:** `.cursor/.colada-cursor-sync.json` with `{ commands: [...], rules: [...] }` (paths relative to ROOT)
  - For each plugin with `commands/` or `rules/`: create symlinks. Commands go directly into `.cursor/commands/`; rules go into `.cursor/rules/<plugin-name>/`. If link exists, unlink then symlink (idempotent). Use relative paths for symlink targets
  - Only `.md` files are synced
- **Disable (ENABLE_LOCAL_AGENT_CURSOR not true):**
  - Read manifest; unlink each path listed. If manifest invalid or missing, try to unlink manifest and exit
  - Prune empty `.cursor/rules/<plugin-name>/` dirs, then `.cursor/rules`, then `.cursor/commands` if empty
  - Unlink manifest `.colada-cursor-sync.json`. No other files or dirs may be removed
- **Plugin discovery:** Scan `.agents/plugins/` for directories that contain `.cursor-plugin/plugin.json`; skip dirs in `PLUGINS_EXCLUDED_FROM_SYNC` (e.g. `_plugin-example`) plus names from `CURSOR_EXCLUDED_PLUGINS` (comma-separated, from env). Sort plugins by name. Do not hard-code plugin list
- **Idempotent:** Running with same env state twice must produce identical result (no duplicate symlinks)
- **Constants:** Paths under ROOT. See [marketplace-cursor-sync.js](./marketplace-cursor-sync.js) for exact paths and function names
- **Contract:** Documented in this plugin and [.agents/plugins/env-variables](../../env-variables); script must not run Claude-side logic (ENABLE_LOCAL_AGENT_CLAUDE is documented but not used by this script)
- **CLI override:** `--enable=true` or `--enable=false` overrides env; used by test scripts to force mode regardless of .env / .envrc.local. When present, env files are not read for ENABLE_LOCAL_AGENT_CURSOR
- **Test scripts (not vitest):** [marketplace-cursor-sync-test-a-single-condition.js](./marketplace-cursor-sync-test-a-single-condition.js) supports modes enabled, disabled, enabled-with-excluded-plugins, disabled-with-excluded-plugins; [marketplace-cursor-sync-test-all-conditions.js](./marketplace-cursor-sync-test-all-conditions.js) backs up .cursor, runs all steps including exclusion tests, then restores. Run via `pnpm run marketplace-cursor:sync-test`. Do not run as part of normal test suite (slow, real filesystem changes)
