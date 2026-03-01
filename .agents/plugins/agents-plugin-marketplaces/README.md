# agents-plugin-marketplaces

## Purpose

Human-facing overview. This plugin documents how Colada self-hosts agent plugins (Claude Code and Cursor) without publishing: env-gated postinstall script, local marketplace JSON, and clean-slate toggle. **No manual steps** except opt-in: set `ENABLE_LOCAL_AGENT_CLAUDE=true` in .envrc.local; postinstall and generated config do the rest (no `/plugin` commands). For agent-facing context and step-by-step guidance, use **rules/** (including [automatic-only-opt-in](rules/automatic-only-opt-in.md)), **commands/** ([add-colada-marketplace](commands/add-colada-marketplace.md)), and **skills/** (e.g. [configure-local-agent-env](skills/configure-local-agent-env/SKILL.md)).
