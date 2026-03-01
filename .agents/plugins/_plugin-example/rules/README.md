# Rules / context

## Purpose

Rules (context) are persistent guidance and reference material that shape agent behavior. Use for: always-on constraints, project conventions, coding standards. When to use: when the guidance applies across many tasks or files.

### Good examples

- One rule file per concern (e.g. naming, types, structure). Use `rules/` for "how we write code here"
- Use `.md` for rule files so content stays agent-agnostic; Cursor still discovers them
- Optionally link between rule files; keep each file DRY, focused, and succinct

### Bad examples

- Putting step-by-step workflows that the user triggers manually in rules (use a command)
- Putting specialized playbooks the agent should auto-invoke in rules only (consider a skill)
- Creating `AGENTS.md` inside a plugin; context lives in `rules/`
- Using `.mdc` for plugin rules (Cursor-only format); not agent-agnostic

## Claude code intricacies

- Claude Code has no dedicated "rules" concept; uses **CLAUDE.md** (and optionally `.claude/rules/*.md`) for project-level context
- Plugin context lives in the `rules/` folder (e.g. CLAUDE.md or modular .md files there), not in an `AGENTS.md` file

## Cursor intricacies

- Cursor has a dedicated **rules** concept: `.mdc` files with `description`, `alwaysApply`, `globs`; discovery in `rules/`; plugin manifest can point to `rules`
- In this plugin system use **`.md` only** in `rules/` so the same files work for Cursor and Claude; `.mdc` is Cursor-specific—avoid for shared plugin content
- Plugin context lives in `rules/`, not in an `AGENTS.md` file

## Other coding agent intricacies

GitHub Codex uses AGENTS.md for project instructions and `.rules` under `~/.codex/rules/` for shell-command allow/prompt/forbidden; different from Cursor/Claude plugin rules.
