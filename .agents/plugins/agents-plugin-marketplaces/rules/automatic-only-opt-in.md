# Automatic flow; only opt-in is manual

- No manual steps except single opt-in: developer sets `ENABLE_LOCAL_AGENT_CLAUDE=true` in [.envrc.local](../../../.envrc.local) (copy from [.env.example](../../../.env.example))
- Postinstall runs [marketplace-claude-sync.js](../../scripts/marketplace-claude-sync.js); creates/updates `.claude-plugin/marketplace.json` and `.claude/settings.json` with all discovered plugins. No hand-maintained list, no `/plugin marketplace add` or `/plugin install`
- Disable: set `ENABLE_LOCAL_AGENT_CLAUDE=false` and run `pnpm install` again (clean slate)
