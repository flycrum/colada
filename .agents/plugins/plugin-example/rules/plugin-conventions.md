# Plugin conventions

## Purpose

All plugin context (Cursor: rules; Claude Code: rough equivalent CLAUDE.md) lives in **rules/**. No AGENTS.md in plugins. Context and "rules" terminology are interchangeable.

## Contained unit

Each plugin is meant to be a contained unit of a technology, domain, system, discipline, or other natural grouping of content that would benefit from colocated rules/context/skills/commands/agents/hooks/scripts and other ai agent instructions.

## Self-reference

Plugin-example is both the documentation and the example for building and maintaining AI agent plugins. When generating or updating a plugin (including this one), self-reference this plugin, be succinct, limit size,and condense documentation sacrificing grammar for concision; concept folders can have any number of files but stay succinct. Codex uses a cap (e.g. ~32–64 KB); Claude loads the whole file into context, so a long file uses a lot of tokens. Effectiveness: "Most effective AGENTS.md files have 6–10 rules and 3–5 command references. Longer files see diminishing returns—agents start ignoring buried instructions." Target is under ~150 lines; start with 10–15 lines and iterate.

## Organization

Centralize content in standard markdown in rules/; use **`.md`** not `.mdc` (`.mdc` is Cursor-specific, not agent-agnostic). Cursor/Claude manifests point to shared files. Structure: [Cursor starter-advanced](https://github.com/cursor/plugin-template/tree/main/plugins/starter-advanced) (rules, skills, agents, commands, hooks, scripts, assets) plus .claude-plugin/ per [Figma mcp-server-guide](https://github.com/figma/mcp-server-guide/tree/83b11c0bc199a3c6ee87df0a0bd460139fa72cdc). When to add skills vs commands vs agents vs hooks: skills = specialized capability, model-invoked or manual; commands = agent-executable steps; agents = custom persona; hooks = event automation. Agents/hooks not always needed. See [Cursor Building plugins](https://cursor.com/docs/plugins/building), [Claude Code Create plugins](https://code.claude.com/docs/en/plugins) for specifics.
