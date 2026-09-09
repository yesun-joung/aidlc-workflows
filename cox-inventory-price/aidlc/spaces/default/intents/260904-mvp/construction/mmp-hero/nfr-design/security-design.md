# Security Design — mmp-hero

Security and accessibility design for U2 (CAD hero price slot). Illustrative only — full implementation in Code Generation.

## UI boundary strategy

| Requirement | Design |
|-------------|--------|
| NFR4.1 | Treat GraphQL `marketplace.low` / `marketplace.high` as **public display figures** once settled. No PII collection in the price section. |
| NFR4.2 / NFR5.1 | No `console.*`, analytics, metrics, or client storage of prices, model id, or mapper output in this unit. |
| NFR4.3 | Pass numeric fields to U1 as returned by GraphQL; do not coerce strings in the price section — U1 `isPresent` handles absence. |
| NFR4.4 | On query error/timeout, hero wrapper sets `readFailed=true`; mapper returns Original MSRP — **do not** render GraphQL error payload or stack text in the slot. |
| NFR1.2 | While `inFlight`, render **no** price title or body in the DOM (not `visibility:hidden` MSRP). |
| NFR1.4 | When copy changes after settle, **silent swap** — no `aria-live`, no focus move. |

## Flag wiring (Q3 A)

```text
ReviewArticleHero (wrapper)
  reads page/loader vehicle read state
  passes: inFlight, readFailed, marketplaceLow/High, price, vehicleModelId
ReviewArticlePriceSection
  does NOT fetch
  builds originalMsrpCopy + formatDollars
  calls mapMarketplacePrice
```

## Render branch (Q2 A — closes FD R-02)

After mapper returns `{ hide, display }` with `hide === false`:

```javascript
const isMarketplaceCopy = display !== originalMsrpCopy;
// true  → render display without MSRP title (MarketplaceCta when ingress on)
// false → render MSRP title + display (fallback layout)
```

Do **not** use `display.startsWith("Marketplace")` as the branch predicate.

## inFlight / hide path

```text
if (hide) → return price container with no title/text
           shop CTAs / trade-in / forecast unchanged below
```

## SSR loader failure (closes FD R-04)

When the hero vehicle read never settles on SSR (loader/page error path):

- Wrapper passes `readFailed=true`, `inFlight=false`, absent marketplace fields.
- Price section runs mapper MSRP fallback (W3) **or** page error handling prevents render — document in Code Generation which path applies when the whole hero is unavailable.

## Authn / encryption

Not applicable at this UI slice. Existing Voltron GraphQL auth boundary unchanged.

## Test design hooks (NFR7.1)

Component tests must cover: empty DOM while `inFlight`; marketplace branch when `display !== originalMsrpCopy`; MSRP title present on fallback; no error string in slot on `readFailed`; `MarketplaceCta` href unchanged.

## Summary

Trust settled GraphQL numbers, fail to MSRP without leaking errors, empty DOM while loading, and a stable marketplace vs MSRP branch rule for Code Generation.


## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-09-08T19:28:30Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Minor | security-design.md > SSR loader failure | SSR loader failure path allows page-level error handling to skip price section render. | Code Generation documents which path applies when hero unavailable. | Accepted |
| R-02 | Minor | traceability.json > NFR7.2 | NFR7.2 target references tech-stack-decisions.md outside nfr-design. | Acceptable cross-artifact reference. | Accepted |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| traceability | Manual PASS | NFR detailed IDs map to design doc sections. |
| Q1-Q6 vs artifacts | Manual PASS | Branch rule, flags, performance, security, logical view aligned. |

### Summary

Q1-Q6 design is implementable. Branch predicate and inFlight DOM rules close FD review minors. Ready for Infrastructure Design.
