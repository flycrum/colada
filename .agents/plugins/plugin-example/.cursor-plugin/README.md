# Cursor plugin (plugin-example)

## Purpose

- **`plugin.json`:** `name` (plugin id, lowercase kebab-case), `description`, `version`, `author`, `keywords`. Required: `name` only.
- **Paths optional:** `rules`, `agents`, `skills`, `commands`, `hooks`, `mcpServers` are optional (path(s) to files or dirs). You are not required to set them.
- **Default discovery:** When the manifest does not specify explicit paths for a component type, the parser uses automatic folder-based discovery. Defaults: `skills/`, `rules/`, `agents/`, `commands/`, `hooks/hooks.json`, `.mcp.json` at plugin root.
- **When to use explicit paths:** Only when using a non-default path (e.g. `"skills": "./my-skills/"`) or inline config. If a manifest field is specified, it replaces folder discovery for that component; the default folder is not also scanned. `.mcp.json` at plugin root is detected automatically; specify `mcpServers` only for a custom path or inline config.
- **Doc pattern:** Official examples use default layout and omit path fields (name, description, author, keywords, logo, version only). Use default folders ⇒ no path keys in manifest.
- **Conventions:** In this plugin system use `.md` for rules (agent-agnostic; Cursor discovers `.md` in rules/). Skills in `skills/<name>/SKILL.md`; commands in `commands/*.md`. Keep plugins focused; add frontmatter where needed.
- **Docs:** [Cursor: Building plugins](https://cursor.com/docs/plugins/building), [Rules](https://cursor.com/docs/context/rules), [Agent Skills](https://cursor.com/docs/context/skills), [Agents](https://cursor.com/docs/context/agents), [Hooks](https://cursor.com/docs/agent/hooks), [MCP](https://cursor.com/docs/context/mcp). Commands in the Building plugins doc.
