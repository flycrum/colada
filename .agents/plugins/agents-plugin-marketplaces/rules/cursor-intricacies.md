# Cursor intricacies

- Cursor has no official "load plugin from local path"; plugins are installed from [Cursor Marketplace](https://cursor.com/marketplace) only
- Colada relies on root [AGENTS.md](https://github.com/flycrum/colada/blob/main/AGENTS.md) for Cursor; optionally `.cursor/rules/` with symlinks or thin `.mdc` pointing at `.agents/plugins/*/rules`
- Do not add a Cursor postinstall or symlink script for plugin install; document only
- Docs: [Cursor Plugins](https://cursor.com/docs/plugins), [Building plugins](https://cursor.com/docs/plugins/building), [Rules](https://cursor.com/docs/context/rules), [Third-party hooks](https://cursor.com/docs/agent/third-party-hooks)
