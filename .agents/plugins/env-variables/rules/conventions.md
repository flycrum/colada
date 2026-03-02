# Conventions

- Naming: use `ENABLE_*` for toggles that gate automation
- Any script that sets up Claude or Cursor agent marketplaces/config must read `ENABLE_LOCAL_AGENT_CLAUDE` and `ENABLE_LOCAL_AGENT_CURSOR` and run only when the corresponding value is `true`; when `false`, remove only our added state (clean slate)
