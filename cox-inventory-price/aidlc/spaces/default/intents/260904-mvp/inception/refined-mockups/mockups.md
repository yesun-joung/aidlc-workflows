# Refined Mockups

Mid-fidelity frames for US1.1–US4.1 in `stories.md`, grounded in `requirements.md` FR1–FR5 and NFR1–NFR3, evolving `wireframes.md` and `user-flow.md`. Construction follows `team-practices.md` (hero first, then the other three).

These frames replace only the price treatment inside existing Car and Driver used-car modules. Surrounding chrome stays as it is today. Do not treat the action drawn below as a new button — it is the click-through already on that module (`requirements.md` FR1.2–FR4.2).

Stale `wireframes.md` sketches still show `$LOW - $HIGH` on ranking, card backs, and category cards. Honor the approved stories and `project.md` Corrections: those three show `starting at {low}` only.

## Shared visual rules

- Hero happy path: `Marketplace  $LOW - $HIGH` (`stories.md` AC1.1.1).
- Ranking, card backs, category cards happy path: `starting at {low}` (`stories.md` AC2.1.1, AC3.1.1, AC4.1.1). Category card uses the low/high already bound to that card's existing `vehicle_models` read — no new aggregator (accepted risk R-02).
- Marketplace copy uses the same typography and color as the current price slot. The words carry the meaning, not a new color (`refined-mockups-questions.md` Q5 A; NFR1, NFR3).
- Hero `Marketplace` label matches today's Original MSRP label — same type, weight, and placement (Q2 A).
- If `starting at {low}` is longer than the current price string, shrink type to fit one line. Do not wrap and do not invent a new slot (Q3 C).
- While the GraphQL `vehicle_models` read is in flight, hide the price slot. No spinner or skeleton (Q1 C). After the read settles: both low and high → marketplace copy; missing, only one, error, or timeout → the Original MSRP that slot already uses (`requirements.md` FR5).
- Existing click-through stays available on marketplace copy and on Original MSRP (`user-flow.md` missing-price path; FR5.3). Destination is the existing marketplace inventory listing, not a vehicle-detail page (FR1.3–FR4.3).
- Dollar formatting follows whatever those modules already use (`requirements.md` Assumptions). Examples below are illustrative only.
- Host pages for vehicle-card backs and category cards stay unnamed (Q4 A; accepted risk R-01).

## RM-1 MMP hero (US1.1)

Existing make/model-page hero. First thin slice (`team-practices.md`).

### Loading

Price slot hidden. Model name and existing click-through stay.

```
+----------------------------------------------+
| Existing used-car page chrome                |
| +------------------------------------------+ |
| | Hero                                     | |
| | Model name                               | |
| |                                          | |
| | [existing click-through]                 | |
| +------------------------------------------+ |
+----------------------------------------------+
```

### Happy path

Both marketplace low and high present.

```
+----------------------------------------------+
| Existing used-car page chrome                |
| +------------------------------------------+ |
| | Hero                                     | |
| | Model name                               | |
| | Marketplace  $18,400 - $24,900           | |
| | [existing click-through]                 | |
| +------------------------------------------+ |
+----------------------------------------------+
```

### Fallback (missing, half-populated, error, timeout)

Slot returns. Show the Original MSRP that slot already uses — including if that value is a range or empty (accepted risk R-04).

```
+----------------------------------------------+
| Existing used-car page chrome                |
| +------------------------------------------+ |
| | Hero                                     | |
| | Model name                               | |
| | Original MSRP  $MSRP                     | |
| | [existing click-through]                 | |
| +------------------------------------------+ |
+----------------------------------------------+
```

## RM-2 MMP ranking (US2.1)

Existing ranking list on the make/model page. Each row keeps its current layout.

### Loading (one row)

```
+----------------------------------------------+
| Ranking list                                 |
| +------------------------------------------+ |
| | Rank  Model name                         | |
| |                                          | |
| |       [existing click-through]           | |
| +------------------------------------------+ |
+----------------------------------------------+
```

### Happy path (one row)

```
+----------------------------------------------+
| Ranking list                                 |
| +------------------------------------------+ |
| | Rank  Model name                         | |
| |       starting at $18,400                | |
| |       [existing click-through]           | |
| +------------------------------------------+ |
+----------------------------------------------+
```

Type shrinks to one line if `starting at {low}` is longer than the current price string.

### Fallback (one row)

```
+----------------------------------------------+
| Ranking list                                 |
| +------------------------------------------+ |
| | Rank  Model name                         | |
| |       Original MSRP  $MSRP               | |
| |       [existing click-through]           | |
| +------------------------------------------+ |
+----------------------------------------------+
```

Rows settle independently. A row still in flight hides only that row's slot.

## RM-3 Vehicle-card backs (US3.1)

Existing vehicle-card back. Host page unnamed (Q4 A).

### Loading

```
+---------------------------+
| Card back                 |
| Model name                |
|                           |
| [existing click-through]  |
+---------------------------+
```

### Happy path

```
+---------------------------+
| Card back                 |
| Model name                |
| starting at $18,400       |
| [existing click-through]  |
+---------------------------+
```

### Fallback

```
+---------------------------+
| Card back                 |
| Model name                |
| Original MSRP  $MSRP      |
| [existing click-through]  |
+---------------------------+
```

## RM-4 Category cards (US4.1)

Existing category card. Host page unnamed (Q4 A). Price is the pair already on that card's `vehicle_models` read.

### Loading

```
+---------------------------+
| Category card             |
| Category name             |
|                           |
| [existing click-through]  |
+---------------------------+
```

### Happy path

```
+---------------------------+
| Category card             |
| Category name             |
| starting at $18,400       |
| [existing click-through]  |
+---------------------------+
```

### Fallback

```
+---------------------------+
| Category card             |
| Category name             |
| Original MSRP  $MSRP      |
| [existing click-through]  |
+---------------------------+
```

## States

| Placement | Loading (read in flight) | Happy (both low and high) | Fallback (missing, one-of-two, error, timeout) |
|-----------|--------------------------|---------------------------|------------------------------------------------|
| RM-1 Hero | Slot hidden | `Marketplace  $LOW - $HIGH` | Slot visible; Original MSRP that slot already uses |
| RM-2 Ranking | That row's slot hidden | `starting at {low}` | That row's slot visible; Original MSRP |
| RM-3 Card backs | Slot hidden | `starting at {low}` | Slot visible; Original MSRP |
| RM-4 Category cards | Slot hidden | `starting at {low}` | Slot visible; Original MSRP |

Existing click-through remains in every settled state. Empty-of-inventory is out of scope.

## Responsive

Match the current site breakpoints those placements already use (NFR2). No new breakpoint. On every current breakpoint: same copy rules; `starting at {low}` still shrinks to one line rather than wrapping.

## Information architecture

Order inside each existing module: title (model, rank+model, or category name) → price slot (hidden while loading) → existing click-through. No new page, landmark, or navigation item.

## Assumptions

- Exact current MSRP string per placement (including a range or empty slot) is snapshotted at find-time in FRE, not invented here.
- Existing click-through already exists on each module. If a module has none, that is a gap to raise, not permission to add a button (`requirements.md` Assumptions).

## Review

**Verdict:** READY
**Reviewer:** aidlc-product-lead-agent
**Date:** 2026-09-08T16:27:00Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260904-mvp/inception/refined-mockups/interaction-spec.md > Hero price slot States (loading) | Loading is specified as "Slot not rendered / not visible" — those are two layouts. Mockups ASCII leaves a blank row between title and click-through; design-system-mapping still maps spacing to the current slot box. Hide-while-in-flight versus show-slot-after-settle is clear; whether the slot box stays empty or collapses (click-through jumps) is not. QA cannot write one pass/fail for loading layout. | Pick one hide behavior for all four placements: keep the current slot box empty with no glyph, or collapse the slot. Use that wording in the loading state and the States table. Do not add a spinner or skeleton. | New |
| R-02 | Minor | aidlc/spaces/default/intents/260904-mvp/inception/refined-mockups/mockups.md > Responsive | Q3 C and the Responsive section require one-line shrink only for `starting at {low}`. Hero `Marketplace  $LOW - $HIGH` has no overflow rule if that string is longer than today's Original MSRP on a narrow breakpoint. | Say whether the hero range also stays on one line (shrink) or inherits the current hero slot overflow. Do not invent a new hero slot. | New |

### Summary

Four placements have loading, happy-path, and Original MSRP fallback frames; Q1–Q6, no-new-chrome, and `starting at {low}` (not stale WF-2/3/4 ranges) are honored. Weigh R-01 before approving: empty slot box versus collapsed slot while the `vehicle_models` read is in flight.
