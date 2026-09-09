## Sources

- [scope] Workflow-selected scope: `mvp`.
- Upstream units: `unit-of-work.md` (U1 mapper; U2 hero; U3 ranking; U4 card back; U5 category).
- Upstream DAG: `unit-of-work-dependency.md` (U2–U5 depend on U1 only; no UI→UI edges).
- Upstream story map: US1.1→U2, US2.1→U3, US3.1→U4, US4.1→U5; U1 cross-cuts all four.
- Upstream contracts: `contract-summary.md` (C1–C4 shared mapper call).
- Affirmed practices: `team-practices.md` (walking skeleton on; hero-first thin slice; test-after; FRE PRs; full history, no squash).
- Scope: all four placements must ship together; 2-week bar is correct rendering; GraphQL marketplace prices already available.

Already locked — do not reopen: walking skeleton on; first thin slice is MMP hero plus shared mapper; later placements reuse the mapper and do not depend on the hero in the DAG; no new AWS; no shared fetch; increment not done until all four UI placements ship.

A **Bolt** here is one build pass over one or more units, ending in something that runs and can be demoed. This stage picks **which Bolts go in what order** (value and risk), not the dependency edges (already in the DAG).

## Q1. What goes in the first Bolt (the walking skeleton)?

Team practices ship a thin end-to-end slice first and gate it before the rest. Domain Design and stories already name hero plus mapper as that slice.

- A. Bolt 1 = U1 (`marketplace-price-mapper`) + U2 (`mmp-hero`) together — proves query → mapper → hero slot → listing click-through
- B. Bolt 1 = U1 alone; Bolt 2 = U2 hero (mapper ships before any placement)
- C. Bolt 1 = U2 hero only with rules inlined, extract U1 later
- X. Other (please specify)

[Answer]: A

## Q2. How should the other three placements be Bolted after the skeleton is approved?

U3, U4, and U5 each depend only on U1. All three must still ship for the increment to count.

- A. One Bolt per placement: Bolt 2 = U3 ranking, Bolt 3 = U4 card back, Bolt 4 = U5 category card
- B. One combined Bolt for U3+U4+U5 after the skeleton
- C. Two Bolts: one for ranking, one for both card types (or another split I’ll specify)
- X. Other (please specify)

[Answer]: A

## Q3. After the skeleton, should the remaining Bolts run one after another or overlap?

They share one FRE frontend tree (accepted risk: parallel worktrees can collide). I need your sequencing preference for Delivery Planning.

- A. Serial only — finish each remaining Bolt before starting the next (safer merges on one FRE tree)
- B. Overlap allowed where the DAG allows (U3/U4/U5 after U1) — accept merge coordination risk
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q4. Do you want a formal score (WSJF-style) for ranking Bolts, or stick with walking-skeleton-first?

WSJF-style means ranking by (value + urgency + risk reduction) ÷ size. Walking-skeleton-first is already affirmed.

- A. No numeric scores — order by walking-skeleton-first, then remaining placements; write that rationale plainly
- B. Score each Bolt with a simple WSJF-style table before locking order
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q5. Is anything outside this work likely to hold up a Bolt?

GraphQL marketplace high/low is already available. Backend is out of scope. I need any other external wait (approvals, another team, data freeze, design freeze).

- A. None — fully unblocked for Construction once Inception finishes
- B. Yes — I’ll list owner, wait time, which Bolt it blocks, and the slip plan
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q6. What worries you most about this build, so we tackle it early?

- A. Finding the right FRE modules / query files for each placement
- B. Mapper and copy rules drifting across the four call sites
- C. Merge collisions on the shared FRE tree when placements land close together
- D. Meeting the two-week date with all four placements
- E. Something else (please specify)
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Bolt 1 (walking skeleton) = U1 mapper + U2 MMP hero together (Q1 A)
- After approval: Bolt 2 = U3 ranking, Bolt 3 = U4 card back, Bolt 4 = U5 category card — one placement per Bolt (Q2 A)
- Remaining Bolts run serially on the shared FRE tree (Q3 A)
- No WSJF numeric scores — walking-skeleton-first, then the three placements in order (Q4 A)
- No external blockers once Inception finishes (Q5 A)
- Top worry: finding the right FRE modules / query files for each placement — tackle early in each Bolt (Q6 A)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
