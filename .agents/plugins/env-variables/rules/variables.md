# Variables

- **ENABLE_LOCAL_AGENT_CLAUDE**: `true` or `false`; when true, postinstall creates/updates `.claude-plugin/marketplace.json` and `.claude/settings.json`; when false, script removes only those fields (clean slate)
- **ENABLE_LOCAL_AGENT_CURSOR**: `true` or `false`; documented for future use; no Cursor script currently
- Future: e.g. `GITHUB_TOKEN` for private Claude marketplace auto-updates; see [.agents/plugins/agents-plugin-marketplaces](../agents-plugin-marketplaces) for agent-setup behavior
