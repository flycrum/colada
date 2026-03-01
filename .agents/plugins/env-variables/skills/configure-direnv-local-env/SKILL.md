---
name: configure-direnv-local-env
description: Explain and configure direnv and local env for this repo. Use when the user asks what .envrc is, how to set up direnv, how to configure local env vars, or why dotenv/source_env_if_exists appear in .envrc.
---

# Configure direnv and local env

## When to use

- User asks what `.envrc` or `.envrc.local` is
- User asks how to set up or install direnv
- User asks how to configure local env vars (e.g. ENABLE_LOCAL_AGENT_*) or where to put them
- User is confused by `dotenv` or `source_env_if_exists` in [.envrc](.envrc)

## Instructions

1. **Explain direnv:** direnv loads env when you `cd` into the repo; it runs root [.envrc](../../../../../../.envrc). User must install direnv and hook it into their shell, then run `direnv allow` once in repo root. See root [.envrc.agents.md](../../../../../../.envrc.agents.md) for full explanation of each line (`source_env_if_exists .envrc.local`, `dotenv`).

2. **Local config workflow:** Copy root [.env.example](../../../../../../.env.example) to **.envrc.local** at repo root (gitignored; never commit). Edit the `export ENABLE_LOCAL_AGENT_*` lines. Root [.envrc](../../../../../../.envrc) loads `.envrc.local` when present. Variables and semantics: [variables.md](../../rules/variables.md), [where-to-define.md](../../rules/where-to-define.md).

3. **Do not** duplicate long explanations here; link to [.envrc.agents.md](../../../../../../.envrc.agents.md) and [.agents/plugins/env-variables](../../) rules.
