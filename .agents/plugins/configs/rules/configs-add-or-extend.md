# Add or extend a config

- **New config:** When two+ workspaces repeat same tool config and tool supports extend/merge: create `configs/<name>-config/` (package.json, exports, shared slice in JS, types if consumed from TS). Document in [configs-current.md](./configs-current.md); refactor workspaces to extend/import; add workspace deps. See existing [configs/](../../../configs) packages for pattern.
- **Extend existing:** New workspace uses same tooling → same devDeps and extend/import per configs-current. New shared option for all consumers → add to shared base in config package.
- **Tsconfig gotcha:** Extended config paths resolve relative to that config file. Put only non-path options (e.g. compilerOptions) in shared tsconfig; each workspace sets `include`, `exclude`, `rootDir`/`outDir` locally.
- **DRY checklist:** Identify repeated slice → add to existing config or create package → document → refactor workspaces → verify build/typecheck.
