# Claude Code intricacies

- With `ENABLE_LOCAL_AGENT_CLAUDE=true`, postinstall updates `.claude-plugin/marketplace.json` and `.claude/settings.json`; `extraKnownMarketplaces` and `enabledPlugins` apply to all discovered plugins. No manual `/plugin` steps. See [automatic-only-opt-in.md](./automatic-only-opt-in.md)
- Dev: `claude --plugin-dir ./.agents/plugins/<plugin-name>`
- Docs: [Create plugins](https://docs.anthropic.com/en/docs/claude-code/plugins), [Plugin marketplaces](https://docs.anthropic.com/en/docs/claude-code/plugin-marketplaces), [Discover plugins](https://code.claude.com/docs/en/discover-plugins)
