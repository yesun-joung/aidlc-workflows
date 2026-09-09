# Team Allocation

Who builds each Bolt. A **Bolt** is one Construction build pass over one or more units. A **mob** here is the group (human and/or AI) that owns that pass end to end.

## Ownership model

Team Formation (stage 1.5) was skipped for this `mvp` scope. There is no multi-team Program Board. All Bolts are executed by the AI developer role (`aidlc-developer-agent`) in this session, with human approval at the walking-skeleton gate and later Construction gates per affirmed practices. Staffing confirmed: build every unit here, one at a time (`solo`).

## Bolt assignments

| Bolt | Units | Owner | Notes |
|------|-------|-------|-------|
| Bolt 1 (walking skeleton) | U1 + U2 | AI developer (`aidlc-developer-agent`) | Solo and gated — approve before Bolts 2–4 (`team-practices.md`) |
| Bolt 2 | U3 | AI developer | Serial after Bolt 1 (Q3 A) |
| Bolt 3 | U4 | AI developer | Serial after Bolt 2 |
| Bolt 4 | U5 | AI developer | Serial after Bolt 3; closes the increment |

## Ship path

FRE PRs to https://github.com/Media-Platforms/fre — template, bot + human + QA + product, `ready to merge`, bot auto-merge to stage → feature → production. Full commit history; no squash (`team-practices.md`).
