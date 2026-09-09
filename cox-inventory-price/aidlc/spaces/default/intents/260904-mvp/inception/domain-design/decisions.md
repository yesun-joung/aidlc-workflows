# Architecture Decisions

Significant choices from `domain-design-questions.md` (Q2 X confirmed). Inception ADRs use Context, Decision, Consequences, and Alternatives Rejected.

**Security and compliance (all ADRs):** Displayed figures are public marketplace prices. No new personal data is collected. No new analytics events. No new AWS or new network path — each placement extends its existing `vehicle_models` query file only (`requirements.md` NFR4, NFR5).

## ADR-001: One shared MarketplacePriceMapper

### Context

The four existing placements need the same hide-while-in-flight, both-present marketplace copy, and Original MSRP fallback (`requirements.md` FR5). We could copy those rules into each module, add four new adapters, or keep one mapper the existing modules call.

### Decision

We will write one `MarketplacePriceMapper`. The existing MMP hero, MMP ranking, vehicle-card backs, and category cards call it. We will not add four new adapter components.

### Consequences

Positive: one place for FR5 and the approved copy strings; later placements reuse the hero-slice mapper.

Negative: every placement must pass the same inputs (copyVariant, in-flight vs settled fields, existing MSRP copy). A mapper change hits all four call sites.

Neutral: Units Generation can put the mapper with the hero first, then attach the other three. Public prices only; no new PII.

### Alternatives Rejected

- Four independent rule copies — drift risk.
- Shared mapper plus four new thin adapters — no extra behaviour beyond the existing modules.

## ADR-002: Per-placement vehicle_models query files add marketplace high/low

### Context

Marketplace high/low already exist on GraphQL `vehicle_models`. Feasibility and `requirements.md` forbid a new price source and new backend work. The four placements already have their own query files; those files do not yet select the marketplace object.

### Decision

Keep current `vehicle_models`. Each placement keeps its own query file (the files may differ). Each file adds:

```
vehicle_models(ID: "…") {
  price {
    marketplace {
      high
      low
    }
  }
}
```

The mapper does not fetch. We will not add a shared fetch.

### Consequences

Positive: one API, four existing query files, no new AWS, no second source of truth.

Negative: Construction must find each placement's query file in FRE and add the marketplace selection. If a file cannot take that selection, that is a find-time gap, not permission to invent a new API.

Neutral: the mapper is sync and in-process. Public marketplace figures only; no new PII.

### Alternatives Rejected

- A shared fetch all four placements call — extra I/O and out of scope.
- Map only fields already selected (Q2 A) — high/low exist on the API but are not yet in these query files.

## ADR-003: MarketplacePrice belongs to the mapper

### Context

Low, high, both-present, and copyVariant must have one owner. Placements consume the decision; they should not each invent a shape.

### Decision

`MarketplacePriceMapper` owns `MarketplacePrice`, identified by `vehicleModelId`, with attributes `vehicleModelId`, `low`, `high`, `bothPresent`, `copyVariant` (`hero-range` or `starting-at`).

### Consequences

Positive: one entity for Functional Design; hero range and `starting at {low}` cannot collapse into one return shape.

Negative: the mapper does not persist this entity; it is a value derived per read.

Neutral: category cards use the `vehicleModelId` already on that card's existing read, not an aggregated category id. Public prices; no new PII.

### Alternatives Rejected

- Each placement owns its own price shape — four models for one pair of fields.
- A single no-variant return string — would give all four sites the same copy.

## ADR-004: Walking skeleton is hero plus mapper

### Context

`team-practices.md` ships a thin end-to-end slice first. The first slice is the MMP hero (`requirements.md` FR1). The mapper is useless until one placement calls it; the hero is incomplete without the rules.

### Decision

The first slice is `MmpHero` plus `MarketplacePriceMapper`, including the marketplace selection on the hero query file. Ranking, card backs, and category cards reuse the mapper after that slice is approved.

### Consequences

Positive: the skeleton proves query selection → mapper → existing slot → existing listing click-through.

Negative: the other three wait on hero approval even though they do not share chrome with the hero.

Neutral: later placements do not depend on `MmpHero` in the component graph. Public prices; no new PII.

### Alternatives Rejected

- Inline rules in the hero and extract the mapper later — the skeleton would not prove the shared block.

## ADR-005: Price string stays in each existing module

### Context

NFR3 and refined mockups reuse current Car and Driver price-slot styles. A shared price-slot UI would be a new visual component.

### Decision

Only the mapping and rules are shared. Each existing module still renders the string (or hides the slot) in its current chrome.

### Consequences

Positive: no new UI system; click-through and focus stay on the current control.

Negative: hide-vs-collapse of the slot box (refined-mockups accepted risk R-01) is decided per existing layout, not by a shared widget.

Neutral: `starting at {low}` shrink-to-one-line stays a ranking/card concern, not a mapper concern. Public prices; no new PII.

### Alternatives Rejected

- Extract a shared price-slot UI — conflicts with NFR3 and Q5 A.
