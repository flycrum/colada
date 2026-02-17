# PR Generate Description

Generate PR description by diffing current branch vs parent, analyzing changes, filling template.

## Purpose

Compare branch vs parent, analyze diffs/commits, output copy-paste-ready PR markdown.

## Steps

1. **Current branch** – `git rev-parse --abbrev-ref HEAD`

2. **Parent branch** (priority order):
   - Reflog: `git reflog show --all | grep "CURRENT" | grep "branch:" | head -5` – look for `Created from refs/heads/PARENT` or `checkout: moving from PARENT to CURRENT`
   - Normalize: strip `refs/heads/`, `origin/X` → `X`
   - Verify: `git branch -a | grep PARENT`, `git merge-base HEAD PARENT` = parent tip
   - Merge-base: first commit on branch → parent commit; `git branch -a --contains MERGE_BASE | grep -v CURRENT`; verify merge-base = candidate tip
   - Sequential: extract prefix+number from branch name, find sibling branches, check merge-base = candidate tip
   - Fallback: `main` or `master`
   - Output at top of PR: `**🎯 PARENT BRANCH: name 🎯**`

3. **Gather changes**
   - `git diff PARENT...HEAD --stat` `--name-only`
   - `git log PARENT..HEAD --oneline`
   - `git diff PARENT...HEAD` (full diff for analysis)

4. **Analyze**
   - Functionality added/removed/changed
   - Architecture, patterns, deps, docs
   - Breaking changes, migrations
   - Feature flags, trebuchets, config
   - Testing, deployment notes

5. **Fill template**
   - Description: 2–3 sentences, problem + approach
   - Screenshots: N/A unless visual changes
   - What changed: numbered list, logical groups, succinct items
   - Technical/testing: flags, step-by-step instructions
   - Deployment: N/A unless env vars, migrations, etc.

6. **Output**
   - Markdown code block, copy-paste ready
   - Do not save to file; output in response

## Output format

```markdown
### Description

### Screenshots / recordings

N/A

### What changed

### Technical details & testing instructions

### Deployment notes

N/A
```

## Guidelines

- Specific, not generic
- What + why, not how/process
- Group logically, be concise
- Exclude trailing punctuation on bullets/lines
- Target: AI agents
