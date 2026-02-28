# Commands

## Purpose

Commands are agent-executable step lists: repeatable workflows you intentionally trigger (e.g. via `/` in chat). Use when the task is a defined sequence of steps the user or agent runs on demand.

### Good examples

- create-workspace: steps to add a new monorepo workspace
- add-type-test: steps to create a \*.test-d.ts file and run tests
- Command = manually triggered; repeatable workflow

### Bad examples

- Using a command for domain knowledge the agent should auto-apply when relevant (use a skill or rule)
- Using a command for always-on constraints (use rules)

### Commands vs skills

- Commands = manually triggered with `/`; repeatable workflows you intentionally run
- Skills = invoked manually or **autonomously by the agent** when relevant; specialized playbooks
- Good command: "run these steps."
- Bad command: using a skill for a one-off step list the user always triggers manually (use a command instead)

## Claude code intricacies

- Claude Code supports commands in plugins; agent-executable markdown in `commands/` folder
- Custom slash commands have been merged into skills
  - A file at `.claude/commands/review.md` and a skill at `.claude/skills/review/SKILL.md` both create `/review` and work the same way
  - Existing .claude/commands/ files will keep working

## Cursor intricacies

Commands in `commands/` as .md, .mdc, .markdown, .txt; described in [Building plugins](https://cursor.com/docs/plugins/building). Triggered manually.

## Other coding agent intricacies

N/A
