# Hooks

## Purpose

Hooks are event-driven automation (e.g. afterFileEdit, beforeShellExecution). Use when the plugin should run scripts on agent events. Not every plugin needs hooks.

### Good examples

- afterFileEdit: run formatter or linter on edited file
- beforeShellExecution: validate or block certain shell commands

### Bad examples

- Using hooks for static guidance (use rules)
- Using hooks when no automation is needed

## Claude code intricacies

Claude Code: hooks in `hooks/hooks.json`; [Hooks](https://code.claude.com/docs/en/hooks). Same event model as Cursor where applicable.

## Cursor intricacies

Cursor: hooks in `hooks/hooks.json`; [Hooks](https://cursor.com/docs/agent/hooks). Events: afterFileEdit, beforeShellExecution, sessionEnd, etc.

## Other coding agent intricacies

N/A
