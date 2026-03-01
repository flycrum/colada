# Rules / context

## Purpose

Rules in this plugin describe how Colada self-hosts agent plugins (Claude, Cursor) without publishing: local marketplace, env-gated sync script, and clean-slate toggle. **Requirement:** no manual steps except opt-in—see [automatic-only-opt-in.md](./automatic-only-opt-in.md). Local env: copy root [.env.example](../../../.env.example) to **.envrc.local** (gitignored); each developer owns .envrc.local; root [.envrc](../../../.envrc) loads it via `source_env_if_exists`.

## Claude code intricacies

- Local marketplace: when `ENABLE_LOCAL_AGENT_CLAUDE=true`, postinstall creates or updates `.claude-plugin/marketplace.json` and `.claude/settings.json` at repo root; `.claude/settings.json` includes `extraKnownMarketplaces` and `enabledPlugins` for all discovered plugins so Claude Code uses the config automatically—no `/plugin marketplace add` or `/plugin install` steps
- Dev/test: `claude --plugin-dir ./.agents/plugins/<name>`
- Settings: `extraKnownMarketplaces`, `enabledPlugins` in `.claude/settings.json`; see [Create plugins](https://docs.anthropic.com/en/docs/claude-code/plugins), [Plugin marketplaces](https://docs.anthropic.com/en/docs/claude-code/plugin-marketplaces), [Discover plugins](https://code.claude.com/docs/en/discover-plugins)

## Cursor intricacies

- No local plugin install from repo; Cursor plugins are distributed via [Cursor Marketplace](https://cursor.com/marketplace) only
- Use root [AGENTS.md](https://github.com/flycrum/colada/blob/main/AGENTS.md) and optionally `.cursor/rules/` (symlinks or thin `.mdc` to `.agents/plugins/*/rules` if desired)
- Do not rely on a Cursor "marketplace" or local plugin install; see [Cursor Plugins](https://cursor.com/docs/plugins), [Building plugins](https://cursor.com/docs/plugins/building), [Rules](https://cursor.com/docs/context/rules), [Third-party hooks](https://cursor.com/docs/agent/third-party-hooks)
- Occassionally do a web search to see if Cursor has updated to support a local marketplace comparable to Claude's

## Other coding agent intricacies

GitHub Codex uses AGENTS.md for project instructions and `~/.codex/rules/` for shell allow/prompt/forbidden; different from Cursor/Claude plugin rules.
