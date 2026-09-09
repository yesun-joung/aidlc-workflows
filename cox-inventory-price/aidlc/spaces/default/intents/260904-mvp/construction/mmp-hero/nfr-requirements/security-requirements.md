# Security Requirements — mmp-hero

Security and data-handling requirements for U2 (CAD hero price slot). Public marketplace display data only; no new analytics or storage.

## Requirements

| ID | Statement | Category | Source |
|----|-----------|----------|--------|
| NFR4.1 | Marketplace `low`/`high` from GraphQL are public display figures. This unit must not collect, persist, or infer shopper personal data from price display. | data-classification | NFR4, Q3 A |
| NFR4.2 | Do not log marketplace prices, `vehicleModelId`, or mapper `display` strings in new client or server logs for this unit. | telemetry | NFR4, Q6 A |
| NFR4.3 | Pass numeric marketplace fields to U1 after the hero loader settles; do not coerce untrusted strings into numbers in the price section — rely on GraphQL typing and U1 presence rules. | input-validation | U1 NFR4.4, BR2.2 |
| NFR4.4 | On GraphQL read error or timeout, show Original MSRP fallback via mapper (`readFailed`); do not expose raw error payloads in the price slot UI. | error-handling | BR2.7, Q3 A |
| NFR5.1 | No new analytics events, metrics, or tracking calls for marketplace price display, hide/show transitions, or read outcomes in this unit. | analytics | NFR5, Q6 A |

## Threat notes (UI scope)

| STRIDE area | Assessment | Control |
|-------------|------------|---------|
| Spoofing / Tampering | Prices arrive via existing authenticated GraphQL boundary | Trust settled query data; mapper is in-process |
| Information disclosure | Prices are public marketplace figures | No new logging of ids or copy (NFR4.2) |
| Denial of service | One extra fragment selection | Out of scope — platform GraphQL limits |
| Elevation | No new auth surface in price slot | N/A |

## Accessibility security crossover

| ID | Statement | Source |
|----|-----------|--------|
| NFR1.1 | Keyboard access stays on the **existing** hero click-through (`MarketplaceCta` / shop CTAs). No new focusable price control. | NFR1, interaction-spec |
| NFR1.2 | While `inFlight`, do not render price text or MSRP title (empty slot). No new `aria-live` or loading announcement. | NFR1, Q2 A, interaction-spec |
| NFR1.3 | When settled, price text inherits existing hero contrast and semantics; marketplace or MSRP copy must remain WCAG 2.1 AA contrast. | NFR1, interaction-spec |
| NFR1.4 | Silent swap when copy changes from hidden → marketplace or MSRP; do not move focus on string appearance. | interaction-spec, Q2 A |

## Summary

Public marketplace display only, no new telemetry, no error leakage in the slot, and accessibility constraints aligned with interaction-spec silent swap rules.

## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-09-08T19:27:00Z
**Iteration:** 1
**Request Challenge:** review:5fc69c018b2aac4a5a721bd55c9fa93b

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Minor | tech-stack-decisions.md > Test tooling | FRE test runner unnamed (no package script path). NFR7.1 discoverable in Code Generation. | Name test command when known, or mark TBD with owner. | Accepted |
| R-02 | Minor | security-requirements.md > NFR1.2 | Empty inFlight slot does not state whether surrounding hero landmarks remain for screen readers. | Code Generation matches today hero DOM when price text absent. | Accepted |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| traceability | Manual PASS | NFR1-NFR7 covered with derived IDs. |
| Q1-Q6 vs artifacts | Manual PASS | Locked decisions reflected across artifacts. |
| produces_kinds | Manual PASS | UI unit omits service-only docs by design. |

### Summary

Q1-Q6 decisions are reflected. Traceability IDs align. Minor test-runner naming gap matches U1 and does not block Code Generation.
