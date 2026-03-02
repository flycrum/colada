# Cursor context warning

- If "Include third-party Plugins, Skills, and other configs" is enabled in Cursor Settings **and** `ENABLE_LOCAL_AGENT_CURSOR=true` in .envrc.local, you may flood the LLM context and waste tokens (both sources load plugin content)
- Prefer one or the other: either use Cursor's third-party inclusion, or use our sync (`ENABLE_LOCAL_AGENT_CURSOR=true`) to symlink from `.agents/plugins` into `.cursor/commands` and `.cursor/rules`
