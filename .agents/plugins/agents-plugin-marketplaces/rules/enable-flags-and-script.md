# ENABLE_LOCAL_AGENT_CLAUDE / ENABLE_LOCAL_AGENT_CURSOR

- Postinstall runs `scripts/sync-claude-marketplace.js`; script reads `ENABLE_LOCAL_AGENT_CLAUDE` (default false)
- When `true`: create or surgically update `.claude-plugin/marketplace.json` and `.claude/settings.json` (only our keys); when `false`: surgically remove those same fields (clean slate)
- Four combos: true/true, true/false, false/true, false/false; Cursor has no script, flag is documented for future use
- Define in **.envrc.local** (copy from root [.env.example](../../../.env.example); gitignored, each dev owns it) or `.env`; root [.envrc](../../../.envrc) runs `source_env_if_exists .envrc.local` so local exports load. See [.agents/plugins/env-variables](../../env-variables) rules/where-to-define.md
