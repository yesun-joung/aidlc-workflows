# Wireframes

Low-fidelity concepts for the four used-car placements in `scope-document.md` and `intent-backlog.md`, for the shopper problem in `intent-statement.md`.

Existing page modules only. No new page frame. [Q1]

Happy path: marketplace price range (low to high), then click through to marketplace inventory. [Q2][Q3]

Missing marketplace price: keep the slot and fall back to original MSRP. [Q4]

Visual pattern: current Car and Driver used-car modules. Breakpoints: current site. Accessibility bar: WCAG 2.1 AA. [Q5][Q6][Q7]

## Shared rules

- One primary action per placement: follow the price into marketplace inventory. [Q2]
- Price is a range, not a single figure. Do not use color alone to mark it as marketplace rather than MSRP. [Q3][Q7]
- All four placements must be present for the increment to count as delivered (`intent-backlog.md` U1–U4).
- These sketches replace the price treatment inside existing modules. Surrounding page chrome stays as it is today. [Q1][Q5]

## WF-1 MMP hero

Existing make/model page hero. The hero already has a price slot; this sketch only changes what that slot shows.

Populated:

```
+----------------------------------------------+
| Existing used-car page chrome                |
| +------------------------------------------+ |
| | Hero                                     | |
| | Model name                               | |
| | Marketplace  $LOW - $HIGH                | |
| | [ See inventory ]                        | |
| +------------------------------------------+ |
+----------------------------------------------+
```

Missing marketplace price:

```
+----------------------------------------------+
| Existing used-car page chrome                |
| +------------------------------------------+ |
| | Hero                                     | |
| | Model name                               | |
| | Original MSRP  $MSRP                     | |
| | [ See inventory ]                        | |
| +------------------------------------------+ |
+----------------------------------------------+
```

Accessibility: heading h2 on the hero title; landmarks header + main; keyboard entry is Tab to the See inventory control. [Q7]

## WF-2 MMP ranking

Existing ranking list on the make/model page. Each ranked row keeps its current layout; only the price treatment changes.

Populated (one row):

```
+----------------------------------------------+
| Ranking list                                 |
| +------------------------------------------+ |
| | Rank  Model name                         | |
| |       Marketplace  $LOW - $HIGH          | |
| |       [ See inventory ]                  | |
| +------------------------------------------+ |
+----------------------------------------------+
```

Missing marketplace price: same row, slot kept, `Original MSRP  $MSRP` in place of the range. [Q4]

Accessibility: heading h2 on the ranking block; landmark main; keyboard entry is Tab through each row's See inventory control. [Q7]

## WF-3 Vehicle-card backs

Existing vehicle cards. The back face already has a price slot; this sketch only changes that slot.

Populated:

```
+---------------------------+
| Card back                 |
| Model name                |
| Marketplace               |
| $LOW - $HIGH              |
| [ See inventory ]         |
+---------------------------+
```

Missing marketplace price: same card back, slot kept, `Original MSRP  $MSRP`. [Q4]

Accessibility: heading h3 on the card title; landmark main; keyboard entry is Tab to the card, then to See inventory. [Q7]

## WF-4 Category cards

Existing category cards. The card already has a price slot; this sketch only changes that slot.

Populated:

```
+---------------------------+
| Category card             |
| Category name             |
| Marketplace               |
| $LOW - $HIGH              |
| [ See inventory ]         |
+---------------------------+
```

Missing marketplace price: same card, slot kept, `Original MSRP  $MSRP`. [Q4]

Accessibility: heading h3 on the category name; landmark main; keyboard entry is Tab to the card, then to See inventory. [Q7]

## States

| Placement | Populated | Missing marketplace price | Loading | Error besides missing price |
|-----------|-----------|---------------------------|---------|-----------------------------|
| WF-1 Hero | Range + See inventory | Slot kept; original MSRP | Keep current site loading on the existing module | Not named; do not invent a new error page |
| WF-2 Ranking | Range per row | Slot kept; original MSRP on that row | Same as current list | Same as current list |
| WF-3 Card backs | Range on the back | Slot kept; original MSRP | Same as current card | Same as current card |
| WF-4 Category cards | Range on the card | Slot kept; original MSRP | Same as current card | Same as current card |

Empty-of-inventory is out of scope: these placements already exist. The only empty/error state this MVP adds is missing marketplace price. [Q1][Q4]

## Assumptions & Open Questions

- Exact dollar formatting, label wording beyond "Marketplace" / "Original MSRP", and tooltip copy are not named.
- Which placement is the first risk-reduction build is still unset (`intent-backlog.md`).

## Review

**Verdict:** READY
**Reviewer:** aidlc-product-lead-agent
**Date:** 2026-09-04T21:13:00Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260904-mvp/ideation/rough-mockups/wireframes.md > WF-1 through WF-4 populated sketches | Every placement draws a distinct `[ See inventory ]` control. Confirmed answers are existing page modules only, existing Car and Driver used-car patterns with no new visual system, and a click-through happy path. The sketches do not say this is the current module action. A new button on all four placements would be unapproved scope. | Add one sentence that `[ See inventory ]` is the existing inventory action in whatever form those modules already use, or state that a new control is in scope. | New |
| R-02 | Major | aidlc/spaces/default/intents/260904-mvp/ideation/rough-mockups/wireframes.md > Missing marketplace price blocks and States | Missing-price sketches keep `[ See inventory ]` beside `Original MSRP`. Q4 confirmed only that the slot stays and falls back to MSRP. Click-through on that path is not a confirmed answer. A shopper can read MSRP as the figure they are following into marketplace inventory — the same mismatch the intent exists to fix. | Confirm that the existing inventory action stays when the slot shows MSRP, or say it does not. Do not leave both readings live. | New |
| R-03 | Minor | aidlc/spaces/default/intents/260904-mvp/ideation/rough-mockups/wireframes.md > file (missing information architecture outline) | Stage Step 4 asks for an information architecture outline. None exists. Hierarchy is only implied inside each ASCII sketch. Host pages for vehicle-card backs and category cards are unnamed. | Add a short outline: which current page each of the four placements lives on, and the order of title, marketplace range, then action. | New |
| R-04 | Minor | aidlc/spaces/default/intents/260904-mvp/ideation/rough-mockups/user-flow.md > Happy path and Assumptions & Open Questions | The happy path ends at "marketplace inventory" and the file already notes that listing vs vehicle-detail is unnamed. The primary success metric is click-through to that destination. Approving the mockups without a destination concept leaves later stages free to pick either. | At the gate, name listing vs detail, or accept that Inception will ask. | New |

### Summary

The four must-have placements, the range-then-click happy path, the MSRP fallback, and per-screen accessibility notes match the confirmed answers and stay at ideation level. Weigh the two Majors before approving: whether See inventory is existing chrome, and whether that action still sits next to Original MSRP when marketplace price is missing.
