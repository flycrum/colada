# Agents

## Purpose

Agents are custom agent configurations/personas (e.g. security reviewer, code reviewer). Use when the plugin defines a distinct persona or behavior set. Not every plugin needs agents.

### Good examples

- security-reviewer: persona that checks for vulnerabilities
- code-reviewer: persona that reviews PRs with specific checklist

### Bad examples

- Adding an agent when the plugin only has reference rules (rules/ is enough)
- Using agent for one-off workflows (use command or skill)

## Claude code intricacies

Claude Code uses **subagents** (custom agent definitions in `agents/`). Same idea as Cursor agents. [Subagents](https://code.claude.com/docs/en/sub-agents).

## Cursor intricacies

Cursor: agents in `agents/` as .md, .mdc, .markdown; [Agents](https://cursor.com/docs/context/agents). Custom agent configs with name, description in frontmatter.

## Other coding agent intricacies

N/A
