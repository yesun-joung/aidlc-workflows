<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-08T16:27:00Z — Q1 C hide-the-slot applies only while the price read is in flight. After the read settles, the slot returns with marketplace copy or the Original MSRP that slot already uses. The user confirmed this reading on the consolidated summary.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-09-08T16:27:00Z — Honored approved stories and project Corrections for `starting at {low}` on ranking, card backs, and category cards instead of the stale `$LOW - $HIGH` sketches in wireframes.md.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-09-08T16:27:00Z — Reused current price-slot type and color; the words Marketplace or starting at carry meaning. Distinct in-system treatment was offered and declined (Q5 A).

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-09-08T16:27:00Z — Loading hide still has two layouts: keep an empty slot box versus collapse the slot so click-through jumps (advisory review R-01). Hero range overflow on a narrow breakpoint is also unnamed (R-02).
