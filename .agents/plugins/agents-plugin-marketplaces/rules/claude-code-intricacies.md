# Claude Code intricacies

- Local marketplace: when `ENABLE_LOCAL_AGENT_CLAUDE=true`, postinstall creates or surgically updates `.claude-plugin/marketplace.json` and `.claude/settings.json` at repo root (fast-json-patch RFC 6902). Settings include `extraKnownMarketplaces` and `enabledPlugins` for all discovered plugins; Claude Code uses this config automatically—no manual `/plugin marketplace add` or `/plugin install` (see [automatic-only-opt-in.md](./automatic-only-opt-in.md))
- Dev: `claude --plugin-dir ./.agents/plugins/<plugin-name>`
- Docs: [Create plugins](https://docs.anthropic.com/en/docs/claude-code/plugins), [Plugin marketplaces](https://docs.anthropic.com/en/docs/claude-code/plugin-marketplaces), [Discover plugins](https://code.claude.com/docs/en/discover-plugins)
