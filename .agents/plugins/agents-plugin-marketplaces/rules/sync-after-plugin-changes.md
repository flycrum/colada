# Sync after plugin changes

- After adding, changing, or creating a plugin under [.agents/plugins](../../../.agents/plugins) or any of its contents: run both syncs so Claude marketplace/settings and Cursor commands/rules stay in sync
- From repo root: `pnpm run marketplace-claude:sync` and `pnpm run marketplace-cursor:sync` (or run the scripts under agents-plugin-marketplaces/scripts directly)
- When: new plugin dir, changed `.claude-plugin/plugin.json`, or edits that affect discovery/manifest. Not required for doc-only edits that don't change plugin list
- Script reads `ENABLE_LOCAL_AGENT_CLAUDE` from `.envrc.local`/`.env`; safe when enabled or disabled. See [enable-flags-and-script.md](./enable-flags-and-script.md), [marketplace-claude-sync.js](../../scripts/marketplace-claude-sync.js)
