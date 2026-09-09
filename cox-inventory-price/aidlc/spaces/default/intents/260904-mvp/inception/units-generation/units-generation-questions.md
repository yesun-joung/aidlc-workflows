## Sources

- [scope] Workflow-selected scope: `mvp`.
- Upstream components: `components.md` (MarketplacePriceMapper plus four existing FRE placements).
- Upstream decisions: `decisions.md` (ADR-001–ADR-005).
- Upstream requirements: `requirements.md` (FR1–FR5, NFR1–NFR7).
- Upstream stories: `stories.md` (US1.1–US4.1).
- Affirmed practices: `team-practices.md` (hero-first walking skeleton; test-after; FRE PR path; no new AWS).

Already locked — do not reopen: one shared MarketplacePriceMapper; four existing placements keep their own `vehicle_models` query files and add `price { marketplace { high low } }`; no shared fetch; no new AWS; no shared price-slot UI; hero plus mapper is the first walking-skeleton slice; ranking, card backs, and category cards reuse that mapper; all four placements still ship together as the increment.

This stage names **work units and what may depend on what**. It does not pick which unit to build first — that stays for Delivery Planning.

## Q1. How should we group the five catalogue pieces into work units?

Needed so Construction has a stable unit list and kinds. The catalogue has one new mapper and four existing placements. Domain Design said the first slice is hero plus mapper; it did not say they must be one unit.

- A. Five units: mapper as its own reusable library; MMP hero, MMP ranking, vehicle-card backs, and category cards each their own UI unit
- B. Four units: hero plus mapper as one UI unit; ranking, card backs, and category cards each their own UI unit
- C. Two units: hero plus mapper as one UI unit; ranking, card backs, and category cards as one combined UI unit
- D. One unit covering the mapper and all four placements
- X. Other (please specify)

[Answer]: A

## Q2. What may depend on what?

This is topology only — not build order. Later placements already reuse the mapper and do not reuse the hero. I need whether ranking, card backs, or category cards are allowed to depend on the hero unit (or on each other).

- A. Ranking, card backs, and category cards depend only on the mapper unit. None depends on the hero or on each other. (If Q1 bundled mapper with hero, those three depend on that combined unit, not on hero behaviour.)
- B. Ranking, card backs, and category cards may start only after the hero unit exists, even if the mapper is separate
- C. Ranking, card backs, and category cards depend on each other (I'll specify the edges)
- X. Other (please specify)

[Answer]: A

## Q3. How do units talk to each other?

The mapper is in-process and does not fetch. I need the integration so Contract Design does not invent a new API.

- A. In-repo library import: placements call the mapper as a function/module in the same FRE codebase
- B. Shared GraphQL contract only — no shared JavaScript/TypeScript module; each placement re-implements the call
- C. A separately published package or service the placements consume
- X. Other (please specify)

[Answer]: A

## Q4. How do these units deploy?

No new AWS. I need whether any unit is independently deployable, or they all ride the existing FRE frontend.

- A. Embedded: every unit ships in the same FRE frontend deploy; none is a standalone service
- B. Independently deployable units (I'll specify which)
- C. Hybrid (I'll specify which are embedded vs standalone)
- X. Other (please specify)

[Answer]: A

## Q5. Q1 A and Q3 B cannot both stand — which should hold?

Q1 A makes the mapper its own reusable library unit. Q3 B says there is no shared JavaScript/TypeScript module and each placement re-implements the call. That also reopens the approved Domain Design choice of one shared MarketplacePriceMapper that all four placements call.

- A. Keep Q1 A. Change Q3 to A: placements import one in-repo mapper module. Each placement still owns its own `vehicle_models` query file (no new API)
- B. Keep Q3 B. Drop the shared mapper library; each placement owns its own price rules (reopens Domain Design)
- C. Keep five units, but the mapper unit is only a spec for the GraphQL `price.marketplace` shape — each placement still writes its own hide/copy/fallback
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Five work units: mapper as its own reusable library; MMP hero, MMP ranking, vehicle-card backs, and category cards each their own UI unit (Q1 A)
- Ranking, card backs, and category cards depend only on the mapper. None depends on the hero or on each other (Q2 A)
- Placements import one in-repo mapper module. Each placement still owns its own `vehicle_models` query file — no new API (Q3 A, from Q5 A)
- Every unit ships in the same FRE frontend deploy; none is a standalone service (Q4 A)
- Q5 A superseded the earlier Q3 B (shared GraphQL only / re-implement per placement)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
