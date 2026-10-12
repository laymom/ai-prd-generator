# Changelog

## 1.1.0 — 2026-10-12

### Added
- `skills/ai-prd-generator/SKILL.md`, so the tool installs with `npx skills add laymom/ai-prd-generator --skill ai-prd-generator` and runs as `/ai-prd-generator`. The `/pm` command stays
- `scripts/check-sync.js` (Node, no dependencies): exits 1 if the bodies of `commands/pm.md` and the SKILL.md differ
- Seven evidence labels shared with the author's other tools: User-provided fact, Sourced fact, Real user research, AI assumption, Synthetic persona response, Approved decision, Open question
- A "Hypotheses to validate" section, separate from Discovery evidence; synthetic persona output goes there
- Draft mode: a one-shot PRD on request, with every unapproved choice labeled AI assumption
- A handoff brief when no architecture, planning, or design tool exists in the environment
- `examples/ai-reply-drafts-prd.md`: a real staged run in Claude Code 2.1.142 from a fresh project-level install (user answers role-played by an AI), with the full conversation and the saved PRD. The README Example section shows an excerpt

### Changed
- The instructions are now in English; questions and the PRD follow the language the user writes in. The evidence label names stay in English in every language (a translation in parentheses is allowed), replacing the per-language "(assumption)" label
- Stage 1 asks only for missing core context, in one short batch, instead of 5–7 questions every time
- "I don't know" / "later" is no longer pressed with follow-up questions; it becomes an AI assumption or an Open question. The former "you decide" handling is unified with draft mode
- Scope additions are no longer moved to Non-goals automatically; the impact on schedule, complexity, and the goal is stated and the user decides
- Assumed success metrics, launch criteria, and rollback criteria are labeled AI assumption until the user confirms them
- AI appendix: no longer triggered by keywords alone; it first confirms that an LLM or ML model is actually used and its role, and separates rule-based from model-based parts. Safety uses a per-use-case output policy instead of a fixed forbidden list. Model self-reported confidence is no longer used as a threshold; measurable acceptance checks and failure handling are used instead. Eval cases are marked as run or not yet run
- README reordered (who gets what, example, install, input, what happens, how it differs, limits, related tools, sources). The synthetic-focus-group link no longer describes simulated output as user evidence

### Fixed (found in a real run)
- `Approved decision` was given to items the user approved only by approving a whole stage, or never saw. Now only items shown at a gate and approved count; anything added or changed after a gate stays `AI assumption`
- `User-provided fact` was given to figures derived from the user's words. Now only what the user actually said
- A PRD saved before Gate 4 said "All 4 gates approved". A gate is no longer described as approved before the user answers
- Some numbers, thresholds, and user stories had no label. Every number, threshold, timeout, pass rate, and rule now carries one (one shared line per user story is allowed)
- A category classifier was gated on its "confidence" without saying whether it was a model. Each classifier or threshold now states rule-based or model-based, and model self-reported confidence is never a gate
- The PRD's Owner field was filled with the signed-in account's email address. Owner, author, and contact fields now hold only names the user gave, otherwise "TBD — Open question"
- Added "Final check — run on the finished PRD before sending": six yes/no questions on meaning, run on the saved file before Gate 4

### Fixed (in ba871e9, 2026-10-12)
- Assumption label now follows the user's language instead of a fixed Korean label
- Claims about other PRD templates softened
- Environment-specific steps (subagents, AskUserQuestion, review checkpoints, handoff agents) made optional with a plain-conversation fallback
- Install steps completed for macOS/Linux and Windows PowerShell, with the PRD save location; "Tested in Claude Code only" stated
- Optional pm-skills install corrected to the `pm-product-discovery` plugin commands

## 1.0.0 — 2026-06-20

- Initial release: `/pm` slash command
