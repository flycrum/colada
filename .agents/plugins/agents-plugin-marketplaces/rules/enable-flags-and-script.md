# ENABLE_LOCAL_AGENT_CLAUDE / ENABLE_LOCAL_AGENT_CURSOR

- **pnpm:devPreinstall** runs `scripts/sync-claude-marketplace.js` (script never breaks install; exits 0 on any error). Script reads `ENABLE_LOCAL_AGENT_CLAUDE` (default false). **Limitation:** on first install or after nuking node_modules, script may skip syncing (deps not yet installed); run `pnpm run sync:claude-marketplace` or `pnpm install` again
- When `true`: create or surgically update `.claude-plugin/marketplace.json` and `.claude/settings.json` (only our keys); when `false`: surgically remove those same fields (clean slate)
- Four combos: true/true, true/false, false/true, false/false; Cursor has no script, flag is documented for future use
- Define in **.envrc.local** (copy from root [.env.example](../../../.env.example); gitignored, each dev owns it) or `.env`; root [.envrc](../../../.envrc) runs `source_env_if_exists .envrc.local` so local exports load. See [.agents/plugins/env-variables](../../env-variables) rules/where-to-define.md
