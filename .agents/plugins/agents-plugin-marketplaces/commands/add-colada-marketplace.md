---
description: Opt-in and automatic setup for the Colada local marketplace in Claude Code; no manual /plugin steps
---

# Add Colada marketplace (automatic)

## Purpose

Get the Colada plugin marketplace (colada-plugins) and all its plugins available in Claude Code with **no manual slash commands**. The only manual step is opting in via env; the rest is driven by **pnpm:devPreinstall** and generated config.

## Steps (only opt-in is manual)

1. **Opt-in:** Copy root [.env.example](../../../../.env.example) to **.envrc.local** (gitignored; you own it, never commit). Set `ENABLE_LOCAL_AGENT_CLAUDE=true` there. With [direnv](https://direnv.net/), root [.envrc](../../../../.envrc) loads `.envrc.local` when you `cd` into the repo.

2. **Install:** From repo root run `pnpm install`. The **pnpm:devPreinstall** script runs and creates/updates (when deps are available). **Known limitation:** on first clone or after nuking node_modules, the script exits gracefully without syncing (so `pnpm install` never fails); run `pnpm run sync:claude-marketplace` or run `pnpm install` again after the first install:
   - `.claude-plugin/marketplace.json` (marketplace catalog; plugins discovered from `.agents/plugins/*/.claude-plugin/plugin.json`)
   - `.claude/settings.json` (`extraKnownMarketplaces` and `enabledPlugins` for all discovered plugins)

3. **Use:** Open this project in Claude Code. The app reads the generated `.claude/settings.json`; the marketplace and plugins are already registered and enabled. You do **not** run `/plugin marketplace add .` or `/plugin install …@colada-plugins`. If your Claude Code version prompts once to install marketplaces/plugins for the project, accept the prompt.

4. **New plugins:** Adding a new plugin under `.agents/plugins/<name>/` with a `.claude-plugin/plugin.json` is enough. The next `pnpm install` (or `pnpm run sync:claude-marketplace`) will include it in the marketplace and in `enabledPlugins`; no developer action required.

5. **Disable:** Set `ENABLE_LOCAL_AGENT_CLAUDE=false` in `.envrc.local`, run `pnpm install` again; the script surgically removes our marketplace fields (clean slate). See [enable-flags-and-script.md](../rules/enable-flags-and-script.md).
