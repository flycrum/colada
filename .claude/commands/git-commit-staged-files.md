# Git Commit Staged Files

**Audience:** AI agent. **Style:** Extremely concise; sacrifice grammar for concision.

Commit staged files, craft message, push. All output/responses: terse.

## ⛔ CRITICAL - NEVER

- Rename/delete local branches (unless user says so)
- Delete remote branches (never)
- Force-push to fix branch issues → report, wait

Push fails → stop, report, wait. No workarounds.

---

## 🛑 STOP IF ON MAIN

**First check.** Before anything else.

1. `git rev-parse --abbrev-ref HEAD`
2. If `main`: STOP. No staged check, no git ops. Tell user `🛑🛑🛑 CRITICAL: Cannot commit on main branch! 🛑🛑🛑` (commits on feature branches only). Abort.
3. Else: continue.

---

## ⚠️ STOP IF NO STAGED FILES

**Second check.**

1. `git diff --cached --name-only`
2. If none: STOP. Tell user `🛑🛑🛑`, suggest `git add`. Do not run steps below.
3. Else: continue.

## Writing Guidelines

- Write for the target audience of AI Agents
- Keep condensed and succinct; sacrifice grammar for concision
- Exclude punctuation at end of bullet points or end of lines

---

## Steps (only if pre-checks pass)

1. **Story ID**
   - `git rev-parse --abbrev-ref HEAD` → extract ID from branch. Patterns: `LADA-XXXX`, `AI-XXXX`, `ABC-1234` (prefix-dash-numbers).
   - Examples: `flycrum/LADA-1980-my-branch` → `[LADA-1980]`; `flycrum/AI-28-hello` → `[AI-28]`. No match → no prefix.

2. **Review + complexity**
   - `git diff --cached` → what changed (since last commit; not chat iteration).
   - `git diff --cached --stat` → file count, +/- lines, new/deleted files.
   - Classify: refactor/config/small fix | multi-file feature | arch/breaking.
   - **SIMPLE**: ≤3 files, ≤50 lines, refactor/config/small fix.
   - **MEDIUM**: 4–10 files or 51–200 lines, not arch/breaking.
   - **COMPLEX**: >10 files or >200 lines or arch/breaking/major feature.

3. **Commit message** (concise; fragments OK)
   - **Subject**: `[STORY-ID] Verb + specific change` (e.g. component/util/folder name). No "fix bug"/"update code".
   - **Body** by complexity:
     - **SIMPLE**: 1–3 short sentences or fragments. No bullets unless needed. Example: "Drop redundant :root CSS; Tailwind v4 @theme covers it."
     - **MEDIUM**: 2–4 bullet fragments. Example: "Token expiry handling. Auto-refresh on expire. Secure refresh storage."
     - **COMPLEX**: Short sections + bullets; rationale/impact only where needed.
   - Focus: what changed + why. Not process. Format: `[ID] Subject\n\nBody`.

4. **Commit**  
   `git commit -m "<subject>" -m "<body>"`. Fold in any user context if given.

5. **Push**  
   `git push --force-with-lease`. Fail → stop, report, do not fix.

6. **Confirm**  
   Hash + summary. Push success.

7. **Post-commit checks** (identify + report only; don’t auto-fix)
   - Committed list: `git show --name-only --pretty=format: HEAD`
   - **7a. Adjacent .md**: Same dir — same-base `.md`, `README.md`, `CHANGELOG.md`. Stale refs/examples? → `🚨🚨🚨` + paths.
   - **7b. .agents/plugins/**: Grep `.agents/plugins/` for file paths, component/API names, examples. Stale? → `⚠️⚠️⚠️` + paths.
   - **7c. Tests**: Expected locations — Ruby: `app/…` → `test/…_test.rb`; TS/JS/Vue: colocated `*.spec.ts`/`*.test.ts`. Exists? Needs updates for new/changed/removed? Missing for testable code? → report only.
   - **Summary**: One line per category. `✅` up-to-date, `🟡` needs attention (short reason). Categories: adjacent .md, .agents/plugins/, tests, related code. All ✅ → "in sync."

## Examples

**Usage:** `/git-commit-staged-files` → story ID from branch, analyze staged, message, commit, push, run checks.

**Subjects:**  
Good: `[LADA-1980] Add token expiry handling in AuthService`  
Bad: `Fix bug`, `Update code`

**Bodies (concise/fragments):**

- SIMPLE: "Drop :root CSS; @theme covers it." Not: long sections.
- MEDIUM: "Token expiry. Auto-refresh. Secure refresh storage." Not: essay or one word.
- COMPLEX: Short sections + bullets. Not: one line.
- Never: "Worked on bug. Several attempts." (process, not change)
