# agents-plugin-marketplaces

## Purpose

Self-host Claude/Cursor plugins without publishing: env-gated sync, local marketplace JSON, clean-slate. No manual steps except opt-in.

## Requirements

- Opt-in: set `ENABLE_LOCAL_AGENT_CLAUDE=true` in .envrc.local; postinstall does the rest. See [automatic-only-opt-in](rules/automatic-only-opt-in.md)
- After adding or changing plugins under `.agents/plugins`: run sync so marketplace stays in sync. See [sync-after-plugin-changes](rules/sync-after-plugin-changes.md)
- Local env: copy root .env.example to **.envrc.local** (gitignored); root .envrc loads it via `source_env_if_exists`
