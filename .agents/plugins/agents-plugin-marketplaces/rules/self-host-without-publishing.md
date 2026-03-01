# Self-host without publishing

- Single env-gated script ([sync-claude-marketplace.js](../../scripts/sync-claude-marketplace.js)) creates/updates or removes our marketplace fields; no publish. Opt-in: `ENABLE_LOCAL_AGENT_CLAUDE=true` in .envrc.local. See [automatic-only-opt-in.md](./automatic-only-opt-in.md)
- New plugin: add `.agents/plugins/<name>/` with both plugin.json manifests; script discovers via `.claude-plugin/plugin.json` scan. `_plugin-example` excluded from manifests
- Clean slate: `ENABLE_LOCAL_AGENT_CLAUDE=false`; script removes our fields
