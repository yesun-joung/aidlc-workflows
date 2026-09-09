# Contract Summary

Formal contracts for the four placement → mapper edges in `unit-of-work-dependency.md`. Confirmed in `contract-design-questions.md` (Q1 A–Q4 A). Affirmed practices in `team-practices.md`. No new AWS. GraphQL `vehicle_models` selection stays on each placement’s own query file and is **not** a separate contract here (Q1 A).

## Contracts

| # | Provider Unit | Consumer | Mechanism | Owner |
|---|---------------|----------|-----------|-------|
| C1 | `marketplace-price-mapper` (U1) | `mmp-hero` (U2) | In-repo library import (sync function) | U1 |
| C2 | `marketplace-price-mapper` (U1) | `mmp-ranking` (U3) | In-repo library import (sync function) | U1 |
| C3 | `marketplace-price-mapper` (U1) | `vehicle-card-back` (U4) | In-repo library import (sync function) | U1 |
| C4 | `marketplace-price-mapper` (U1) | `category-card` (U5) | In-repo library import (sync function) | U1 |

All four edges share one call shape. Consumers differ only by `copyVariant`: U2 uses `hero-range`; U3–U5 use `starting-at` (`components.md`).

There is no public/external API contract in this increment. Placements continue to call existing GraphQL `vehicle_models` on their own query files; that selection is not formalised here (Q1 A). No new cloud endpoint, queue, or package boundary.

## C1–C4 Shared mapper function contract

Provider: U1 `marketplace-price-mapper`. Consumers: U2–U5. Mechanism: in-process TypeScript-style function import (Q2 A). Not HTTP, not OpenAPI.

```yaml
# shared-schema: MarketplacePriceMapper.call
# Kind: in-repo sync function (TypeScript-style). Not an HTTP API.
name: mapMarketplacePrice
provider: marketplace-price-mapper
consumers:
  - mmp-hero        # copyVariant: hero-range
  - mmp-ranking     # copyVariant: starting-at
  - vehicle-card-back  # copyVariant: starting-at
  - category-card   # copyVariant: starting-at
protocol: in-process-import
input:
  vehicleModelId:
    type: string
    required: true
  inFlight:
    type: boolean
    required: true
    description: True while that placement's vehicle_models read has not settled
  readFailed:
    type: boolean
    required: true
    description: True when that placement's GraphQL read errored or timed out after settle attempt
  low:
    type: number | null
    required: false
    description: Marketplace low when settled; ignored while inFlight or when readFailed
  high:
    type: number | null
    required: false
    description: Marketplace high when settled; ignored while inFlight or when readFailed
  copyVariant:
    type: enum
    values: [hero-range, starting-at]
    required: true
  originalMsrpCopy:
    type: string
    required: true
    description: Exact Original MSRP string that slot already uses (may be a range or empty per accepted risk)
  formatDollars:
    type: function
    required: true
    description: Caller's existing dollar formatter; mapper does not invent currency formatting
output:
  hide:
    type: boolean
    description: True only while inFlight — slot must not render marketplace or MSRP copy
  display:
    type: string | null
    description: Null when hide is true; otherwise marketplace copy or originalMsrpCopy
behaviour:
  - If inFlight is true → hide=true, display=null. No spinner or skeleton.
  - Else if readFailed is true → hide=false, display=originalMsrpCopy
  - Else if low and high are both present → hide=false; display is Marketplace  $LOW - $HIGH when copyVariant is hero-range, or starting at {low} when starting-at (dollars via formatDollars)
  - Else (missing either low or high) → hide=false, display=originalMsrpCopy
  - Mapper never fetches, retries, or times out GraphQL. Callers own their vehicle_models query files and pass flags after their own read settles or fails (Q4 A).
security:
  - Displayed figures are public marketplace prices. No new PII. No new analytics. No new AWS or network path (requirements.md NFR4; decisions.md).
```

### Consumer notes

| Consumer | `copyVariant` | Happy-path display |
|----------|---------------|--------------------|
| `mmp-hero` | `hero-range` | `Marketplace  $LOW - $HIGH` |
| `mmp-ranking` | `starting-at` | `starting at {low}` (shrink to one line in the slot — placement chrome, not mapper) |
| `vehicle-card-back` | `starting-at` | `starting at {low}` |
| `category-card` | `starting-at` | `starting at {low}` from that card’s existing `vehicle_models` pair (no aggregator) |

## Contract ownership rules

1. **Owner.** U1 (`marketplace-price-mapper`) owns this shared function contract (Q3 A).
2. **Breaking changes.** Changing required inputs, output meaning, or `copyVariant` values needs agreement from all four consumer units (U2–U5) before merge.
3. **Additive changes.** Optional input fields may be added; consumers ignore unknowns.
4. **No per-consumer forks.** Callers must not maintain a private copy of the call shape (Q3 A rejects B).
5. **GraphQL selection.** Each UI unit owns adding `price { marketplace { high low } }` on its own query file. That is implementation work, not a separate contract in this summary (Q1 A).

## Open questions

| Contract | Question | Blocks |
|----------|----------|--------|
| — | None. | — |

Accepted risks carried forward (not reopened here): YAML unit `name` vs Directory prefix split (units-generation R-01); parallel FRE merge risk among UI units (units-generation R-02); unnamed host pages for card backs and category cards; Original MSRP string is whatever the slot already shows; hide empty-box vs collapse while in flight.

## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-09-08T17:45:00Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260904-mvp/inception/contract-design/contract-summary.md > C1–C4 Shared mapper function contract `formatDollars` input and behaviour happy-path | `formatDollars` is a required cross-boundary input of type `function` with no TypeScript signature and no pinned call/result shape. Hero copy embeds `$LOW`/`$HIGH` while starting-at is `starting at {low}` without a `$` in FR2–FR4. Four callers plus U1 can disagree on whether the callback includes `$`, how many arguments it takes, and whether it is invoked once or twice for a range — that yields wrong shopper-facing strings or four divergent wrappers. | Pin `formatDollars` as a typed callback (e.g. `(amount: number) => string`), state whether the return includes a leading `$`, and state how the mapper builds each happy-path template from that return (hero range vs starting-at). Keep formatting ownership on the caller; do not invent a shared fetch or HTTP path. | New |
| R-02 | Minor | aidlc/spaces/default/intents/260904-mvp/inception/contract-design/contract-summary.md > C1–C4 Shared mapper function contract `low`/`high` and behaviour “both present” | Presence for FR5 is written as “low and high are both present” over `number \| null` optional fields, without an explicit null/omit/NaN rule (and whether `0` counts). Call sites can invent different gates and drift on half-populated fallback. | Add one sentence that both are present iff each is a finite number (non-null), including `0` if that is intended, and that omitted/`null`/`NaN` means absent. | New |
| R-03 | Minor | aidlc/spaces/default/intents/260904-mvp/inception/contract-design/contract-summary.md > C1–C4 Shared mapper function contract `vehicleModelId` input | `vehicleModelId` is required on the call but never used in the behaviour rules. Implementers cannot tell whether it is identity-only, required for a future `MarketplacePrice` object, or dead weight that every placement must invent. | Either document that it is identity-only and unused by mapping logic, or drop it from the required call shape until Functional Design needs it. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| `date -u +"%Y-%m-%dT%H:%M:%SZ"` | Hook-denied | PreToolUse blocked Shell. Date uses the dispatch fallback `2026-09-08T17:45:00Z`. |
| `aidlc-sensor-required-sections.ts` on `contract-summary.md` | Hook-denied; manual PASS | Four H2s (`Contracts`, `C1–C4 Shared mapper function contract`, `Contract ownership rules`, `Open questions`) meet the ≥2-H2 floor. No template override present. |
| Q1 A / Q2 A / Q3 A / Q4 A honored (manual) | PASS | Four placement→mapper edges only; one shared TS-style function shape; U1 owns; breaking needs U2–U5; caller flags; mapper never fetches/retries. |
| Locked constraints (manual) | PASS | In-repo sync import; no shared fetch; no new AWS; no HTTP/event/package boundary; GraphQL selection stays on each placement query file. |
| DAG coverage (manual) | PASS | C1–C4 match all four `unit-of-work-dependency.md` edges into `marketplace-price-mapper`; star is acyclic; no UI↔UI contracts (Q2 A / Q1 A). |
| Upstream copyVariant (manual) | PASS | Consumer notes and enum match `components.md`: U2 `hero-range`, U3–U5 `starting-at`. |
| FR5 / Q4 behaviour (manual) | PASS | inFlight → hide; readFailed / missing-or-half → `originalMsrpCopy`; both present → marketplace strings; GraphQL errors stay on placement. |

### Summary

The four in-repo mapper edges, ownership rules, and hide/fallback behaviour match the confirmed answers and the DAG, and are implementable as decision support. Weigh R-01 before approving: without a typed `formatDollars` contract, Construction will guess the dollar callback and risk incorrect FR1–FR4 copy.
