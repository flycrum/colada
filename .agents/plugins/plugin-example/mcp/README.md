# MCP (Model Context Protocol)

## Purpose

MCP lets the plugin expose tools/resources to the agent via a server config. Use when the plugin integrates an external service or tool (e.g. Figma MCP, database). Config typically at plugin root as `.mcp.json`, not in an mcp/ folder; this README documents the concept.

### Good examples

- .mcp.json at plugin root with mcpServers entry (e.g. Figma, Postgres)
- Plugin that bundles MCP server config for a third-party service

### Bad examples

- Putting MCP config in a subfolder if the platform expects root .mcp.json (check Cursor/Claude docs)

## Claude code intricacies

Claude Code: MCP in plugin via `.mcp.json` or manifest `mcpServers`. [MCP](https://code.claude.com/docs/en/mcp).

## Cursor intricacies

Cursor: `.mcp.json` at plugin root; or `mcpServers` in plugin.json. [MCP](https://cursor.com/docs/context/mcp). Auto-discovered.

## Other coding agent intricacies

N/A
