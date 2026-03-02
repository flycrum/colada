# Cursor intricacies

- No local plugin install from repo; Cursor uses [Cursor Marketplace](https://cursor.com/marketplace) only. Colada sync: when `ENABLE_LOCAL_AGENT_CURSOR=true`, [marketplace-cursor-sync.js](../../scripts/marketplace-cursor-sync.js) symlinks `.agents/plugins` into `.cursor/commands` and `.cursor/rules`
- Colada: root AGENTS.md; optionally `.cursor/rules/` symlinks or thin `.mdc` to `.agents/plugins/*/rules`. Sync script creates these when enabled
- Do not add a separate Cursor postinstall; our sync runs from post-merge and `pnpm run marketplace-cursor:sync`
- Context warning: see [cursor-context-warning.md](./cursor-context-warning.md) (third-party inclusion + ENABLE_LOCAL_AGENT_CURSOR may double-load)
- Docs: [Cursor Plugins](https://cursor.com/docs/plugins), [Building plugins](https://cursor.com/docs/plugins/building), [Rules](https://cursor.com/docs/context/rules), [Third-party hooks](https://cursor.com/docs/agent/third-party-hooks)
