# Colada

Monorepo for the Colada ecosystem:

- shared tooling in `configs/`
- publishable packages in `packages/`
- example apps in `examples/` (e.g. **colada-store-examples** – Vite + Vue 3 using colada-store)

## AI Agents

Our AI Agents strategy revolves around:

- using AI-agent-agnostic [AGENTS.md](https://agents.md/) file at the repo root so any agent or tool can read one place for conventions and commands.
- root [AGENTS.md](./AGENTS.md) file for tech stack, commands, package overview, etc.

**Scripts:**

- `pnpm install` – install deps
- `pnpm build` – colada-store → dist/ (.js + .d.ts)
- `pnpm lint` - root ESLint
- `pnpm type-check` – TS check
- `pnpm test` – Vitest
- `pnpm format` – Prettier
