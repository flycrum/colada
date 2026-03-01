# env-variables

## Purpose

Environment variables used in Colada (e.g. agent marketplace toggles). Where to define; scripts that set Claude/Cursor agent state must respect ENABLE_LOCAL_AGENT_* flags.

## Requirements

- Default: root .env committed with safe defaults. Overrides: copy .env.example to **.envrc.local** (gitignored); root .envrc loads via `source_env_if_exists`
- See [where-to-define](rules/where-to-define.md), [variables](rules/variables.md), [conventions](rules/conventions.md)
- Skill: [configure-direnv-local-env](skills/configure-direnv-local-env/SKILL.md)
