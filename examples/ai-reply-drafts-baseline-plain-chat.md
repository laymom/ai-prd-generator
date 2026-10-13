# Baseline — the same scenario in plain chat (no skill)

| | |
|---|---|
| Input | `Write a PRD for AI-drafted replies to customer inquiries at a small online shop. 2 staff, ~40 inquiries/day by email and chat, an LLM drafts replies, staff approve before sending, small budget.` |
| Mode | One prompt, no follow-up turns |
| Model | `claude-opus-4-7[1m]` (main conversation). `claude-haiku-4-5-20251001` also appears in `modelUsage` — Claude Code's own background call |
| Claude Code version | 2.1.142 |
| Run date | 2026-10-13 |
| Environment | Fresh empty folder with **no skill installed**. Same isolation as the skill run: `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1`, `--setting-sources project`, `--strict-mcp-config`, user-level `~/.claude` and the repository clone not readable, Bash / WebSearch / WebFetch / AskUserQuestion disabled, `--permission-mode acceptEdits --allowedTools "Agent,Task,Read,Write,Edit,Glob,Grep"`. A probe in the same folder listed only Claude Code's built-in skills and no CLAUDE.md |
| Wall time | About 41 seconds |

The scenario is fictional. The reply below is unedited; it made no tool calls and did not save a file. For the comparison with the skill run, see [ai-reply-drafts-prd.md — Compared with plain chat](ai-reply-drafts-prd.md#compared-with-plain-chat).

## Reply (verbatim)

````text
# PRD: AI-Drafted Reply Assistant for Customer Inquiries

**Owner:** Shop operations
**Date:** 2026-10-13
**Status:** Draft

## 1. Problem

Two staff handle ~40 customer inquiries/day across email and chat. Volume is manageable but repetitive — order status, shipping, returns, product questions dominate. Response time slips during peak hours, and staff spend time retyping variations of the same answer instead of handling genuine edge cases.

## 2. Goal

Cut average time-to-reply by having an LLM draft every incoming inquiry's response. A human reviews, edits if needed, and clicks send. **No reply leaves the system without staff approval.**

### Success metrics (90 days post-launch)
- Median time from inquiry → sent reply: **≤ 15 min** during business hours (baseline ~45 min)
- % of AI drafts sent with no or minor edits: **≥ 60%**
- Customer satisfaction (CSAT thumbs on reply): **≥ baseline**
- LLM cost: **≤ $50/month**

## 3. Non-goals

- Fully autonomous replies (no human in the loop)
- Phone, social DM, or marketplace message channels
- Multilingual support beyond the shop's primary language
- Proactive outreach / marketing content
- Replacing the existing helpdesk tool

## 4. Users

- **Staff (2):** Primary users. Need fast review, obvious edit affordance, visible source of any claims the AI makes.
- **Customers:** Indirect. Should notice faster, consistent replies — not notice that AI is involved.

## 5. Scope & requirements

### 5.1 Inbound
- Pull new inquiries from the existing email inbox (IMAP or forwarding address) and chat widget (webhook or polling).
- Deduplicate threads; group follow-ups with the original.

### 5.2 Draft generation
- For each new inquiry, call the LLM with:
  - The customer message + prior thread
  - Order context if the email matches a customer (order status, tracking, items, return window)
  - A short shop knowledge base (shipping policy, returns, FAQs — markdown file, staff-maintained)
  - A tone/style guide (friendly, concise, uses shop's voice)
- Draft includes a confidence signal and, where applicable, inline citations ("per policy X", "order #1234 shipped 2026-10-10").
- If the model lacks context (e.g., unknown order, policy gap), draft explicitly flags "needs human input: ___" rather than guessing.

### 5.3 Review UI
- Single queue, sorted oldest-first, with channel badge.
- Side-by-side: customer thread | editable draft.
- One-click **Send**, **Edit & Send**, **Reject & Write Manually**, **Escalate** (for complaints/refunds above a threshold).
- Keyboard shortcuts for the two staff who'll live in this UI.

### 5.4 Guardrails
- **Hard stops** — never auto-draft/send for: refund requests, chargebacks, legal/complaint keywords, damaged goods, requests to speak to owner. Route to human with blank draft.
- No invented order numbers, prices, or policies. If a field isn't in the retrieved context, the draft must not state it.
- Max draft length cap; links allowed only from an allowlist (shop domain, carriers).

### 5.5 Learning loop
- Log original draft vs. final sent version (diff).
- Weekly: staff review the 10 most-edited drafts; update knowledge base or prompt accordingly.
- No automated fine-tuning in v1 — prompt + KB edits only.

## 6. Technical approach (lean)

- **Model:** Start with Claude Haiku 4.5 for drafts (cheap, fast). Escalate to Sonnet 4.6 only for threads > N turns or flagged complex.
- **Prompt caching:** Cache the system prompt + knowledge base (long, stable) so per-draft cost stays low. At ~40/day this is the single biggest cost lever.
- **Storage:** SQLite or Postgres — threads, drafts, final sends, edit diffs.
- **UI:** Minimal web app (one page, two users). No mobile app in v1.
- **Hosting:** Single small VM or managed service. No HA requirements.

### Cost envelope
- ~40 inquiries/day × ~30 days = 1,200 drafts/month
- With caching, assume ~$0.01–0.03 per draft → **$12–$40/month in model costs**
- Hosting ~$10/month → total well under $50/month target.

## 7. Risks

| Risk | Mitigation |
|---|---|
| AI hallucinates policy or order details | Retrieval-grounded prompts; "unknown → ask human" rule; staff always review |
| Staff rubber-stamp drafts without reading | Track edit rate; if a user's edit rate drops to ~0%, flag for spot-check |
| Tone feels robotic / off-brand | Style guide iterated weekly from edit diffs |
| Customer complains about AI use | Public stance: "replies are written by our team, assisted by AI." Keep it honest |
| Vendor outage | Fallback: queue remains, staff reply manually; no customer-facing degradation beyond slower drafts |

## 8. Rollout

1. **Week 1–2:** Build ingestion + draft generation; staff see drafts but still reply from their normal inbox (shadow mode). Measure draft quality.
2. **Week 3:** Flip to review UI as primary workflow for one channel (chat first — shorter threads, lower stakes).
3. **Week 4:** Add email channel.
4. **Week 5+:** Weekly knowledge-base/prompt tuning cadence.

## 9. Open questions

- Which helpdesk/inbox tool is in use today? (Determines ingestion path.)
- Is there a structured order database the drafter can query, or only Shopify-style admin?
- Do we want a customer-facing disclosure ("AI-assisted")? Owner's call.

---

Want me to save this to a file, or spin out any section (e.g., prompt + guardrails spec, the review UI mockup) in more detail?
````
