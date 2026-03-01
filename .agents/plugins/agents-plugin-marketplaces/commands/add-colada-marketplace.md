---
description: Opt-in and automatic setup for the Colada local marketplace in Claude Code; no manual /plugin steps
---

# Add Colada marketplace (automatic)

1. **Opt-in:** Copy root [.env.example](../../../.env.example) to **.envrc.local**. Set `ENABLE_LOCAL_AGENT_CLAUDE=true`. Optional: `CLAUDE_EXCLUDED_PLUGINS=env-variables,turborepo`. Root [.envrc](../../../.envrc) loads `.envrc.local` (direnv).
2. **Githooks (once per clone):** From root run `pnpm run setup:githooks`. Post-merge then runs [sync-claude-marketplace.js](../scripts/sync-claude-marketplace.js) after git pull (merge). If you haven't pulled yet, run `pnpm run marketplace-claude-sync` once.
3. **Use:** Open project in Claude Code; generated settings already register marketplace and plugins. No `/plugin marketplace add` or `/plugin install`.
4. **New plugins:** Add `.agents/plugins/<name>/` with `.claude-plugin/plugin.json`; next pull or `pnpm run marketplace-claude-sync` picks it up.
5. **Disable:** Set `ENABLE_LOCAL_AGENT_CLAUDE=false`, run `pnpm run marketplace-claude-sync` (or pull); script removes our fields. See [enable-flags-and-script.md](../rules/enable-flags-and-script.md).
