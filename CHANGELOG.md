# Changelog

## 1.1.0 — 2026-10-12

### Added
- `skills/ai-prd-generator/SKILL.md`, so the tool installs with `npx skills add laymom/ai-prd-generator --skill ai-prd-generator` and runs as `/ai-prd-generator`. The `/pm` command stays
- `scripts/check-sync.js` (Node, no dependencies): exits 1 if the bodies of `commands/pm.md` and the SKILL.md differ
- Seven evidence labels shared with the author's other tools: User-provided fact, Sourced fact, Real user research, AI assumption, Synthetic persona response, Approved decision, Open question
- A "Hypotheses to validate" section, separate from Discovery evidence; synthetic persona output goes there
- Draft mode: a one-shot PRD on request, with every unapproved choice labeled AI assumption
- A handoff brief when no architecture, planning, or design tool exists in the environment

### Changed
- The instructions are now in English; questions and the PRD follow the language the user writes in. The evidence label names stay in English in every language (a translation in parentheses is allowed), replacing the per-language "(assumption)" label
- Stage 1 asks only for missing core context, in one short batch, instead of 5–7 questions every time
- "I don't know" / "later" is no longer pressed with follow-up questions; it becomes an AI assumption or an Open question. The former "you decide" handling is unified with draft mode
- Scope additions are no longer moved to Non-goals automatically; the impact on schedule, complexity, and the goal is stated and the user decides
- Assumed success metrics, launch criteria, and rollback criteria are labeled AI assumption until the user confirms them
- AI appendix: no longer triggered by keywords alone; it first confirms that an LLM or ML model is actually used and its role, and separates rule-based from model-based parts. Safety uses a per-use-case output policy instead of a fixed forbidden list. Model self-reported confidence is no longer used as a threshold; measurable acceptance checks and failure handling are used instead. Eval cases are marked as run or not yet run
- README reordered (who gets what, example, install, input, what happens, how it differs, limits, related tools, sources). The synthetic-focus-group link no longer describes simulated output as user evidence

### Fixed (in ba871e9, 2026-10-12)
- Assumption label now follows the user's language instead of a fixed Korean label
- Claims about other PRD templates softened
- Environment-specific steps (subagents, AskUserQuestion, review checkpoints, handoff agents) made optional with a plain-conversation fallback
- Install steps completed for macOS/Linux and Windows PowerShell, with the PRD save location; "Tested in Claude Code only" stated
- Optional pm-skills install corrected to the `pm-product-discovery` plugin commands

## 1.0.0 — 2026-06-19

- Initial release: `/pm` slash command
