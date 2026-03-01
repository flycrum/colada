# Variables

- **ENABLE_LOCAL_AGENT_CLAUDE**: `true` or `false`; when true, postinstall creates/updates `.claude-plugin/marketplace.json` and `.claude/settings.json`; when false, script removes only those fields (clean slate)
- **CLAUDE_EXCLUDED_PLUGINS**: optional; comma-separated plugin dir names to exclude from Claude marketplace (e.g. `env-variables,turborepo`). Only applied when `ENABLE_LOCAL_AGENT_CLAUDE=true`; when false, ignored so you can keep the same line when toggling
- **ENABLE_LOCAL_AGENT_CURSOR**: `true` or `false`; documented for future use; no Cursor script currently
- Future: e.g. `GITHUB_TOKEN` for private Claude marketplace auto-updates; see [.agents/plugins/agents-plugin-marketplaces](../agents-plugin-marketplaces) for agent-setup behavior
