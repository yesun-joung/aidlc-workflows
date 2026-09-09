# Requirements

Grounded in `intent-statement.md`, `scope-document.md`, `team-practices.md`, and the confirmed answers in `requirements-analysis-questions.md`.

## Intent analysis

Used-car shoppers on Car and Driver currently see original MSRP or MSRP ranges where they need current marketplace affordability (`intent-statement.md`). This initiative replaces that treatment on four existing used-car placements so a shopper can read a current marketplace price and follow the existing click-through into that model's marketplace inventory listing.

Success for this MVP is correct rendering on all four placements. Click-through to marketplace inventory is observed after launch and is not the launch bar (`scope-document.md`). No new click events are added [Q6].

## Functional requirements

### FR1 MMP hero marketplace prices

The existing make/model-page hero is the first thin slice (`team-practices.md` walking skeleton; [Q2]).

- **FR1.1** When both marketplace low and high are present, the hero price slot shows `Marketplace  $LOW - $HIGH`. [Q1]
- **FR1.2** The hero uses the click-through control already on that module. Do not add a new button. [Q4]
- **FR1.3** That control takes the shopper to the existing marketplace inventory listing for the model, not a vehicle-detail page. [Q3]

### FR2 MMP ranking marketplace prices

- **FR2.1** When both marketplace low and high are present, each ranking row's price slot shows `starting at {low}`. [Q1]
- **FR2.2** Each row uses the click-through control already on that module. Do not add a new button. [Q4]
- **FR2.3** That control takes the shopper to the existing marketplace inventory listing for that row's model, not a vehicle-detail page. [Q3]

### FR3 Vehicle-card-back marketplace prices

- **FR3.1** When both marketplace low and high are present, the card-back price slot shows `starting at {low}`. [Q1]
- **FR3.2** The card uses the click-through control already on that module. Do not add a new button. [Q4]
- **FR3.3** That control takes the shopper to the existing marketplace inventory listing for that card's model, not a vehicle-detail page. [Q3]

### FR4 Category-card marketplace prices

- **FR4.1** When both marketplace low and high are present, the category-card price slot shows `starting at {low}`. [Q1]
- **FR4.2** The card uses the click-through control already on that module. Do not add a new button. [Q4]
- **FR4.3** That control takes the shopper to the existing marketplace inventory listing for that category's model set, not a vehicle-detail page. [Q3]

### FR5 Price presence and fallback

Applies to FR1–FR4. Marketplace copy appears only when both low and high are present. [Q1][Q5]

- **FR5.1** If marketplace low is missing, marketplace high is missing, or only one of the two is present, keep the price slot and show `Original MSRP  $MSRP`. [Q5]
- **FR5.2** If the GraphQL `vehicle_models` price read errors or times out, keep the price slot and show `Original MSRP  $MSRP`. Same rule as a missing price. [Q7]
- **FR5.3** The existing click-through control stays available when the slot shows Original MSRP (approved missing-price path in `user-flow.md`).

Pass/fail: on a fixture with both low and high, the placement shows the FR1–FR4 marketplace copy; on a fixture with neither, only one, or a failed read, the same slot shows Original MSRP and the existing control still navigates per FR1.3 / FR2.3 / FR3.3 / FR4.3.

## Non-functional requirements

- **NFR1** WCAG 2.1 AA on the four placements: keyboard access to the existing click-through, contrast, and meaning not by color alone (confirmed in Rough Mockups Q7; `wireframes.md`).
- **NFR2** Match the current site breakpoints those placements already use (Rough Mockups Q6).
- **NFR3** Follow existing Car and Driver used-car module patterns; no new visual system (Rough Mockups Q5).
- **NFR4** Displayed prices are public marketplace figures. No new personal data is collected (`scope-document.md`, constraint register R-2).
- **NFR5** No new analytics events in this MVP. Observe existing click-through after launch. [Q6]
- **NFR6** Launch bar is correct rendering of FR1–FR5 on all four placements. Click-through lift is observed after launch and is not a ship/no-ship criterion (`scope-document.md`).
- **NFR7** Tests are written after the implementation for each applicable layer. Merge bar is CI green with no coverage number (`team-practices.md`).

No numeric page-load or API-latency target was set. Do not invent one.

## Constraints

- Work is on the four existing used-car placements only: MMP hero, MMP ranking, vehicle-card backs, and category cards (`intent-statement.md`, `scope-document.md`).
- All four must ship together as the first delivered increment. A single placement is not enough shopper value (`scope-document.md`).
- The first thin slice is the MMP hero. The other three follow independently after that slice is approved (`team-practices.md`; [Q2]).
- Implementation home is the FRE repo. Integration surface is existing FRE used-car modules plus the existing GraphQL `vehicle_models` price API. Marketplace high/low already exist on that API. No new price source (`constraint-register.md` T-1–T-3).
- No new AWS account or service (`scope-document.md`).
- Target completion is 2 weeks for all four. If the date slips, keep all four and move the date (`scope-document.md`).
- Ship through FRE PRs: existing template, bot review, human review, QA pass, product pass, then `ready to merge`; the bot auto-merges to stage, feature, then production (`team-practices.md`).
- Short-lived feature branches; keep full commit history; do not squash-merge (`team-practices.md`).

## Assumptions

- The GraphQL `vehicle_models` marketplace high/low fields stay available for this work (feasibility open item; `constraint-register.md` T-3).
- Each of the four modules already has a click-through control that can be reused [Q4]. If a module has none, that is a gap to raise, not permission to add a button.
- Dollar formatting follows whatever those modules already use. Exact format beyond `$LOW - $HIGH` and `starting at {low}` was not named (`wireframes.md`).
- Two weeks remains a target, not a proven capacity (`scope-document.md`, `feasibility-assessment.md`).

## Out of scope

- Backend work (`scope-document.md`).
- New-car pricing changes (`scope-document.md`).
- Trim-, VIN-, or location-specific pricing (`scope-document.md`).
- New page frames or new visual systems (Rough Mockups Q1, Q5).
- A new See inventory button [Q4].
- Click-through to a vehicle-detail page [Q3].
- New click-tracking events [Q6].
- A coverage floor or coverage report (`team-practices.md`).

## Open questions

- Host page names for vehicle-card backs and category cards are still unnamed (`wireframes.md` review R-03). Requirements bind to the existing modules, not to a new page map.
- Whether four unbuilt placements finish in 2 weeks remains unproven (`feasibility-assessment.md`).

## Review

**Verdict:** READY
**Reviewer:** aidlc-product-lead-agent
**Date:** 2026-09-04T21:54:00Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260904-mvp/inception/requirements-analysis/requirements.md > FR1.1, FR2.1, FR3.1, FR4.1 | Shopper-facing copy is split. FR1.1 shows `Marketplace  $LOW - $HIGH` (the WF-1 label). Q1 A locked only `$LOW - $HIGH` for the hero. FR2.1, FR3.1, and FR4.1 show bare `starting at {low}` and drop the wireframe `Marketplace` label that marked the figure as marketplace rather than MSRP. Q1 A locked the number shape, not whether that label stays. | Confirm the exact visible string on each placement — keep or drop `Marketplace` on the hero and on the three `starting at {low}` slots — so stories do not guess shopper-facing copy. | New |
| R-02 | Major | aidlc/spaces/default/intents/260904-mvp/inception/requirements-analysis/requirements.md > FR5.1 | Fallback is `Original MSRP  $MSRP`, but `$MSRP` has no pass/fail when the current slot shows an MSRP range (the intent says shoppers see original MSRP or MSRP ranges) or when MSRP is also missing. QA cannot write one expected string for those fixtures. | Name the existing MSRP value those slots already show, and the pass/fail when that value is a range or empty. Do not invent a new MSRP source. | New |
| R-03 | Minor | aidlc/spaces/default/intents/260904-mvp/inception/requirements-analysis/requirements.md > Intent analysis, NFR6 | Post-launch observation is click-through only. Scope also named vehicle-detail views and lead start/submit as observe-after-launch, not as the launch bar. | Keep NFR6 as click-through-only if that is the watch list, or add those two scope measures as observe-only. Do not add numeric targets. | New |

### Summary

The four placements, Q1–Q7 copy and fallback rules, hero-first skeleton, locked exclusions, and “no invented CTR or latency target” are implementable and traced. Weigh the two Majors before approving: the `Marketplace` label on each placement, and what `$MSRP` means when the current slot is a range or empty.
