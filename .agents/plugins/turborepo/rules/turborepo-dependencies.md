# Turborepo dependencies

- **External:** From registry; `pnpm add <pkg>` in workspace or `--filter`. Shared tooling in root devDeps; app/package-specific in workspace
- **Workspace:** Under configs/examples/packages. Use `workspace:*` for inter-workspace deps. Name `@colada/<pkg>`; dir path separate. Turbo `^build` runs deps first
- **Root overrides:** [package.json](../../../package.json) `pnpm.overrides` pin versions monorepo-wide. Use for core framework, build/tooling; not for package-only or version-flexible deps
