# Rules (agents-plugin-marketplaces)

- Self-host Claude/Cursor plugins without publishing: env-gated sync, local marketplace, clean-slate. No manual steps except opt-in: [automatic-only-opt-in.md](./automatic-only-opt-in.md)
- After plugin changes: run sync. [sync-after-plugin-changes.md](./sync-after-plugin-changes.md). Local env: [.env.example](../../../.env.example) → **.envrc.local**; root .envrc loads it
- Platform: [claude-code-intricacies.md](./claude-code-intricacies.md), [cursor-intricacies.md](./cursor-intricacies.md), [cursor-context-warning.md](./cursor-context-warning.md). Other agents: [other-agent-intricacies.md](./other-agent-intricacies.md)
