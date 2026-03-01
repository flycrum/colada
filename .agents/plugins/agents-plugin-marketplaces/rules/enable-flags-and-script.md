# ENABLE flags and sync script

- **.envrc.local:** Copy from root [.env.example](../../../.env.example); gitignored. Root [.envrc](../../../.envrc) runs `source_env_if_exists .envrc.local`
- **Post-merge hook:** [.githooks/post-merge](../../../.githooks/post-merge) runs sync after git pull (when pull merges). Enable once: `pnpm run setup:githooks`
- **When true:** script creates/updates `.claude-plugin/marketplace.json` and `.claude/settings.json` (only our keys). **When false:** removes those fields (clean slate)
- **Optional:** `CLAUDE_EXCLUDED_PLUGINS` (comma-separated dir names) excludes plugins from marketplace when enabled; ignored when disabled
- Manual test: [manual-test-pnpm-install-sync.md](../commands/manual-test-pnpm-install-sync.md)
