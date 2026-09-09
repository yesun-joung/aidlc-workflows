# Risk and Sequencing Rationale

Why Bolts are ordered this way. A **Bolt** is one Construction build pass over one or more units. Topology (what may depend on what) lives in `unit-of-work-dependency.md`. This file records the **economic** path through that DAG.

## Heuristic

**Walking-skeleton-first** (Cockburn), then serial placement Bolts. No numeric WSJF scores (Q4 A). Aligns with affirmed `team-practices.md` Walking Skeleton and Scope’s risk-first “prove price on one placement first” (MMP hero).

## Order

| Order | Bolt | Units | Why this position |
|-------|------|-------|-------------------|
| 1 | Walking skeleton | U1 + U2 | Proves mapper + one real call site before scaling to three more. Matches Domain Design ADR-004 and US1.1 first slice. |
| 2 | Ranking | U3 | Next Must Have after hero; reuses U1; independent of U2 in the DAG. |
| 3 | Vehicle-card back | U4 | Same mapper reuse; find-time in FRE is the named top worry (Q6 A) — still after skeleton so rules are proven. |
| 4 | Category card | U5 | Closes the four-placement increment; binds to that card’s existing `vehicle_models` pair. |

## DAG check

| Edge required by Bolts | Present in DAG? |
|------------------------|-----------------|
| U2 → U1 | Yes |
| U3 → U1 | Yes |
| U4 → U1 | Yes |
| U5 → U1 | Yes |
| U3/U4/U5 → U2 | Not required — correct; no hero-wait edges |

Serial Bolts 2–4 (Q3 A) are stricter than the DAG (which would allow parallel U3/U4/U5 after U1). Justification: one FRE frontend tree — safer merges; addresses units-generation accepted risk R-02 without adding fake dependency edges.

## Risks tackled early

| Risk | How sequencing helps |
|------|----------------------|
| Wrong FRE module / query file (Q6 A) | Bolt 1 finds hero paths first; each later Bolt starts with an explicit find step before coding |
| Mapper / copy drift | U1 ships in Bolt 1; Bolts 2–4 only import — contract ownership on U1 |
| FRE merge collisions | Serial remaining Bolts (Q3 A) |
| Two-week / all-four ship bar | Skeleton de-risks the hard connection first; slip date rather than drop a placement (`scope-document.md`) |

## Alternatives rejected

| Option | Why not |
|--------|---------|
| U1 alone then U2 (Q1 B) | Skeleton would not prove a shopper-visible placement |
| Inline rules in hero, extract mapper later (Q1 C) | Rejected in Domain Design; skeleton would not prove the shared block |
| One combined Bolt for U3–U5 (Q2 B) | Harder gated demos and larger blast radius on one FRE PR |
| Overlap remaining Bolts (Q3 B) | Higher merge risk on shared FRE tree |
| Formal WSJF table (Q4 B) | Unnecessary once skeleton-first + serial placements are chosen |
