# Current configs

- Inventory: [configs/](../../../configs). Prefer over per-workspace duplication.

| Package | Exports | Purpose |
|--------|---------|---------|
| **@colada/typescript-config** | base.json, library.json, node.json, declaration.json | Shared compiler options; path options stay in workspace |
| **@colada/eslint-config** | base, base.js | Shared ESLint flat config |
| **@colada/prettier-config** | (Prettier resolution) | Shared formatting |
| **@colada/vite-config** | ., ./base | viteBuildBase; merge into workspace build |
| **@colada/vitest-config** | ., ./base | defineVitestConfig + vitestBase; type assertion once |

- **Usage:** tsconfig extend preset + workspace `include`/`exclude`. Vite: `import { viteBuildBase }`, spread into build. Vitest: `defineVitestConfig({ ... })`. ESLint/Prettier: extend or reference per existing usage.
