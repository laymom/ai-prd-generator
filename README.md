# AI PRD Generator

**Anyone with a product idea gets a PRD — problem, users, scope, non-goals, user stories, and testable acceptance criteria — built with them in 4 approval gates, with every claim labeled by where it came from, plus an AI-feature appendix when the product really uses an LLM or ML model.**

## Example

Real run in Claude Code (user answers role-played by an AI; see run notes). Input: `/ai-prd-generator AI-drafted replies for customer inquiries at a small online shop`. Excerpts from the saved PRD, unedited:

Header, saved before the last gate:

- **Status**: Gates 1–3 approved; Gate 4 pending
- **Owner**: TBD — `Open question`

Success criteria, with evidence labels:

| # | Metric | Target | Label |
|---|---|---|---|
| S1 | Daily minutes each person spends on the top 3 repetitive topics | **≤ 30 min/day** (down from 60–120) | `Approved decision` (target) + `User-provided fact` (current state) |
| S2 | Median time from inquiry received → reply sent, 9am–6pm | **≤ 15 minutes** | `AI assumption` (user does not currently track; measurement method is an `Open question`) |

One acceptance criterion and its label line:

- **AC-3.2** — *Given* no matching Shopify order is found, *When* the topic is `order_status`, *Then* `status = "needs full review"`; the system must not fabricate an order status.

Labels: Shopify integration `Approved decision`; 60-s freshness `Approved decision`; order-matching rules `AI assumption`.

From the AI appendix — how the topic classifier is gated:

**Classifier and thresholds** (per the skill's rule — never gate on self-reported confidence):
- Topic classifier is **LLM-based**, prompted with an explicit label set `{shipping, returns, order_status, other}`.
- Gating is done on **measured accuracy against the 20-case eval set** (AC-5.3: ≥ 90% at launch), not on the LLM's own confidence.
- Re-measured on every prompt/model change (see AI-E).

Full conversation through all 4 gates, and the complete PRD: [examples/ai-reply-drafts-prd.md](examples/ai-reply-drafts-prd.md)

## Install

The same instructions ship in two formats. The name you type depends on which one you install:

| Installed as | Location | You type |
|---|---|---|
| Skill | `.claude/skills/ai-prd-generator/SKILL.md` | `/ai-prd-generator` |
| Slash command | `.claude/commands/pm.md` | `/pm` |

**Option A — as a skill, via the [skills CLI](https://github.com/vercel-labs/skills):**

```bash
npx skills add laymom/ai-prd-generator --skill ai-prd-generator
```

**Option B — copy by hand.** Clone, create the destination folder, copy, then start a new Claude Code session.

macOS / Linux:

```bash
git clone https://github.com/laymom/ai-prd-generator.git

# as a skill → /ai-prd-generator
mkdir -p ~/.claude/skills/ai-prd-generator
cp ai-prd-generator/skills/ai-prd-generator/SKILL.md ~/.claude/skills/ai-prd-generator/

# or as a command → /pm
mkdir -p ~/.claude/commands
cp ai-prd-generator/commands/pm.md ~/.claude/commands/
```

Windows (PowerShell):

```powershell
git clone https://github.com/laymom/ai-prd-generator.git

# as a skill → /ai-prd-generator
New-Item -ItemType Directory -Force "$HOME\.claude\skills\ai-prd-generator" | Out-Null
Copy-Item ai-prd-generator\skills\ai-prd-generator\SKILL.md "$HOME\.claude\skills\ai-prd-generator\"

# or as a command → /pm
New-Item -ItemType Directory -Force "$HOME\.claude\commands" | Out-Null
Copy-Item ai-prd-generator\commands\pm.md "$HOME\.claude\commands\"
```

First run: start a new Claude Code session and type `/ai-prd-generator` (skill) or `/pm` (command), optionally followed by a one-line idea. The finished PRD is saved to `prd/PRD-<slug>-YYYYMMDD.md` in your current working directory.

### Optional: Stage 1 discovery skills

Stage 1 can use three discovery skills (Opportunity Solution Tree, assumption identification, assumption prioritization). They are **a separate project** — [phuryn/pm-skills](https://github.com/phuryn/pm-skills) (MIT License, Paweł Huryn), in its `pm-product-discovery` plugin. To install with the Claude Code CLI (commands from the pm-skills README):

```bash
claude plugin marketplace add phuryn/pm-skills
claude plugin install pm-product-discovery@pm-skills
```

Without them, that step is skipped and everything else works.

## Copy-paste input

```text
/pm Our 5-person support team answers the same refund questions by hand every day. I want a tool that drafts replies from our help-center articles, and an agent approves each one before it is sent. It must not store customer card numbers.
```

Replace `/pm` with `/ai-prd-generator` if you installed the skill. Write in any language; the questions and the PRD follow the language you write in.

## What happens

```text
/pm <idea>
   │
   ├─ Stage 1  Discovery — problem · users · why now · evidence · JTBD        🚪 gate
   ├─ Stage 2  Scope — In-scope · Non-goals · measurable success criteria     🚪 gate
   ├─ Stage 3  User stories + Given/When/Then acceptance criteria             🚪 gate
   └─ Stage 4  Full 12-block PRD (+ AI appendix if a model is used) → handoff 🚪 gate
```

- **It asks only what's missing.** If your first message already names the problem, users, and constraints, it doesn't ask again — it asks a short batch of the missing core questions.
- **"I don't know" is fine.** It doesn't press. The point becomes an `AI assumption` or an `Open question`.
- **Scope additions are your call.** If you add a feature mid-way, it tells you the impact on schedule, complexity, and the goal, and you decide whether to add it, exclude it, or split it into a follow-up PRD.
- **Handoff.** Architecture, planning, or design steps are called only if such skills or commands exist in your environment. Otherwise you get a short handoff brief to paste wherever you go next.

### Two modes

- **Staged (default)** — it stops at each of the 4 gates and waits for your OK.
- **Draft mode** — ask for a one-shot draft ("draft mode", "just write the whole PRD"). It skips the waits and writes everything in one pass; every choice you haven't approved is labeled `AI assumption`, and it ends with the assumptions that most need your confirmation.

### Evidence labels

Every claim in the PRD carries one of these labels:

`User-provided fact` · `Sourced fact` (with link) · `Real user research` · `AI assumption` · `Synthetic persona response` · `Approved decision` · `Open question`

Assumed success metrics, launch criteria, and rollback criteria stay `AI assumption` until you confirm them. Simulated persona output (for example from a synthetic focus group) goes under **Hypotheses to validate**, never under Discovery evidence.

### The 12 blocks and the AI appendix

The PRD covers: summary, problem + JTBD, users/personas, success criteria, scope, non-goals, user stories, acceptance criteria, dependencies and 4-axis risk, launch/rollback plan, measurement plan, and open questions.

The AI appendix is added only after confirming that an LLM or ML model is actually used and what it does. Words like "recommend", "automate", or "classify" alone don't trigger it, because those features can be rule-based. The 5 blocks:

- **Prompt Spec** — system/user prompts, input variables, versioning
- **Safety / Alignment** — an output policy defined for this use case (not a generic forbidden list), sensitive-data handling, model-choice rationale
- **Hallucination + Fallback** — failure scenarios, measurable acceptance checks and what happens on failure (a model's self-reported confidence is not treated as a probability), deterministic fallback
- **Human-in-the-Loop UX** — edit / regenerate / reject / approve flows
- **Eval Set + Regression** — 5–20 cases, each marked as actually run or not yet run (expected result / pass criteria only)

## How it differs

- **From a one-prompt "write me a PRD":** the document is built through gates you approve (or a draft whose unapproved parts are labeled as such), Non-goals are a required section, and every claim says where it came from.
- **From a generic PRD template:** the AI-feature appendix covers prompts, safety policy, hallucination fallback, human review, and evals — the parts that are easy to miss until after launch.
- It covers WHAT and WHY only. HOW (architecture, implementation plan, design) is handed off.

## Limits · cost · compatibility

- **The final check reduces but does not eliminate label mistakes.** In a real run from a fresh install (see the example), a few numbers were still unlabeled, and one role was labeled `User-provided fact` although the user never said it. These are listed in the example's run notes. Check the labels before you rely on them.

- **Tested in Claude Code only.** The skill installs via the standard skills format, so other agents that read that format can install it — but it has not been tested in them, and features such as background subagents or the AskUserQuestion tool may not exist there (the instructions fall back to plain conversation).
- **The output is a draft for you to own.** Labels make the assistant's assumptions visible; they don't make them correct.
- **Synthetic personas are not user research.** Their output stays labeled as hypotheses.
- **Cost.** A staged run is a multi-turn conversation. Optional background research or review subagents, when available, use additional tokens.
- **Maintainers:** `commands/pm.md` and `skills/ai-prd-generator/SKILL.md` must have the same body. Run `node scripts/check-sync.js` (Node, no dependencies) after editing either; it exits 1 if they differ.

## Related tools

Small, independent tools by the same author. Use any of them on its own; none requires the others.

- [multi-agent-brainstorm](https://github.com/laymom/multi-agent-brainstorm) — explore and compare ideas from 5 perspectives
- [synthetic-focus-group](https://github.com/laymom/synthetic-focus-group) — explore reactions and risky assumptions with simulated personas
- [ai-prd-generator](https://github.com/laymom/ai-prd-generator) — turn an idea into a PRD with scope and acceptance criteria
- [consulting-ux-strategy](https://github.com/laymom/consulting-ux-strategy) — audit flows, information architecture, and usability, then prioritize fixes

When passing output between them, keep the evidence labels (User-provided fact, Sourced fact, Real user research, AI assumption, Synthetic persona response, Approved decision, Open question). Simulated persona responses stay labeled as synthetic in every downstream document.

## Sources · license · changelog

- Jobs-to-be-Done, Given/When/Then acceptance criteria, and the four product risks (value, usability, feasibility, viability) are widely used product-management practices; this tool applies them as a checklist.
- The optional discovery skills are by Paweł Huryn — [phuryn/pm-skills](https://github.com/phuryn/pm-skills) (MIT). They are linked, not redistributed here.

```text
skills/ai-prd-generator/SKILL.md   # skill format (npx skills add) → /ai-prd-generator
commands/pm.md                     # slash command → /pm — same body
scripts/check-sync.js              # checks the two bodies match
```

MIT — see [LICENSE](LICENSE). Covers this tool only. Changes are listed in [CHANGELOG.md](CHANGELOG.md).

Built by **Sophia in Korea — a non-engineer who ships agents anyway.**
