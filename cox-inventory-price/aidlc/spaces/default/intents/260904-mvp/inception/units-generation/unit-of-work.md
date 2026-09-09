# Units of Work

Work units for US1.1–US4.1 in `stories.md` and FR1–FR5 in `requirements.md`. Grouped from `components.md` and `decisions.md` using `units-generation-questions.md` (Q1 A, Q2 A, Q3 A, Q4 A, Q5 A). Affirmed practices in `team-practices.md`. No new AWS.

This file names implementable units. It does not pick which unit to build first.

## Unit catalogue

| Unit ID | Name | Directory | Kind | Components | Complexity |
|---------|------|-----------|------|------------|------------|
| U1 | `marketplace-price-mapper` | `u1-marketplace-price-mapper` | library | MarketplacePriceMapper | M |
| U2 | `mmp-hero` | `u2-mmp-hero` | ui | MmpHero | M |
| U3 | `mmp-ranking` | `u3-mmp-ranking` | ui | MmpRanking | S |
| U4 | `vehicle-card-back` | `u4-vehicle-card-back` | ui | VehicleCardBack | S |
| U5 | `category-card` | `u5-category-card` | ui | CategoryCard | S |

## Unit definitions

### U1 `marketplace-price-mapper` — library

**Description.** Shared in-repo module that turns a placement's `vehicle_models` marketplace pair into hide-while-in-flight, marketplace copy, or the Original MSRP that slot already uses. Owns `MarketplacePrice`. Does not fetch.

**Boundaries.** Rules and the `MarketplacePrice` shape only. No GraphQL query file. No price-slot chrome. No click-through.

**Responsibilities.**

- Accept in-flight vs settled fields, `copyVariant` (`hero-range` or `starting-at`), and the caller's existing Original MSRP copy
- While that placement's read is in flight, say the slot should hide
- After settle, emit marketplace copy only when both low and high are present: `Marketplace  $LOW - $HIGH` or `starting at {low}`
- On missing, one-of-two, error, or timeout, return the caller's Original MSRP copy
- Use the caller's existing dollar formatter

**Deployment.** Embedded in the same FRE frontend. Not a standalone service.

**Implementation notes.** In-repo import (Q3 A). Test-after on hide, both-present, half-populated, and error/timeout. No new PII, analytics, AWS, or network path (`decisions.md`).

### U2 `mmp-hero` — ui

**Description.** Existing make/model-page hero. First walking-skeleton call site for the mapper (`decisions.md` ADR-004). Implements US1.1.

**Boundaries.** Hero module, its `vehicle_models` query file, its price slot, and its existing click-through. Does not own ranking, card, or category chrome.

**Responsibilities.**

- Add `price { marketplace { high low } }` on the existing hero query file
- Import U1 and call it with `copyVariant` `hero-range`
- Render the returned string in the existing hero slot, or hide that slot while the read is in flight
- Keep the existing click-through to the marketplace listing

**Deployment.** Embedded in the same FRE frontend.

**Implementation notes.** No new button. No new click events. Hero range overflow on a narrow breakpoint stays accepted risk from refined mockups.

### U3 `mmp-ranking` — ui

**Description.** Existing MMP ranking list. Implements US2.1.

**Boundaries.** Ranking module, its own query file (may differ from the hero file), per-row price slots, and existing row click-through.

**Responsibilities.**

- Add marketplace high/low on the ranking query file
- Import U1 per row with `copyVariant` `starting-at`
- Shrink `starting at {low}` to one line when it is longer than the current price
- Keep the existing row click-through

**Deployment.** Embedded in the same FRE frontend.

**Implementation notes.** Depends on U1 only. Does not depend on U2.

### U4 `vehicle-card-back` — ui

**Description.** Existing vehicle-card back. Implements US3.1.

**Boundaries.** Card-back module, its query file, its price slot, and existing card click-through. Host page stays unnamed (user-stories accepted risk R-01).

**Responsibilities.**

- Add marketplace high/low on the card query file
- Import U1 with `copyVariant` `starting-at`
- Render or hide in the existing card-back slot
- Keep the existing card click-through

**Deployment.** Embedded in the same FRE frontend.

**Implementation notes.** Find the existing FRE module at construction time. Depends on U1 only.

### U5 `category-card` — ui

**Description.** Existing category card. Implements US4.1.

**Boundaries.** Category-card module, its query file, its price slot, and existing card click-through. Host page unnamed (accepted risk R-01). Uses the marketplace pair already bound to that card's `vehicle_models` read — no category-wide aggregator (accepted risk R-02).

**Responsibilities.**

- Add marketplace high/low on the category-card query file
- Import U1 with `copyVariant` `starting-at` from that card's pair
- Render or hide in the existing category-card slot
- Keep the existing card click-through

**Deployment.** Embedded in the same FRE frontend.

**Implementation notes.** Find the existing FRE module at construction time. Depends on U1 only.

## Constraints

- All five units ship in one FRE frontend deploy (Q4 A). None is independently deployable.
- No shared fetch. No shared price-slot UI. No new AWS.
- The increment is not delivered until U2–U5 have all shipped (`scope-document.md`).
- Hide-while-in-flight empty-box vs collapse stays accepted risk from refined mockups (R-01).

## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-09-08T17:27:00Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260904-mvp/inception/units-generation/unit-of-work.md > Unit catalogue Directory column; aidlc/spaces/default/intents/260904-mvp/inception/units-generation/unit-of-work-dependency.md > Edges YAML `name` | Catalogue and story-map Directory values are `u1-marketplace-price-mapper` … `u5-category-card`. YAML `name` values are `marketplace-price-mapper` … `category-card`. The runtime construction path is `construction/<yaml-name>/` (`aidlc-lib` `reviewArtifactEntries`). A developer following Directory will write `construction/u1-marketplace-price-mapper/`; the engine will look for `construction/marketplace-price-mapper/`. | Make YAML `name` and Directory the same token. Prefer renaming YAML units and every `depends_on` entry to `u1-marketplace-price-mapper` … `u5-category-card` so they match the stage `u{n}-{description}` directory rule and the story-map Directory column. Keep `U{n}` as the short ID. | New |
| R-02 | Minor | aidlc/spaces/default/intents/260904-mvp/inception/units-generation/unit-of-work-dependency.md > Parallel development | Q2 A leaves no edges among the four UI units, so they are a valid parallel set. Q4 A also embeds all five in one FRE frontend tree. Parallel Construction worktrees can collide on the same repo even though the DAG is acyclic. | Confirm at the gate that empty U3–U5 edges still stand. Do not add hero-wait or UI-to-UI edges (Q2 A). Delivery Planning owns whether to serialize those units for merge risk. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| `date -u +"%Y-%m-%dT%H:%M:%SZ"` | Hook-denied | PreToolUse blocked Shell. Date uses the dispatch clock `2026-09-08T17:27:00Z` (10:27 AM UTC-7). |
| `aidlc-sensor-required-sections.ts` on `unit-of-work.md` | Hook-denied; manual PASS | Three H2s (`Unit catalogue`, `Unit definitions`, `Constraints`) meet the ≥2-H2 floor. |
| `aidlc-sensor-required-sections.ts` on `unit-of-work-dependency.md` | Hook-denied; manual PASS (`edge_block: ok`) | Three H2s. Fenced `yaml` `units:` block has five unique kebab names, valid `library`/`ui` kinds, existing `depends_on` targets, no self-deps, acyclic star (mapper first; four UI units next). |
| `aidlc-sensor-traceability.ts` on `traceability.json` | Hook-denied; manual PASS | `upstream_ids` = US1.1–US4.1. Each `OK` target (U2–U5) is a declared unit on that story's implementing-unit row. U1 is covered in the story-map cross-cutting table, not required as a second coverage target. |
| `aidlc-sensor-upstream-coverage.ts` | Hook-denied; manual PASS | Union of produces cites `components.md`, `decisions.md`, `requirements.md`, and `stories.md`. |
| `aidlc-runtime.ts compile` | Hook-denied; not run | Reviewer Shell is blocked; compile would also write runtime-graph. Manual Kahn walk matches the YAML star: batch `{marketplace-price-mapper}` then `{category-card, mmp-hero, mmp-ranking, vehicle-card-back}`. |
| Q1 A / Q2 A / Q3 A / Q4 A / Q5 A honored (manual) | PASS | Five units (library + four UI); U3–U5 depend on U1 only; in-repo import; all embedded in one FRE deploy. |
| Locked domain honored (manual) | PASS | One MarketplacePriceMapper; per-placement `vehicle_models` query files add `price.marketplace` high/low; no shared fetch; no new AWS; no shared price-slot UI. |
| Topology-only (manual) | PASS | Dependency artifact names no recommended build order or critical path. US1.1-first sequence is left to Delivery Planning. |

### Summary

The five-unit star matches the confirmed answers and the locked domain, and the DAG is cycle-free. Weigh R-01 before approving: YAML `name` and Directory must be one filesystem identity, or Construction will land artifacts where the engine will not look.
