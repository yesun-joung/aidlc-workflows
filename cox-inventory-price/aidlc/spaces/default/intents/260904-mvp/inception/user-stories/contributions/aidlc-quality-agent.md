**Collaborator:** aidlc-quality-agent

## Contribution

The four placement stories are independently testable. Each AC already uses Given/When/Then with a binary Then. Fold these notes so Construction writes tests after each layer and judges pass/fail from fixtures, not from invented metrics.

### Pass/fail on the four AC families

Treat the same four checks on every story. A check passes only when the Then string or destination is exact; it fails on any other copy, a missing slot, a new control, or a vehicle-detail URL.

| Family | Pass | Fail |
|---|---|---|
| Happy path (`*.1.1`) | Both prices present → hero `Marketplace  $LOW - $HIGH`; ranking / card back / category card `starting at {low}` | Marketplace copy when a price is absent; `starting at {low}` on the hero; hero range copy on the other three |
| Missing or half-populated (`*.1.2`) | Slot stays; visible string is the Original MSRP that slot already uses (single value, range, or empty) | Marketplace copy; a newly authored `$MSRP` format that the slot does not already show |
| Price read fails (`*.1.3`) | GraphQL `vehicle_models` error or timeout → same Original MSRP Then as `*.1.2` | Blank slot, error chrome, or a retry that invents a latency budget |
| Click-through (`*.1.4`) | Existing control, shown with marketplace copy or Original MSRP, opens that model's (or category set's) marketplace inventory listing | New button; vehicle-detail page; control gone on fallback |

`*.1.2` lists three Givens in one AC. Keep one AC. Split it into three fixtures that share the same Then: neither price, low only, high only. Do not treat “only one present” as a happy path on US2.1–US4.1 just because those slots display `{low}`.

`*.1.3` is two Givens (error, timeout) and one Then. Same fixture family as missing price. Timeout means the existing GraphQL failure, not a new page-load or API-latency number.

`*.1.4` needs two display states: marketplace copy and Original MSRP. Both must keep the current control and land on the existing inventory listing. Assert destination type (inventory listing, not vehicle-detail). Do not add click-count or CTR assertions (NFR5, NFR6).

### Fixtures to ship with the stories

Reuse one fixture set on all four modules so fallback stays the same rule (FR5).

- **Both-prices:** low and high present. Assert the placement's marketplace string only.
- **One-price:** low-only and high-only as separate cases. Assert Original MSRP on both.
- **Neither-price:** both absent. Assert Original MSRP.
- **Error:** `vehicle_models` error, and a separate timeout. Assert Original MSRP. No latency target.
- **Click-through destination:** same fixtures as both-prices and one fallback (neither, one-price, or error). Drive the control already on the module. Assert marketplace inventory listing for that model or category set.

Each test owns its fixture. No shared mutable price payload across cases. Dollar formatting is whatever the module already uses; do not invent a second money format.

### Methodology and merge bar

Write tests after each implemented layer (NFR7, `team-practices.md`). Standard volume: unit checks for copy selection and fallback, plus a thin integration or click-through check that the existing control still reaches inventory. Merge bar is CI green. No coverage number, floor, or coverage report.

### What not to add to the stories

- No numeric CTR, click-lift, or latency acceptance criteria.
- No accessibility story and no WCAG AC on these four (Q4: add later only if a real shared-control gap appears).
- No new analytics event to make click-through “more testable.”

## Positions

- AGREE: One Must Have story per placement with fallback as ACs — each story is independently testable without a shared fallback story.
- AGREE: Marketplace copy only when both prices are present — one-price fixtures must fail happy path and pass Original MSRP, including on `starting at {low}` slots.
- AGREE: Fallback Then is “Original MSRP that slot already uses” — pass/fail stays the existing slot string, including range or empty (accepted R-02).
- AGREE: Click-through ACs bind the existing control to the existing inventory listing — destination type is testable; no new button and no vehicle-detail.
- AGREE: No accessibility story this increment — Q4 adds one later only if shared controls fail a real gap.
- AGREE: Test-after; merge bar is CI green with no coverage number — do not add a coverage floor or invented CTR/latency AC.
