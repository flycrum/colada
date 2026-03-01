# Add new plugin

## Purpose

Practical steps for generating or updating a plugin (including this plugin). Agent-facing.

## Requirements

1. Create `.agents/plugins/<name>/` with `.cursor-plugin/plugin.json` and `.claude-plugin/plugin.json` (name, description, version, author)
2. Add plugin root README.md: ## Purpose only. Add plugin root AGENTS.md: ## Purpose + optional ## Requirements
3. Put context in **rules/** as `.md` only (not `.mdc`). Add plugin root **AGENTS.md** (Purpose + optional Requirements); no AGENTS.md in sub-folders
4. Optional: commands/, skills/, agents/, hooks/ per [plugin-conventions.md](./plugin-conventions.md). Mirror [Cursor starter-advanced](https://github.com/cursor/plugin-template/tree/main/plugins/starter-advanced) + .claude-plugin
5. Every README in plugin: ## Purpose; state 100% for humans; AI agents can stop reading and use rules/ etc.
6. Keep content succinct; sacrifice grammar for concision;
7. Self-reference this plugin (\_plugin-example) when creating or updating any plugin
8. Sync script picks up new plugins automatically: `.agents/plugins/agents-plugin-marketplaces/scripts/sync-claude-marketplace.js` scans `.agents/plugins/*/.claude-plugin/plugin.json`; no hand-edit of marketplace list needed. **After adding or modifying a plugin, run the sync script** so the marketplace and settings stay in sync: `pnpm run marketplace-claude-sync` from repo root. See [agents-plugin-marketplaces/rules/sync-after-plugin-changes.md](../../agents-plugin-marketplaces/rules/sync-after-plugin-changes.md) and [agents-plugin-marketplaces](../../agents-plugin-marketplaces)
