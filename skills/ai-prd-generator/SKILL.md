---
name: ai-prd-generator
description: Turn a vague product idea into a PRD (product requirements document) with problem, users, scope, non-goals, user stories, and Given/When/Then acceptance criteria, through 4 user-approved stages or a one-shot draft on request. Every claim carries an evidence label. Adds an appendix for AI features (prompt spec, safety, hallucination fallback, human-in-the-loop, eval set) only when an LLM or ML model is actually used. Use when the user wants to write a PRD, define product requirements, pin down scope and non-goals, or turn an idea into user stories and acceptance criteria.
---

# /pm — AI-Aware PRD Generator

Turn a vague idea into a **PRD focused on WHAT and WHY** (problem, users, scope, non-goals, user stories, acceptance criteria). HOW (architecture, implementation planning, design) is handed off to later steps.

Write questions and the PRD in the language the user writes in.

## Core principles

- **4 gated stages** — at the end of each stage, do not move to the next stage until the user explicitly approves (in staged mode; see "Two modes").
- **Ask only what is missing** — do not re-ask anything the user already gave (problem, target users, constraints, and so on). Ask only for missing core context, batched into one short message.
- **Never press** — if the user says "I don't know", "you decide", or "later", do not ask follow-ups on that point. Record it as an `AI assumption` or an `Open question` and move on.
- **Parallel subagents (optional)** — if the environment supports subagents, run background research during intake and handoff. If it does not, skip this and do everything sequentially in the conversation.
- **Evidence labels** — every claim in the PRD carries one of the 7 labels below. Keep the assistant's guesses separate from facts (user answers, code, documents).

## Evidence labels

Use these exact label names. Keep them in English even when the PRD is written in another language (a translation in parentheses is fine), so labels survive handoff between tools.

| Label | Use for |
|---|---|
| `User-provided fact` | Something the user stated about their situation, data, or constraints |
| `Sourced fact` | A fact from a document, code, or web page — always include the link or file path |
| `Real user research` | Observations, quotes, interviews, reviews, logs, or data from real people |
| `AI assumption` | Anything the assistant inferred, proposed, or filled in without confirmation |
| `Synthetic persona response` | Output from simulated personas (for example a synthetic focus group). Never evidence; it goes under "Hypotheses to validate" |
| `Approved decision` | A specific choice the user explicitly approved |
| `Open question` | Something not yet decided or not yet known |

Rules:
- `User-provided fact` is only for what the user actually said. Do not use it for your restatement, rounding, or extension of their words (for example a per-person average the user never gave).
- An AI-proposed item becomes `Approved decision` only when the user explicitly accepted that specific item. An item shown at a gate and approved there counts. Anything added or changed after that gate stays `AI assumption` until it is shown at a later gate and approved. Approving a stage in general does not turn items the user never saw (metric targets, launch steps, rollback thresholds, logging fields, review actions) into approved decisions.
- Every number, threshold, timeout, pass rate, and rule in the PRD carries a label. User stories may share one label line per story.
- Never write that a gate is approved before the user's answer arrives. A file saved before Gate 4 says which gates are approved so far (for example "Gates 1–3 approved; Gate 4 pending").
- Owner, author, reviewer, and contact fields: only names the user gave. Otherwise write "TBD — `Open question`". Never fill them with an account name, email address, or anything else taken from the environment.
- "Users will probably want this" is not evidence. Label it `AI assumption`.
- `Synthetic persona response` is never placed under "Discovery evidence". It goes under "Hypotheses to validate", together with how it could be checked with real users.

## Two modes

- **Staged mode (default)** — the 4 gates below. Wait for explicit approval at each gate.
- **Draft mode** — use only when the user explicitly asks for a one-shot draft (for example "just write the whole PRD", "give me a full draft", "do it all yourself"). Skip the gate waits and produce all 4 stages in one pass, then save the PRD. Every choice the user has not approved is labeled `AI assumption`, and every unknown is listed as an `Open question`. At the end, list the assumptions that most need the user's confirmation. The user can switch back to staged mode at any time.
- "You decide" about a single point does not switch modes: fill that point with an `AI assumption` and keep the gates.

---

## Procedure

### Stage 1 — Discovery (problem, users, why now)

**Core context checklist.** First read what the user already gave. Then ask only for items that are still missing, in one short batched message (use the AskUserQuestion tool if it exists; otherwise ask in plain text). Do not ask all of these by default — usually 1–3 questions are enough:

1. **Problem** — what problem or pain to solve (current state vs. desired state)
2. **Target users** — who will use it (the user themselves? a team? external customers?)
3. **Why now** — the trigger for solving it now (deadline, event, occasion)
4. **Current alternative** — how it is handled today (manually? another tool? unsolved?)
5. **References** — similar services or features they have seen (name or link)
6. **Constraints** — anything that is absolutely ruled out (budget, time, technology, security)
7. **(Optional) One-line vision** — what it should look like when done

Problem, target users, and constraints are the core items. Items 3–7 can be filled later or recorded as `Open question`.

**In parallel (only if background subagents are available)** — if not, skip this and, when useful, offer in text: "Shall I research similar features or cases separately?"
- Codebase scan subagent → scan the workspace for similar features or code ("don't build what already exists")
- (When relevant) Research subagent → external similar cases and market research (isolated context, returns a cited report; cited facts are labeled `Sourced fact` with links)

**Additional outputs**:

- **JTBD one-liner (Jobs-to-be-Done)** — state the value hypothesis in this format:
  > "When [situation], [user] wants to [job]"
  > Example: "When a site manager starts the day, they want to check yesterday's work results within 5 seconds"

- **Discovery evidence** — prevents a guesswork PRD. Cite 1–2 of the following, each labeled:
  - The user's own experience or observation ("I do this by hand every time") — `User-provided fact`
  - Direct quotes from colleagues or users — `Real user research`
  - Excerpts from reviews of similar services — `Real user research` or `Sourced fact` (with link)
  - A line of data or logs (if available) — `Real user research` or `User-provided fact`
  ⚠️ Guesses like "users would probably want this" are not evidence. If there is no evidence, say so and label the claim `AI assumption`.

- **Hypotheses to validate** — separate list for `AI assumption` items and any `Synthetic persona response` input (for example output from a synthetic focus group). Never mix these into Discovery evidence. For each, note how it could be checked with real users.

- **(Optional) Discovery helper skills** — the 3 external skills below can be invoked during the stages (used automatically if installed; `/pm` works without them):
  - **`opportunity-solution-tree`** (Teresa Torres OST): invoke when the user pitched a solution. Work backward through an outcome → opportunity → solution tree to avoid locking in a solution too early. List 1–2 alternative solutions alongside.
  - **`identify-assumptions-new`** (8 risk categories): invoke for a new business or product concept. Identify risky assumptions across Value, Usability, Viability, Feasibility, Ethics, Go-to-Market, Strategy, and Team.
  - **`prioritize-assumptions`** (Impact × Risk): invoke after assumptions are identified. Prioritize with the matrix and suggest test experiments.

  📌 These 3 helper skills are from [phuryn/pm-skills](https://github.com/phuryn/pm-skills) (MIT License, Paweł Huryn). They are **separate** from this tool. All 3 are in that repo's `pm-product-discovery` plugin and connect once installed with the Claude Code commands from its README (`claude plugin marketplace add phuryn/pm-skills` → `claude plugin install pm-product-discovery@pm-skills`). If they are not installed, skip this step.

Combine the user's answers, subagent results, and the outputs above → output a **one-page Discovery summary**, with labels.

➕ (Optional) Checkpoint: if a review subagent is available, run a gate self-assessment (✅/⚠️/🚨) and report the result to the user along with the summary → then the gate. If not, skip this and go straight to the gate.

🚪 **GATE 1**: "Are this problem definition, JTBD, and evidence right?" — do not enter Stage 2 until the user explicitly approves.

---

### Stage 2 — Scope & Success Criteria (scope, non-goals, success metrics)

Based on Discovery, write:

- **In scope** — what to build this time (a concrete feature list)
- **Non-goals** — what will not be built this time (explicitly excluded)
- **Success criteria** — measurable metrics (for example "conversion rate +X%", "user completes it within 30 seconds"). Targets the assistant proposes are `AI assumption` until the user confirms the value.
- **MVP vs. Full** — separate the first-release scope from later phases (when relevant)

⚠️ Non-goals are the key section — the safety valve against scope creep. If something obvious is missing from both lists, the assistant asks first: "This one is out of scope, right?"

**When the user adds scope** ("let's add this too"): do not automatically push it to Non-goals. State its impact on schedule, complexity, and the goal (does it serve the JTBD or dilute it?), then let the user decide: add it, move it to Non-goals, or split it into a follow-up PRD.

➕ (Optional) Checkpoint: if a review subagent is available, run a gate self-assessment → then the gate. If not, skip.

🚪 **GATE 2**: "Can these non-goals really be left out, and are the success criteria measurable?" — do not enter Stage 3 until approved.

---

### Stage 3 — User Stories & Acceptance Criteria

Break each in-scope item into:

**User story**:
```text
As a [user role]
I want [desired action]
So that [value gained]
```

**Acceptance criteria** (Given/When/Then):
```text
Given [precondition]
When [triggering action]
Then [expected result]
```

⚠️ Acceptance criteria must be **measurable and observable**. No vague wording such as "it should work well".

➕ (Optional) Checkpoint: if a review subagent is available, run a gate self-assessment → then the gate. If not, skip.

🚪 **GATE 3**: "Are all acceptance criteria really measurable?" — do not enter Stage 4 until approved.

---

### Stage 4 — Save the full PRD + handoff

**Write the 12-block PRD** (every claim carries an evidence label):

1. **One-line summary** — what, for whom, and why
2. **Problem/opportunity + JTBD** — Stage 1 Discovery summary + JTBD one-liner. Include "Discovery evidence" and, separately, "Hypotheses to validate"
3. **Target users / personas** — separate primary and secondary users
4. **Success criteria** — measurable metrics (Stage 2). Unconfirmed targets are labeled `AI assumption`
5. **Scope (In)** — features to build (Stage 2)
6. **Non-goals (Out)** — what will not be built, with reasons (Stage 2)
7. **User stories** — Stage 3
8. **Acceptance criteria** — Given/When/Then (Stage 3)
9. **Dependencies & risks** — external dependencies (APIs, teams, legal, approvals) + 4 risk axes:
   - **Value risk**: users may not use it
   - **Usability risk**: users may find it hard even if they use it
   - **Feasibility risk**: it may not be technically possible
   - **Viability risk**: even if built, it may not fit the business or organization
   One line of mitigation per risk.
10. **Launch & rollback plan** — rollout order (for example: yourself → team → everyone), rollback triggers (for example "stop automatically if failures exceed 3 per week"), and where it is monitored (logs, dashboard). Unless the user confirmed them, launch criteria and rollback criteria are labeled `AI assumption`.
11. **Measurement & analytics plan** — how the success criteria will be measured:
    - Names of events, logs, or metrics to track (for example `signup_completed`, `feature_activated`)
    - Dashboard or log location (for example an analytics tool or log pipeline)
    - Review cadence (for example "daily in the first week after launch, weekly after that")
12. **Open questions** — anything not decided yet (including what the HOW decisions must address)

**Save location**: `prd/PRD-<slug>-YYYYMMDD.md`
- `<slug>`: English kebab-case (for example `notification-center`, `onboarding-v2`)
- Date: the date the PRD is written, YYYYMMDD
- After saving, run the "Final check" (below) on the file and fix it before showing Gate 4.

**In parallel (optional)**: if agents, skills, or commands for architecture, planning, or design actually exist in the environment, call them **in parallel** when the user wants, to produce a HOW and design draft at the same time. If none exist, do not pretend to call them — output a **handoff brief** only (see below).

➕ (Optional) Checkpoint: if a review subagent is available, run a gate self-assessment → helps the handoff decision. If not, skip.
➕ Right after saving the full PRD: if a review subagent is available, call it once in deep-review mode → per-dimension review report → helps the handoff decision. If not, skip.

🚪 **GATE 4**: Choose the handoff direction. Options A–E apply only when the corresponding agent, skill, or command actually exists in the environment; otherwise offer the handoff brief instead of calling anything.
- A. Call the planning step (break implementation into steps)
- B. Call the architecture step (system design)
- C. Call architecture + planning in parallel and compare
- D. Call the design step (design draft, if the PRD has UI or screens)
- E. B+D or C+D in parallel (structure + design together)
- F. Stop here (keep the PRD only; build later)

**Handoff brief** (when no handoff tool exists, or when the user picks F and wants a brief): a short block the user can paste into any later step — PRD path, one-line summary, in-scope list, non-goals, the acceptance criteria that matter most for HOW, open questions, and the `AI assumption` items that most need confirmation. Keep the evidence labels as they are.

---

## AI-feature PRD appendix (conditional)

Attach the **5-block AI appendix** after the 12 blocks only when the product actually uses an LLM or ML model.

- Words like "recommend", "automate", "classify", "summarize", "translate", "agent", or "chatbot" are a signal, not a trigger. On their own they do not trigger the appendix — the same feature can be rule-based.
- When such a signal appears, confirm with the user (or from the material they gave): is an LLM or ML model actually used, and what role does it play (for example: generates text, classifies input, ranks items, extracts fields, decides an action)?
- Distinguish **rule-based** (fixed rules, filters, templates, scheduled jobs — no model) from **model-based** (an LLM, ML model, or model behind an API such as GPT or Claude, including MCP tools that call a model). Attach the appendix only for model-based parts, and say which parts those are. If it is unclear, record it as an `Open question` and ask.
- If the user says "this isn't an AI feature", skip the appendix.

### AI-A. Prompt Spec

- Write the system prompt and user prompt separately
- List the input variables (for example `{user_query}`, `{previous_conversation}`, `{today_date}`)
- Version (v1.0, v1.1, and so on — any change triggers regression checking)

### AI-B. Safety / Alignment guardrails

- **Output policy per use case** — do not paste a one-size forbidden-output list. Define what this specific feature must never output, must flag, or must hand to a human, based on its users and domain (for example: a customer-support bot vs. an internal summarizer have different policies). Typical areas to consider: abusive language, sensitive data, statements about competitors, legal or medical advice — include only those that apply, with the reason.
- Sensitive data handling (for example personal data, customer names, internal revenue — masking, no logging)
- Model choice rationale (large vs. medium vs. small — cost, speed, and accuracy trade-offs)

### AI-C. Hallucination risk + fallback

- Hallucination scenarios (for example non-existent URLs, non-existent function names, quotes from non-existent people)
- **No self-reported confidence as probability** — a model's own statement of confidence is not a calibrated probability. Instead, write measurable acceptance criteria (for example "every cited URL resolves", "extracted fields match the source document in N of M eval cases", "output passes the schema validator") and say what happens when a check fails (for example the output is labeled "needs review" for the user)
- **Classifiers and thresholds** — for each component that classifies, routes, or filters, state whether it is rule-based (keywords, regex, fixed rules) or model-based. Never gate on a model's self-reported confidence. Gate on a rule, or on a measured score that was calibrated on labeled examples, and say how it will be measured (for example "precision ≥ X on N labeled inquiries").
- Deterministic fallback (for example when the AI fails: a predefined template, a "can't answer" message, or the previous cached result)

### AI-D. Human-in-the-Loop (HITL) UX

- Design flows that let the user **edit, regenerate, reject, and approve** AI output
- A good pattern: AI draft → review agent → queue → human approval gate → send (4-step HITL)
- Choose between an automatic approval gate (full automation) and an explicit approval gate (approval email, checkbox)

### AI-E. Eval set + regression

- 5–20 test cases to re-check on prompt or model changes (expected input + expected output or pass criteria)
- Mark each case's status: **Run** (actually executed, with the observed result and date) or **Not yet run** (only the expected result / pass criteria are defined). Never present a case as passed unless it was actually run.
- A good pattern: pin a baseline with a regression suite (for example pass bar PASS ≥ N / FAIL ≤ M)
- Re-run cadence after launch (for example on every prompt change, weekly, or automatically on a schedule)

---

## Final check — run on the finished PRD before sending

Run this on the saved PRD before presenting it or Gate 4. Fix the file until every answer is "yes". Check what each sentence means; checking for specific words is not enough.

1. Is every `User-provided fact` something the user actually said, not a figure or rule you derived from what they said?
2. Was every `Approved decision` shown to the user as that specific item and approved by them? Is everything added or changed after its gate still labeled `AI assumption`?
3. Does every sentence about approval match what the user has answered so far? Does nothing claim a gate is approved before the user's answer to that gate?
4. Does every number, threshold, timeout, pass rate, and rule carry a label (one shared label line per user story is enough)?
5. For every classifier, filter, or threshold: does the PRD say whether it is rule-based or model-based? Does no threshold depend on a model's self-reported confidence, and does each measured score say how it will be measured?
6. Do owner, author, reviewer, and contact fields contain only names the user gave, with "TBD — `Open question`" everywhere else, and no account name or email address from the environment?

---

## Boundaries with other workflows

| Stage | Tool | Output |
|---|---|---|
| **WHAT/WHY** | `/pm` (this tool) | PRD (requirements, scope, acceptance criteria) |
| **HOW — strategy** | Planning step | Implementation steps, files, trade-offs |
| **HOW — structure** | Architecture step | System design, architecture |
| **HOW — comparing approaches** | multi-plan (if installed; otherwise skip and suggest the next step in text) | Comparison of several approaches |

The PRD produced by `/pm` is the input to the tools above — when they exist in the environment. Otherwise it travels as the handoff brief.

---

## Handling user responses

- **"I don't know" / "later"**: don't press. Record it as an `Open question` (or fill it with a clearly labeled `AI assumption` when the PRD needs a value to continue) and move on.
- **"You decide"** about a point: fill it with an `AI assumption`. Gates stay in place (staged mode).
- **"Just write the whole thing" / one-shot draft request**: switch to draft mode (see "Two modes").
- **Scope additions** ("let's add this too"): state the impact on schedule, complexity, and the goal; let the user decide (add, Non-goals, or a follow-up PRD). Do not move it to Non-goals automatically.
- **Revision requests**: go back to the relevant gate and continue from there.

---

## First message template

```text
📋 Starting /pm — we'll build the PRD in 4 gated stages (say "draft mode" if you'd rather get a one-shot draft).

Stage 1 (Discovery). From what you wrote I have: [problem / users / constraints already given].
A few things are still missing:
[only the missing core questions, 1–3 of them]

While you answer, in the background I'll:
- scan the workspace for similar features
- (if relevant) look up similar external cases
```

Include the "While you answer, in the background…" paragraph only when subagents are available. Otherwise drop it and just ask the questions. Write the message in the user's language.
