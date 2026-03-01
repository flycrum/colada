# Git hooks (versioned)

Hooks in this directory run when git triggers them. Git uses this directory only if the repo is configured with:

```bash
git config core.hooksPath .githooks
```

Run once per clone (or use `pnpm run setup:githooks` from repo root).

## Hooks used

- **post-merge** — Runs only after a successful **`git merge`**. So it runs after a default **`git pull`** that actually merges (fetched new commits). It **does not** run when: **`git pull`** says "Already up to date" (no merge), **`git pull --rebase`**, or when `pull.rebase` is true. Used to run [../scripts/sync-claude-marketplace.js](../scripts/sync-claude-marketplace.js) so the Claude local marketplace and settings are updated after pull (reads `ENABLE_LOCAL_AGENT_CLAUDE` from `.envrc.local` / `.env`). If you pull with rebase or nothing was new, run `pnpm run sync:claude-marketplace` when you want to sync.

## Other hook options (not used here)

- **post-checkout** — Runs after `git checkout` (branch or file). Could sync after branch switch; we use post-merge for “after pull” instead.
- **post-rewrite** — Runs after `git commit --amend` or `git rebase`. Would run after `git pull --rebase`; we don’t currently hook it.
- **pre-commit / commit-msg** — Lint, format, or validate commits; not used for sync.

See [githooks](https://git-scm.com/docs/githooks).
