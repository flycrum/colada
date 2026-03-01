---
description: Opt-in and automatic setup for the Colada local marketplace in Claude Code; no manual /plugin steps
---

# Add Colada marketplace (automatic)

## Purpose

Get the Colada plugin marketplace (colada-plugins) and all its plugins available in Claude Code with **no manual slash commands**. The only manual steps are opting in via env and (once per clone) enabling git hooks; the rest is driven by the **post-merge** git hook and the sync script.

## Steps (only opt-in + one-time setup are manual)

1. **Opt-in:** Copy root [.env.example](../../../../.env.example) to **.envrc.local** (gitignored; you own it, never commit). Set `ENABLE_LOCAL_AGENT_CLAUDE=true` there. With [direnv](https://direnv.net/), root [.envrc](../../../../.envrc) loads `.envrc.local` when you `cd` into the repo.

2. **Enable git hooks (once per clone):** From repo root run **`pnpm run setup:githooks`**. This sets `git config core.hooksPath .githooks` so the repo’s [.githooks](../../../../.githooks) run. The **post-merge** hook then runs [scripts/sync-claude-marketplace.js](../../../../scripts/sync-claude-marketplace.js) after every successful **git pull** (when pull does a merge), creating/updating `.claude-plugin/marketplace.json` and `.claude/settings.json` per your env. If you haven’t pulled yet after enabling hooks, run **`pnpm run sync:claude-marketplace`** once to sync now.

3. **Use:** Open this project in Claude Code. The app reads the generated `.claude/settings.json`; the marketplace and plugins are already registered and enabled. You do **not** run `/plugin marketplace add .` or `/plugin install …@colada-plugins`. If your Claude Code version prompts once to install marketplaces/plugins for the project, accept the prompt.

4. **New plugins:** Adding a new plugin under `.agents/plugins/<name>/` with a `.claude-plugin/plugin.json` is enough. The next **git pull** (or `pnpm run sync:claude-marketplace`) will include it in the marketplace and in `enabledPlugins`; no developer action required.

5. **Disable:** Set `ENABLE_LOCAL_AGENT_CLAUDE=false` in `.envrc.local`, then run **`pnpm run sync:claude-marketplace`** (or pull and let the post-merge hook run); the script surgically removes our marketplace fields (clean slate). See [enable-flags-and-script.md](../rules/enable-flags-and-script.md).
