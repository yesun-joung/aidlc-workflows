## Sources

- [scope] Workflow-selected scope: `mvp`.
- Upstream requirements: `requirements.md` (FR1–FR5, NFR1–NFR7).
- Upstream stories: `stories.md` (US1.1–US4.1).
- Affirmed practices: `team-practices.md` (hero-first walking skeleton; test-after; FRE PR path; no new AWS).
- Refined mockups: hide the price slot only while the GraphQL `vehicle_models` read is in flight; then marketplace copy or Original MSRP (`project.md` Corrections).
- Accepted risk from Refined Mockups: empty slot box vs collapse while loading (R-01); hero range overflow on a narrow breakpoint (R-02).

Already locked — do not reopen: four existing FRE placements only; current GraphQL `vehicle_models` (each placement's own query file adds `price { marketplace { high low } }`); no new price source; no new AWS; no new button; listing destination; hero first slice; ranking/cards `starting at {low}`; hero `Marketplace  $LOW - $HIGH`.

This stage names **code we write**, not servers we deploy. No new cloud building block.

## Q1. What is a distinct building block for this work?

Needed so Units Generation can group real code boundaries. The four placements already exist; the new logic is marketplace presence, hide-while-loading, copy, and fallback.

- A. One shared marketplace-price mapper that all four existing placements call
- B. Four independent placement modules, each owning its own price rules
- C. One shared mapper plus four thin placement adapters (hero, ranking, card back, category card)
- X. Other (please specify)

[Answer]: A

## Q2. Who owns the GraphQL `vehicle_models` read?

Feasibility already said marketplace high/low exist on that API. I need whether this increment adds a shared fetch, or only maps fields the existing page/module query already returns.

- A. Keep the existing page or module query — this work only maps fields already on that read
- B. Add a shared fetch that all four placements call
- C. Not yet defined
- X. Other (please specify)

[Answer]: X — Keep current `vehicle_models`. Each placement may use a different query file. Add `price { marketplace { high low } }` on those queries so the shared mapper can read high and low. No shared fetch.

## Q3. Which building block owns the marketplace price shape?

Each entity needs one owner. The shape is: low, high, and whether both are present. Placements consume it; they should not each invent a different shape.

- A. The shared mapper (or the single component that owns price rules) owns `MarketplacePrice`
- B. Each placement owns its own price shape
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q4. What is in the first walking-skeleton slice?

`team-practices.md` ships the MMP hero first, then the other three after that slice is approved. I need whether the shared rules ship with the hero or stay inlined in the hero until later.

- A. Hero plus the shared mapper (later placements reuse that mapper)
- B. Hero only, with rules inlined; extract a shared mapper when the next placement starts
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q5. Does the visible price slot stay inside each existing module?

NFR3 says follow current Car and Driver patterns; refined mockups reuse the current slot styles. I need whether we extract a shared price-slot UI or only share the string decision.

- A. Price string stays inside each existing module — only the mapping/rules are shared
- B. Extract a shared price-slot UI used by all four
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
