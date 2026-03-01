# Configs plugin

## Purpose

DRY shared configuration for the Colada monorepo. All reusable tool config (TypeScript, ESLint, Prettier, Vite, Vitest) lives under [configs/](../../../configs); workspaces extend or import instead of duplicating. This plugin documents the pattern, current configs, and how agents should add or change config so it stays single-source.

Agent-facing content: [rules/](./rules/). Reference [configs/](../../../configs) for implementation.
