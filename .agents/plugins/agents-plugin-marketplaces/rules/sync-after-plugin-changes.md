# Sync after plugin changes

## Purpose

Keep the Claude local marketplace and settings in sync whenever `.agents/plugins` or a plugin’s contents change.

## Requirement

After any **modification**, **addition**, or **creation** of a plugin under [.agents/plugins](../../../.agents/plugins) or any of its contents (rules, skills, commands, plugin manifests, etc.), AI agents must run the sync script so the latest plugin set is reflected in `.claude-plugin/marketplace.json` and `.claude/settings.json`.

- **Command:** From repo root: `pnpm run sync:claude-marketplace` or `node scripts/sync-claude-marketplace.js`
- **When:** After adding a new plugin dir, changing `.claude-plugin/plugin.json`, or editing plugin content that affects discovery or manifest (e.g. name, description). Not required for doc-only edits that don’t affect the plugin list or manifest
- **Env:** Script reads `ENABLE_LOCAL_AGENT_CLAUDE` from `.envrc.local` / `.env`; if enabled, it updates the generated files; if disabled, it cleans them. Running the script is safe in either state
- **Reference:** [scripts/sync-claude-marketplace.js](../../../scripts/sync-claude-marketplace.js), [enable-flags-and-script.md](./enable-flags-and-script.md)
