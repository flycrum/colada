---
name: configure-local-agent-env
description: Enable or disable local Claude and/or Cursor agent marketplace setup from context. Use when the user wants to turn on/off local plugins, sync, or agent config; infer which toggles to set and guide them to .envrc.local.
---

# Configure local agent env

## When to use

- User wants to enable or disable local Claude and/or Cursor agent setup (plugins, marketplace sync, postinstall behavior)
- User asks to "use Claude plugins," "turn off the local marketplace," "set up local agent config," or similar
- User is configuring env vars for the first time or changing ENABLE_LOCAL_AGENT_* values

## Instructions

1. **Infer intent** from the prompt:
   - Enable Claude local marketplace/sync → `ENABLE_LOCAL_AGENT_CLAUDE=true`
   - Disable Claude local marketplace/sync → `ENABLE_LOCAL_AGENT_CLAUDE=false`
   - Enable Cursor-related local config (documented only; no script today) → `ENABLE_LOCAL_AGENT_CURSOR=true`
   - Disable Cursor → `ENABLE_LOCAL_AGENT_CURSOR=false`
   - Unclear or "both" → recommend both; default suggestion: Claude true, Cursor false unless they say otherwise

2. **Tell the user where to set values:** Copy root [.env.example](../../../../../../.env.example) to **.envrc.local** at repo root (gitignored; they own it, never commit). Edit the `export ENABLE_LOCAL_AGENT_*` lines there. Root [.envrc](../../../../../../.envrc) runs `source_env_if_exists .envrc.local` so with [direnv](https://direnv.net/) the vars load automatically.

3. **If they enabled Claude:** After setting `ENABLE_LOCAL_AGENT_CLAUDE=true`, run `pnpm install` from repo root; postinstall creates/updates `.claude-plugin/marketplace.json` and `.claude/settings.json` (marketplace + all plugins registered and enabled). Opening the project in Claude Code uses that config—no `/plugin marketplace add` or `/plugin install` steps. If they disabled Claude, run `pnpm install` again for clean slate.

4. **Reference:** [.agents/plugins/env-variables](../../env-variables) for variable semantics; [enable-flags-and-script.md](../../rules/enable-flags-and-script.md) for script behavior; [add-colada-marketplace.md](../../commands/add-colada-marketplace.md) for the automatic flow (opt-in only).
