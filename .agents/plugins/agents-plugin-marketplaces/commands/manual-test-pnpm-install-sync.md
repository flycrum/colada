---
description: Manual verification that the sync script runs (via git post-merge or directly) and respects ENABLE_LOCAL_AGENT_CLAUDE in .envrc.local
---

# Manual test: sync after pull / manual sync

## Purpose

Verify that the [sync script](../../../../scripts/sync-claude-marketplace.js) runs and reads [.envrc.local](../../../../.envrc.local), and that `.claude/` and `.claude-plugin/` are created (when enabled) or removed/cleaned (when disabled). This is a **human-run, manual** check—not part of the automated scripted tests.

## How this differs from scripted tests

- **Scripted tests** ([sync-claude-marketplace-test-all-conditions.js](../../../../scripts/sync-claude-marketplace-test-all-conditions.js), [sync-claude-marketplace-test-a-single-condition.js](../../../../scripts/sync-claude-marketplace-test-a-single-condition.js)): Back up `.claude` and `.claude-plugin`, run the sync script with **CLI override** (`--enable=true` / `--enable=false`), assert filesystem state, then restore. They do **not** run git or rely on the script reading `.envrc.local`. They validate the script’s enable/disable logic in isolation.
- **This manual test**: Uses the **real** flow—edit `.envrc.local`, run the sync (via **git pull** when [.githooks/post-merge](../../../../.githooks/post-merge) is enabled, or via `pnpm run sync:claude-marketplace`), then inspect `.claude` and `.claude-plugin`. Confirms the script loads env from `.envrc.local` and that the post-merge hook runs after pull.

## When does the sync run?

- **After git pull (merge):** If you ran **`pnpm run setup:githooks`** once, the **post-merge** hook runs the sync after every successful `git pull` that does a merge. It does **not** run when pull uses rebase; then run `pnpm run sync:claude-marketplace` if needed.
- **Manual:** Run **`pnpm run sync:claude-marketplace`** anytime (e.g. after changing `.envrc.local` or when you don’t use merge-based pull).

## Steps (manual test)

1. **Enable githooks (if not already):** From repo root run `pnpm run setup:githooks`. Ensure `.envrc.local` has `export ENABLE_LOCAL_AGENT_CLAUDE=false`. Remove any existing `.claude` and `.claude-plugin` (`rm -rf .claude .claude-plugin`).

2. **Enable and run sync.** Set `export ENABLE_LOCAL_AGENT_CLAUDE=true` in `.envrc.local`. Run:
   ```bash
   pnpm run sync:claude-marketplace
   ```
   **Confirm:** `.claude/settings.json` and `.claude-plugin/marketplace.json` exist; `settings.json` has `extraKnownMarketplaces.colada-plugins` and `enabledPlugins` with `*@colada-plugins`; `marketplace.json` has `name: "colada-plugins"` and a non-empty `plugins` array.

3. **Optional: confirm post-merge.** With hooks enabled, do a pull that performs a merge (e.g. pull in new commits). After the merge, the hook runs the sync again; state should remain correct.

4. **Disable and run sync.** Set `export ENABLE_LOCAL_AGENT_CLAUDE=false` in `.envrc.local`. Run:
   ```bash
   pnpm run sync:claude-marketplace
   ```
   **Confirm:** `.claude-plugin/marketplace.json` is gone (or `.claude-plugin` is empty); `.claude/settings.json` is gone or no longer contains our marketplace/enabledPlugins entries (clean slate).

5. **Restore your preference.** Set `.envrc.local` back to what you normally use.

## If the manual test fails

- **Hook never runs after pull:** Ensure you ran `pnpm run setup:githooks` and that the pull actually performed a merge (not a rebase). Check `git config core.hooksPath` is `.githooks`.
- **Sync never runs / env not read:** Run the script directly: `node scripts/sync-claude-marketplace.js` and `node scripts/sync-claude-marketplace.js --enable=true`; check that `loadLocalEnv()` finds `.envrc.local` (see [sync-claude-marketplace.js](../../../../scripts/sync-claude-marketplace.js)).
- **Reference:** [enable-flags-and-script.md](../rules/enable-flags-and-script.md), [sync-claude-marketplace.agents.md](../../../../scripts/sync-claude-marketplace.agents.md).
