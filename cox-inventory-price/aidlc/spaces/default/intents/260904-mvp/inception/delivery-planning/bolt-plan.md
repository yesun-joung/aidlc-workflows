# Bolt Plan

Ordered Construction delivery slices for this MVP. A **Bolt** is one build pass over one or more units, ending in something that runs and can be demoed. Confirmed in `delivery-planning-questions.md` (Q1 A–Q4 A). Affirmed practices in `team-practices.md`. Dependency edges stay in `unit-of-work-dependency.md`; this file chooses economic order through that DAG.

**Sequence (serial after Bolt 1):** Bolt 1 → gate → Bolt 2 → Bolt 3 → Bolt 4. Remaining Bolts do not overlap (Q3 A).

## Bolt 1 — Walking skeleton (U1 + U2)

| Field | Value |
|-------|--------|
| Units | U1 `marketplace-price-mapper`, U2 `mmp-hero` |
| Stories | US1.1 (mapper also enables later stories) |
| Walking skeleton | Yes — first thin end-to-end slice |
| Order | First; user approves before Bolts 2–4 |

**Proves.** GraphQL `vehicle_models` marketplace selection on the hero query → shared mapper (`copyVariant` `hero-range`) → existing hero price slot (hide while in flight, then marketplace range or Original MSRP) → existing listing click-through. No new AWS, button, or fetch.

**Definition of Done**

- U1 mapper implements the shared call from `contract-summary.md` (hide / marketplace / Original MSRP)
- Hero query file adds `price { marketplace { high low } }`
- Happy, missing/half, error/timeout, and click-through ACs for US1.1 pass
- Tests written after implementation for applicable layers; CI green (no coverage floor)
- FRE PR path followed (`team-practices.md`)

**Confidence hypothesis.** Shipping Bolt 1 shows the mapper + one real placement can render correct marketplace (or fallback) copy without a new network path.

**Expected demo.** Make/model hero with both low and high shows `Marketplace  $LOW - $HIGH`; fixture without both shows Original MSRP; existing control still opens the marketplace listing.

## Bolt 2 — MMP ranking (U3)

| Field | Value |
|-------|--------|
| Units | U3 `mmp-ranking` |
| Stories | US2.1 |
| Walking skeleton | No |
| Depends on | Bolt 1 approved (U1 already shipped); DAG: U3 → U1 only |

**Proves.** Ranking rows can reuse U1 with `copyVariant` `starting-at` and shrink-to-one-line in existing row chrome.

**Definition of Done**

- Ranking query file adds marketplace high/low
- US2.1 ACs pass; test-after; CI green; FRE PR

**Confidence hypothesis.** Second placement reuses the mapper without forking hide/fallback rules.

**Expected demo.** Ranking row shows `starting at {low}` when both prices present; otherwise Original MSRP; existing row click-through unchanged.

## Bolt 3 — Vehicle-card back (U4)

| Field | Value |
|-------|--------|
| Units | U4 `vehicle-card-back` |
| Stories | US3.1 |
| Walking skeleton | No |
| Depends on | Bolt 1 approved; DAG: U4 → U1 only |

**Proves.** Card-back placement can call U1 after finding the existing FRE module (top worry Q6 A).

**Definition of Done**

- Card query file adds marketplace high/low
- US3.1 ACs pass; test-after; CI green; FRE PR
- Host page unnamed remains accepted risk — find module in FRE at Construction start

**Confidence hypothesis.** Card-back find-time in FRE is solvable without new host pages or aggregators.

**Expected demo.** Card back shows `starting at {low}` or Original MSRP; existing card click-through unchanged.

## Bolt 4 — Category card (U5)

| Field | Value |
|-------|--------|
| Units | U5 `category-card` |
| Stories | US4.1 |
| Walking skeleton | No |
| Depends on | Bolt 1 approved; DAG: U5 → U1 only |

**Proves.** Category card uses that card’s existing `vehicle_models` pair (no category-wide aggregator).

**Definition of Done**

- Category-card query file adds marketplace high/low
- US4.1 ACs pass; test-after; CI green; FRE PR
- Increment complete only when Bolts 1–4 have all shipped (`scope-document.md`)

**Confidence hypothesis.** Fourth placement closes the Must Have set without inventing a new price API.

**Expected demo.** Category card shows `starting at {low}` from that card’s pair, or Original MSRP; existing click-through unchanged.

## Notes

- YAML unit names vs `uN-` Directory split (units-generation R-01) remains accepted risk — Construction paths follow YAML `name` unless revised later.
- Contract open findings (typed `formatDollars`, presence rule, `vehicleModelId`) remain accepted risk into Functional Design / Code Generation.
- No numeric WSJF table (Q4 A).
