# Skills

## Purpose

Skills are specialized capabilities the agent can invoke manually or autonomously when it deems them relevant. Use for: domain playbooks, "when doing X use this capability."

### Good examples

- create-turborepo-workspace: when user asks to add a workspace, use this skill + command
- writing-type-tests: when writing \*.spec-d.ts, use this skill
- Skill = specialized playbook; agent may auto-invoke when relevant

### Bad examples

- Using a skill for a one-off step list the user always triggers manually (use a command)
- Using a skill for always-on constraints (use rules)

### Commands vs skills

Skills = invoked manually or **autonomously by the agent** when relevant; specialized playbooks/knowledge. Commands = manually triggered; repeatable workflows. Good: skill for "when the agent is doing X, use this capability." Bad: using a command for domain knowledge the agent should auto-apply (use a skill or rule).

## Claude code intricacies

- Claude Code: skills in `skills/<name>/SKILL.md`; model-invoked; namespaced as `/plugin-name:skill-name`. [Skills](https://code.claude.com/docs/en/skills)
- Custom slash commands have now been merged into skills. A file at .claude/commands/review.md and a skill at .claude/skills/review/SKILL.md both create /review and work the same way. Your existing .claude/commands/ files keep working.

## Cursor intricacies

Cursor: skills in `skills/`; each subdir with SKILL.md; [Agent Skills](https://cursor.com/docs/context/skills). Discovery automatic; manifest can override path.

## Other coding agent intricacies

N/A
