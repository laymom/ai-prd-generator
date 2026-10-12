# /pm — AI-Aware PRD Generator

A Claude Code slash command that turns a vague idea into a **structured Product Requirements Document** through 4 human-gated stages — and, when the product involves AI, automatically appends a **5-block AI-feature spec** that many PRD templates don't include.

It owns **WHAT and WHY** (problem, users, scope, acceptance criteria). It hands off **HOW** (architecture, planning, design) to later steps.

## Why it's different

Two things set it apart from a generic "write me a PRD" prompt:

1. **4 gates, not one dump.** Discovery → Scope → User Stories → Full PRD. You explicitly approve at each gate, so the document is built *with* you, not guessed at. Non-goals are a required section (the anti-scope-creep safety valve), and unsupported claims are labeled `(assumption)` — or the equivalent in your language — instead of being passed off as fact.

2. **An AI-feature appendix.** If the product touches LLMs/agents/automation, you get 5 extra blocks that are easy to miss until after launch:
   - **Prompt Spec** — system/user prompts, input variables, versioning
   - **Safety / Alignment** — forbidden outputs, sensitive-data handling, model-choice rationale
   - **Hallucination + Fallback** — failure scenarios, confidence thresholds, deterministic fallback
   - **Human-in-the-Loop UX** — edit / regenerate / reject / approve flows
   - **Eval Set + Regression** — 5–20 test cases pinned as a baseline, re-run on prompt/model change

## How it works

```text
/pm <one-line idea, or nothing>
   │
   ├─ Stage 1  Discovery — problem · users · why now · evidence · JTBD     🚪 gate
   ├─ Stage 2  Scope — In-scope · Non-goals · measurable success metrics   🚪 gate
   ├─ Stage 3  User stories + Given/When/Then acceptance criteria          🚪 gate
   └─ Stage 4  Full 12-block PRD  (+ AI appendix if relevant)  → handoff   🚪 gate
```

The 12-block PRD covers summary, problem+JTBD, personas, success metrics, scope, non-goals, user stories, acceptance criteria, dependencies & 4-axis risk, launch/rollback plan, measurement plan, and open questions.

## Installation

This is a slash command. Clone the repo and copy `pm.md` into your Claude Code commands directory.

**macOS / Linux**

```bash
git clone https://github.com/laymom/ai-prd-generator.git
mkdir -p ~/.claude/commands && cp ai-prd-generator/commands/pm.md ~/.claude/commands/
```

**Windows (PowerShell)**

```powershell
git clone https://github.com/laymom/ai-prd-generator.git
New-Item -ItemType Directory -Force "$HOME\.claude\commands" | Out-Null; Copy-Item ai-prd-generator\commands\pm.md "$HOME\.claude\commands\"
```

Then start a new Claude Code session and type `/pm`. The finished PRD is saved to `prd/PRD-<slug>-YYYYMMDD.md` in your current working directory.

Tested in Claude Code only.

### Optional: Stage 1 discovery skills

Stage 1 can optionally invoke three discovery skills (Opportunity Solution Tree, assumption identification, assumption prioritization). These are **a separate project** — [**phuryn/pm-skills**](https://github.com/phuryn/pm-skills) (MIT License, Paweł Huryn). All three are in its `pm-product-discovery` plugin. To install with the Claude Code CLI (commands from the pm-skills README):

```bash
claude plugin marketplace add phuryn/pm-skills
claude plugin install pm-product-discovery@pm-skills
```

`/pm` works fine without them (it just skips that step).

## Usage

```text
/pm a tool that summarizes my unread emails every morning
/pm
```

(Run it bare to start from the Discovery questions.)

## Pairs well with

This command sits at the **WHAT/WHY** stage of a product workflow. Two companion skills slot in around it:

- [**synthetic-focus-group**](https://github.com/laymom/synthetic-focus-group) — gather qualitative user evidence for Stage 1 Discovery
- [**consulting-ux-strategy**](https://github.com/laymom/consulting-ux-strategy) — take the finished PRD into UX strategy, IA, and journey design

## License

MIT — see [LICENSE](LICENSE). Covers the `/pm` command itself. The optional Stage 1 skills are a separate MIT project (phuryn/pm-skills) and are **not** redistributed here — only linked.

## Credits

Built by **Sophia in Korea — a non-engineer who ships agents anyway.** The optional Stage 1 discovery skills are by Paweł Huryn ([phuryn/pm-skills](https://github.com/phuryn/pm-skills), MIT).
