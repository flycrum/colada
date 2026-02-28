# Claude plugin (plugin-example)

## Purpose

- **Dual layout:** For Cursor + Claude plugin layout see [Figma mcp-server-guide](https://github.com/figma/mcp-server-guide/tree/83b11c0bc199a3c6ee87df0a0bd460139fa72cdc).
- **`plugin.json`:** `name` (plugin id and skill namespace), `description`, `version`, `author`.
- **Skills:** In `skills/<name>/SKILL.md`; namespaced as `/plugin-name:skill-name`.
- **Rules:** No dedicated "rules" file; project uses CLAUDE.md or `.claude/rules/*.md`; plugin context in **rules/** folder.
- **Agents:** Custom agents in `agents/` (Claude: subagents).
- **Test:** `claude --plugin-dir ./plugin-example`.
- **Docs:** [Claude Code: Create plugins](https://code.claude.com/docs/en/plugins), [Plugins reference](https://code.claude.com/docs/en/plugins-reference).
