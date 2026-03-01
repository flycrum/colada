# Writing rules, commands, skills (DRY and lean)

## Purpose

Plugin subfolder content (rules/, commands/, skills/) must be DRY and lean so agents get signal without token bloat. Align with Cursor and Claude guidance.

## Requirements

- **Reference, don't copy.** Point to canonical examples or code; do not paste full snippets or duplicate what's in the codebase. Cursor: "Reference files instead of copying their contents—this keeps rules short."
- **One concern per file.** Focus each rule/command on a single concern. Split large rules; keep under ~500 lines (Cursor). Prefer multiple short rules over one long one.
- **Fragments over prose.** Use bullet fragments; sacrifice grammar for concision. No trailing punctuation on bullets. Avoid long "Purpose" or "Relation" paragraphs.
- **No redundant Relation sections.** Do not add a "## Relation" that only lists other rule files; plugin root AGENTS.md already links rules. Omit Relation unless cross-plugin or non-obvious.
- **No edge-case bloat.** Cursor: "Adding instructions for edge cases that rarely apply: Keep rules focused on patterns you use frequently." Document the common path; link to official docs for the rest.
- **Commands: steps only.** Commands are agent-executable step lists. Numbered steps or short bullets; no long rationale in the command file. Put context in rules.
- **Skills: purpose + when to use.** SKILL.md: brief purpose, when the agent should invoke it, and steps or links. No essays.
- **Platform intricacies:** One short rule per platform (e.g. claude-code-intricacies, cursor-intricacies) with bullets only; link to official docs for details.
