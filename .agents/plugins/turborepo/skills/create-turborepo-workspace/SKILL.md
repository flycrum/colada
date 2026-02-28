---
name: create-turborepo-workspace
description: Add a new workspace, package, example, or config to the Colada monorepo. Use when user asks to create a new workspace, add a package, add an example app, or add a config. Follow rules in this plugin and run the create-workspace command for steps.
---

# Create Turborepo workspace

## When to use

- User asks to add a new workspace, package, example, or config to the monorepo
- User asks to create a new package under packages/, examples/, or configs/

## Instructions

1. Read [turborepo-new-workspace.md](../../rules/turborepo-new-workspace.md) and [turborepo-general.md](../../rules/turborepo-general.md) for categories, naming, configs, samples
2. Execute the steps in [commands/create-workspace.md](../../commands/create-workspace.md): pick category, create dir, add package.json with @colada/ scope, apply shared configs, reference samples
3. Ensure pnpm-workspace.yaml globs include the new path; use workspace:* for cross-workspace deps
