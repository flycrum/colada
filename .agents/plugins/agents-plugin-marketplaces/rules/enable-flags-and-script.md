# ENABLE flags and sync script

- **.envrc.local:** Copy from root [.env.example](../../../.env.example); gitignored. Root [.envrc](../../../.envrc) runs `source_env_if_exists .envrc.local`
- **Post-merge hook:** [.githooks/post-merge](../../../.githooks/post-merge) runs marketplace-claude:sync and marketplace-cursor:sync after git pull (when pull merges). Enable once: `pnpm run setup:githooks`
- **When true (Claude):** script creates/updates `.claude-plugin/marketplace.json` and `.claude/settings.json` (only our keys). **When false:** removes those fields (clean slate). **When true (Cursor):** script creates symlinks in `.cursor/commands` and `.cursor/rules` and writes `.cursor/.colada-cursor-sync.json`. **When false:** removes only our symlinks and manifest (clean slate)
- **Optional (Claude):** `CLAUDE_EXCLUDED_PLUGINS` (comma-separated dir names) excludes plugins from marketplace when enabled; ignored when disabled. **Optional (Cursor):** `CURSOR_EXCLUDED_PLUGINS` (comma-separated dir names) excludes plugins from sync when enabled; ignored when disabled
- Manual test (Claude): [manual-test-pnpm-install-sync.md](../commands/manual-test-pnpm-install-sync.md). Manual test (Cursor): run `pnpm run marketplace-cursor:sync` with `ENABLE_LOCAL_AGENT_CURSOR=true` then `false`; inspect `.cursor/commands`, `.cursor/rules`, and `.cursor/.colada-cursor-sync.json`
