<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-08T17:27:00Z — Q5 A keeps one in-repo mapper library and changes Q3 to A; each placement still owns its own vehicle_models query file. The earlier Q3 B (GraphQL-only / re-implement per placement) is superseded and does not reopen Domain Design.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-09-08T17:27:00Z — YAML unit names are kebab without a uN prefix; Directory uses u1-…u5-. Advisory review R-01 says Construction paths follow YAML name. Aligning them is a gate call, not a silent rewrite after the terminal review.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
