---
description: Manual verification that sync scripts run (post-merge or direct) and respect ENABLE_LOCAL_AGENT_CLAUDE / ENABLE_LOCAL_AGENT_CURSOR in .envrc.local
---

# Manual test: sync after pull / manual sync

## Purpose

Verify that the marketplace sync scripts run and read [.envrc.local](../../../../.envrc.local), and that enable/disable produces the expected filesystem state. **Human-run, manual**—not part of automated scripted tests.

## When sync runs

- **Post-merge:** After `git pull` that performs a merge, [.githooks/post-merge](../../../../.githooks/post-merge) runs both sync scripts. Enable once: `pnpm run setup:githooks`. If pull uses rebase, run sync manually.
- **Manual:** Run `pnpm run marketplace-claude:sync` and/or `pnpm run marketplace-cursor:sync` (or `pnpm run marketplace-all:sync`) anytime.

## Outline

1. Enable githooks: `pnpm run setup:githooks`. Set `.envrc.local` (e.g. `ENABLE_LOCAL_AGENT_CLAUDE=false`, `ENABLE_LOCAL_AGENT_CURSOR=false`). Remove any existing `.claude`, `.claude-plugin`, or `.cursor` sync artifacts if you want a clean test.
2. **Enable:** Set the relevant `ENABLE_LOCAL_AGENT_*=true`, run the sync script(s), confirm target files/dirs and manifest content.
3. **Disable:** Set `ENABLE_LOCAL_AGENT_*=false`, run sync, confirm clean slate (only our keys/symlinks removed).
4. Restore your usual `.envrc.local`.

## Details and test scripts

For full behavior, env semantics, CLI override (`--enable=true`/`false`), and scripted-test usage, see each script’s companion `.agents.md`:

- **Claude:** [marketplace-claude-sync.agents.md](../scripts/marketplace-claude-sync.agents.md)
- **Cursor:** [marketplace-cursor-sync.agents.md](../scripts/marketplace-cursor-sync.agents.md)

See also [enable-flags-and-script.md](../rules/enable-flags-and-script.md).
