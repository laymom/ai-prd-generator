# AI feature PRD generator for Claude Code — decide failure handling, human review, and evaluation before you build

**For people planning a feature that uses an LLM or ML model, before it goes to engineering.** You first get a short list of the decisions still open. They include what happens when the answer is wrong and who approves. They also include how you'll know a prompt or model change is safe. Each decision comes with options and who should decide. Then the PRD is built with you in 4 approval stages. So it records your choices instead of guessing them. Every claim is labeled by where it came from. Its AI appendix turns those decisions into requirements and acceptance criteria. This matters because those decisions cover the usual ways AI features go wrong after launch. Those are confident but wrong output, review nobody owns, regressions nobody notices, and cost or response time above plan ([why](#why-these-ai-sections)).

## Example

Real run in Claude Code, staged mode. Input: `/ai-prd-generator AI-drafted replies for customer inquiries at a small online shop` (the shop is fictional). Excerpts, unedited except where marked `[…]`:

```text
## Decisions still open before this AI feature ships
**1. What happens when the AI might fabricate an order, tracking link, or promise?**
- *Why it matters for this AI feature*: LLMs invent plausible-looking order numbers, dates, and policies. A tired reviewer at the end of a 40-inquiry day can send a confident-looking lie.
- Options (`AI assumption`): (a) The prompt is only allowed to use data pulled from Shopify; if it's missing, the draft says "insufficient data — write manually" […] (b) The draft shows every fact it used […] in a sidebar […] (c) Both (a) and (b).
- Who decides: shop owner
- Label: `Open question`
**2. What customer data is sent to the LLM API?**  […]
**3. Who can approve which reply — you, the part-timer, or both for anything?**  […]
**4. Which cases must pass before a prompt or model change goes live?**  […]
**5. Cost cap behavior and a response-time limit for the chat widget**  […]
```

Four of the five were decided during the run (one by approving the assistant's pick after saying "you decide"). The fifth, which customer data is sent to the model, stayed open and is repeated at the top of the saved PRD. Decision 4 became this acceptance criterion:

> **AC-7.2** Given the eval set runs, When any pinned case fails its expected-output criteria (category correct, routing correct, no fabricated order facts for order-status cases, no owner-only keyword leaking into a staff-approvable draft), Then the deployment is **blocked**. **100% pass bar.** — `Approved decision`

Full conversation, the saved PRD, and a comparison with plain chat: [examples/ai-reply-drafts-prd.md](examples/ai-reply-drafts-prd.md)

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

## Copy-paste input

```text
/pm Our 5-person support team answers the same refund questions by hand every day. I want a tool that drafts replies from our help-center articles, and an agent approves each one before it is sent. It must not store customer card numbers.
```

Replace `/pm` with `/ai-prd-generator` if you installed the skill. Write in any language; the questions and the PRD follow the language you write in.

## What you get

1. **First: "Decisions still open before this AI feature ships"** — up to 5 items. Each has the decision, why it matters for an AI feature, 2–3 options, who should decide (a role), and a label. Things you already decided are left off. In staged mode it comes with the Stage 1 summary; in draft mode it is the first thing in the reply.
2. **Then: the full PRD**, saved as a file, with the still-open decisions repeated at the top (and a "Decided during this run" line under them).

```text
/pm <idea>
   │
   ├─ Stage 1  Discovery — problem · users · evidence · JTBD + "Decisions still open"   🚪 gate
   ├─ Stage 2  Scope — In-scope · Non-goals · measurable success criteria               🚪 gate
   ├─ Stage 3  User stories + Given/When/Then acceptance criteria                       🚪 gate
   └─ Stage 4  Full 12-block PRD + AI appendix → handoff                                🚪 gate
```

- **Staged (default)** — it stops at each of the 4 gates and waits for your OK, so nothing is marked as decided until you decided it.
- **Draft mode** — ask for a one-shot draft ("draft mode", "just write the whole PRD"). It starts with the open-decisions list, writes everything in one pass, labels every choice you haven't approved `AI assumption`, and ends with the assumptions that most need your confirmation.
- **It asks only what's missing**, and "I don't know" is fine — the point becomes an `AI assumption` or an `Open question`. Mid-way scope additions get an impact note (schedule, complexity, goal) and you decide.
- **Not an AI feature after all?** If no LLM or ML model is used, it says so and continues as a normal PRD without the AI appendix. Words like "recommend" or "automate" alone don't count as AI, because those features can be rule-based.

**The PRD's 12 blocks:** summary, problem + JTBD, users/personas, success criteria, scope, non-goals, user stories, acceptance criteria, dependencies and 4-axis risk, launch/rollback plan, measurement plan, open questions.

**The AI appendix (5 blocks):** prompt spec · safety (output policy for this use case, sensitive data, model choice) · hallucination + fallback · human-in-the-loop UX · eval set + regression. Each open decision lands in its block — as a requirement and acceptance criterion if you decided it, as an `Open question` with its options if not.

**Evidence labels** on every claim: `User-provided fact` · `Sourced fact` (with link) · `Real user research` · `AI assumption` · `Synthetic persona response` · `Approved decision` · `Open question`. A target the assistant proposed stays `AI assumption` until you approve that specific item.

## Why these AI sections

Design rationale: each AI section exists to block one way model-based features commonly go wrong. The sources below describe these risks; they are not evidence that this tool produces better products.

| Section | Gap it is meant to close | Source (what it says) |
|---|---|---|
| Hallucination + fallback (AI-C) | Output that is wrong but sounds confident, with no defined next step | NIST AI 600-1 defines confabulation as "the production of confidently stated but erroneous or false content (known colloquially as 'hallucinations' or 'fabrications')". Google's People + AI Guidebook: AI "will fail at some point", and "the product needs to provide ways for the user to continue their task"; when it fails, "often the easiest path forward is to let the user take over". |
| Human-in-the-loop (AI-D) + "who should decide" | Review that nobody owns | NIST AI RMF 1.0, Map 3.5: "Processes for human oversight are defined, assessed, and documented". Govern 2.1: roles and responsibilities "are documented and are clear". |
| Eval set + regression (AI-E) | A prompt or model change breaks things and nobody notices | NIST AI RMF 1.0, Measure 2.1: "Test sets, metrics, and details about the tools used during TEVV are documented". Manage 3.2: pre-trained models are "monitored as part of AI system regular monitoring". People + AI Guidebook on "background errors" that neither user nor system notices: "you'll need a dedicated quality assurance process". |
| Safety — sensitive data (AI-B) | Customer data sent to or logged by a model provider without a decision | NIST AI RMF 1.0, Measure 2.10: "Privacy risk of the AI system … is examined and documented." |
| Cost and response-time limits | Spend or latency above plan | Design choice of this tool; no external source cited. |

## Compared with plain chat

Same scenario, plain Claude Code with no skill, one prompt ([full output](examples/ai-reply-drafts-baseline-plain-chat.md)). Plain chat answered in about 40 seconds with a readable one-page PRD, and raised a few useful points the skill's PRD didn't (prompt caching to cut cost, whether to tell customers replies are AI-assisted, a link allowlist). It asked no questions, so it filled gaps with numbers you never gave ("baseline ~45 min", a $50/month cost target, "Owner: Shop operations") without marking them as guesses. It had no list of open decisions or who decides them, no Given/When/Then acceptance criteria, and no fixed eval set or pass bar for prompt or model changes, and it proposed showing a "confidence signal" on drafts — a model's self-reported confidence, which this tool does not use as a gate. The skill run took 7 turns and about 14 minutes of model time.

## Limits · compatibility

- **Tested in Claude Code only.** The skill installs via the standard skills format, so other agents that read that format can install it — but it has not been tested in them, and features such as background subagents or the AskUserQuestion tool may not exist there (the instructions fall back to plain conversation).
- **The output is a draft for you to own.** Labels make the assistant's assumptions visible; they don't make them correct. The open-decisions list is a starting set, not a complete risk review.
- **Synthetic personas are not user research.** Their output stays labeled as hypotheses.
- **Length.** A staged run is a multi-turn conversation, and the full PRD is long. If you only need the open decisions, stop after Stage 1.
- **Maintainers:** `commands/pm.md` and `skills/ai-prd-generator/SKILL.md` must have the same body. Run `node scripts/check-sync.js` (Node, no dependencies) after editing either; it exits 1 if they differ. CI fails if the skill and command bodies drift.

## Optional: extra discovery skills (third-party)

`/pm` works fully without these. Nothing above needs them.

If they are installed, Stage 1 can also use three discovery skills: Opportunity Solution Tree, assumption identification, and assumption prioritization. They are **a separate project** by another author: [phuryn/pm-skills](https://github.com/phuryn/pm-skills) (MIT License, Paweł Huryn), in its `pm-product-discovery` plugin. To install them with the Claude Code CLI (commands from the pm-skills README):

```bash
claude plugin marketplace add phuryn/pm-skills
claude plugin install pm-product-discovery@pm-skills
```

Without them, that one helper step is skipped and everything else works the same.

## Related tools

Small, independent tools by the same author. Use any of them on its own; none requires the others.

- [multi-agent-brainstorm](https://github.com/laymom/multi-agent-brainstorm) — explore and compare ideas from 5 perspectives
- [synthetic-focus-group](https://github.com/laymom/synthetic-focus-group) — explore reactions and risky assumptions with simulated personas
- [ai-prd-generator](https://github.com/laymom/ai-prd-generator) — decide failure handling, human review, and evaluation for an AI feature, then write the PRD
- [consulting-ux-strategy](https://github.com/laymom/consulting-ux-strategy) — audit flows, information architecture, and usability, then prioritize fixes

When passing output between them, keep the evidence labels (User-provided fact, Sourced fact, Real user research, AI assumption, Synthetic persona response, Approved decision, Open question). Simulated persona responses stay labeled as synthetic in every downstream document.

## Sources · license · changelog

- NIST, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile* (NIST AI 600-1, July 2024) — https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf (section 2.2, Confabulation)
- NIST, *AI Risk Management Framework 1.0* (2023), Section 5, AI RMF Core — https://airc.nist.gov/airmf-resources/airmf/5-sec-core/ (Govern 2.1, Map 3.5, Measure 2.1, Measure 2.10, Manage 3.2)
- Google PAIR, *People + AI Guidebook*, chapter "Errors + Graceful Failure" — https://pair.withgoogle.com/chapter/errors-failing/
- Jobs-to-be-Done, Given/When/Then acceptance criteria, and the four product risks (value, usability, feasibility, viability) are widely used product-management practices; this tool applies them as a checklist.
- The optional discovery skills are by Paweł Huryn — [phuryn/pm-skills](https://github.com/phuryn/pm-skills) (MIT). They are linked, not redistributed here.

```text
skills/ai-prd-generator/SKILL.md   # skill format (npx skills add) → /ai-prd-generator
commands/pm.md                     # slash command → /pm — same body
scripts/check-sync.js              # checks the two bodies match
.github/workflows/check-sync.yml   # runs check-sync.js on every push and pull request
examples/                          # a real run and a plain-chat baseline
```

MIT — see [LICENSE](LICENSE). Covers this tool only. Changes are listed in [CHANGELOG.md](CHANGELOG.md).

Built by **Sophia in Korea — a non-engineer who ships agents anyway.**
