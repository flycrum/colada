# Git plugin

## Purpose

Commit staged files, craft message, push. Agent-facing command for consistent commit flow.

## Requirements

- When user invokes commit/push for staged files: follow [git-commit-staged-files](commands/git-commit-staged-files.md)
- Never commit on main; never delete/rename branches or force-push unless user says so. Push fails → stop, report
