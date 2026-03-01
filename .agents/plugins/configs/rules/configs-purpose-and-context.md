# Configs purpose and context

- Single source for build, lint, test, type-check config. Avoid duplicate options and workarounds across workspaces
- Shared configs in [configs/](../../../configs); workspaces extend or import via `workspace:*`
- Prefer extend/merge over copy; one workaround per concern (fix once in shared helper)
- Path options (`include`, `exclude`, `rootDir`, `outDir`) resolve relative to the config file—keep in workspace tsconfigs; shared tsconfigs = non-path compiler options only
