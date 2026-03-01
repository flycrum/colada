# Sync after plugin changes

- After adding, changing, or creating a plugin under [.agents/plugins](../../../.agents/plugins) or any of its contents: run sync so marketplace and settings stay in sync
- From repo root: `pnpm run marketplace-claude-sync` or `node .agents/plugins/agents-plugin-marketplaces/scripts/sync-claude-marketplace.js`
- When: new plugin dir, changed `.claude-plugin/plugin.json`, or edits that affect discovery/manifest. Not required for doc-only edits that don't change plugin list
- Script reads `ENABLE_LOCAL_AGENT_CLAUDE` from `.envrc.local`/`.env`; safe when enabled or disabled. See [enable-flags-and-script.md](./enable-flags-and-script.md), [sync-claude-marketplace.js](../../scripts/sync-claude-marketplace.js)
