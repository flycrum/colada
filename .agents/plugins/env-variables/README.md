# env-variables

## Purpose

Human-facing overview. This plugin documents environment variables used in the Colada repo (e.g. agent marketplace toggles), where to define them, and that any script that sets up Claude/Cursor agent state must respect the ENABLE_LOCAL_AGENT_* flags. **Default:** root [.env](../../../.env) is committed with safe defaults. **Overrides:** copy root [.env.example](../../../.env.example) to **.envrc.local** (gitignored); root [.envrc](../../../.envrc) loads it via `source_env_if_exists`. For what direnv and `.envrc` do, see root [.envrc.agents.md](../../../.envrc.agents.md). For agent-facing rules and skills, see **rules/** and **skills/** (e.g. [configure-direnv-local-env](skills/configure-direnv-local-env/SKILL.md)).
