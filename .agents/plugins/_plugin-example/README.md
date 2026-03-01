# \_plugin-example

## Purpose

- This `_plugin-example` is both the documentation and the example for building and maintaining AI agent plugins. It is **excluded from all marketplaces** (Claude, Cursor when supported); it must never appear in a marketplace manifest—sync script and future Cursor logic skip it by design
- When generating or updating any plugin (including this one), agents should reference this plugin
- Keep succinct, limit size, condense, sacrifice grammar for concision
- Do not create AGENTS.md in plugins; all context goes in `rules/`
- Context = rules and lives in `rules/`
- Structure: mirror [Cursor starter-advanced](https://github.com/cursor/plugin-template/tree/main/plugins/starter-advanced)
- Also reference `.claude-plugin/` from ([Figma mcp-server-guide](https://github.com/figma/mcp-server-guide/tree/83b11c0bc199a3c6ee87df0a0bd460139fa72cdc))
- Concept folders (rules, commands, skills, agents, hooks, mcp) can have any number of files; keep content succinct
- See [.cursor-plugin/README.md](./.cursor-plugin/README.md) and [.claude-plugin/README.md](./.claude-plugin/README.md) for platform-specific build docs.
