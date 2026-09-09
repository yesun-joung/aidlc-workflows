# User Stories

Stories for P1 (Riley the used-car shopper). Grounded in `requirements.md` FR1–FR5. One Must Have story per placement (`user-stories-questions.md` Q6 B). Fallback is acceptance criteria on each story, not its own story (Q3 A). No accessibility story unless a later gap appears (Q4 X).

Copy follows the approved requirements as written (accepted risk R-01, R-02): hero shows `Marketplace  $LOW - $HIGH`; ranking, card backs, and category cards show `starting at {low}`; Original MSRP is whatever those slots already show.

## Test fixtures

Reuse one fixture set on all four stories (quality contribution). Happy path needs both low and high. One-price (low only, high only) and neither-price are fallback, including on `starting at {low}` slots. Error and timeout share the fallback Then. Click-through is checked on marketplace copy and on Original MSRP. No CTR or latency numbers.

## Sequence

US1.1 is the first thin slice. US2.1, US3.1, and US4.1 stay Must Have and follow after US1.1 is approved (`team-practices.md`; Q5 A). Size each story about 1–3 days (developer contribution).


The increment is not delivered until all four have shipped (`scope-document.md`).

## US1.1 See marketplace prices on the MMP hero

**As a** used-car shopper (P1), **I want** the make/model hero to show current marketplace prices, **so that** I can tell what this model lists for today and open its marketplace inventory.

- **Priority:** Must Have — first slice
- **Traces to:** FR1.1, FR1.2, FR1.3, FR5.1, FR5.2, FR5.3
- **Depends on:** none
- **INVEST:** Independent first slice; valuable shopper outcome; small (one existing module); testable ACs below

### Acceptance criteria

**AC1.1.1** Happy path
Given both marketplace low and high are present on the hero's model
When I view the existing MMP hero
Then the price slot shows `Marketplace  $LOW - $HIGH`

**AC1.1.2** Missing or half-populated price
Given marketplace low is missing, high is missing, or only one of the two is present
When I view the existing MMP hero
Then the price slot stays and shows the Original MSRP that slot already uses

**AC1.1.3** Price read fails
Given the GraphQL `vehicle_models` price read errors or times out
When I view the existing MMP hero
Then the price slot stays and shows the Original MSRP that slot already uses

**AC1.1.4** Click-through
Given I can see the hero (marketplace copy or Original MSRP)
When I use the click-through control already on that hero
Then I land on the existing marketplace inventory listing for that model, not a vehicle-detail page
And no new button was added

## US2.1 See marketplace prices on the MMP ranking

**As a** used-car shopper (P1), **I want** each ranking row to show a current starting marketplace price, **so that** I can compare listed affordability and open that model's inventory.

- **Priority:** Must Have — after US1.1
- **Traces to:** FR2.1, FR2.2, FR2.3, FR5.1, FR5.2, FR5.3
- **Depends on:** US1.1 approved (sequence only; no shared code gate)
- **INVEST:** Independent after the hero slice; same shopper value on a second module

### Acceptance criteria

**AC2.1.1** Happy path
Given both marketplace low and high are present for a ranking row
When I view that row on the existing MMP ranking
Then the row's price slot shows `starting at {low}`

**AC2.1.2** Missing or half-populated price
Given marketplace low is missing, high is missing, or only one of the two is present for that row
When I view that row
Then the price slot stays and shows the Original MSRP that slot already uses

**AC2.1.3** Price read fails
Given the GraphQL `vehicle_models` price read errors or times out
When I view the ranking
Then each affected row's price slot stays and shows the Original MSRP that slot already uses

**AC2.1.4** Click-through
Given I can see a ranking row (marketplace copy or Original MSRP)
When I use the click-through control already on that row
Then I land on the existing marketplace inventory listing for that row's model, not a vehicle-detail page
And no new button was added

## US3.1 See marketplace prices on vehicle-card backs

**As a** used-car shopper (P1), **I want** a vehicle-card back to show a current starting marketplace price, **so that** I can judge affordability from the card I am already flipping.

- **Priority:** Must Have — after US1.1
- **Traces to:** FR3.1, FR3.2, FR3.3, FR5.1, FR5.2, FR5.3
- **Depends on:** US1.1 approved (sequence only)
- **INVEST:** Independent module; same fallback and click-through rules

### Acceptance criteria

**AC3.1.1** Happy path
Given both marketplace low and high are present for the card's model
When I view the existing vehicle-card back
Then the price slot shows `starting at {low}`

**AC3.1.2** Missing or half-populated price
Given marketplace low is missing, high is missing, or only one of the two is present
When I view the card back
Then the price slot stays and shows the Original MSRP that slot already uses

**AC3.1.3** Price read fails
Given the GraphQL `vehicle_models` price read errors or times out
When I view the card back
Then the price slot stays and shows the Original MSRP that slot already uses

**AC3.1.4** Click-through
Given I can see the card back (marketplace copy or Original MSRP)
When I use the click-through control already on that card
Then I land on the existing marketplace inventory listing for that card's model, not a vehicle-detail page
And no new button was added

## US4.1 See marketplace prices on category cards

**As a** used-car shopper (P1), **I want** a category card to show a current starting marketplace price, **so that** I can tell what that group lists for today and open its marketplace inventory listing.

- **Priority:** Must Have — after US1.1
- **Traces to:** FR4.1, FR4.2, FR4.3, FR5.1, FR5.2, FR5.3
- **Depends on:** US1.1 approved (sequence only)
- **INVEST:** Independent module; same fallback and click-through rules

### Acceptance criteria

**AC4.1.1** Happy path
Given both marketplace low and high are present for the category's model set
When I view the existing category card
Then the price slot shows `starting at {low}`

**AC4.1.2** Missing or half-populated price
Given marketplace low is missing, high is missing, or only one of the two is present
When I view the category card
Then the price slot stays and shows the Original MSRP that slot already uses

**AC4.1.3** Price read fails
Given the GraphQL `vehicle_models` price read errors or times out
When I view the category card
Then the price slot stays and shows the Original MSRP that slot already uses

**AC4.1.4** Click-through
Given I can see the category card (marketplace copy or Original MSRP)
When I use the click-through control already on that card
Then I land on the existing marketplace inventory listing for that category's model set, not a vehicle-detail page
And no new button was added

## Won't Have (this increment)

- A new See inventory button
- Click-through to a vehicle-detail page
- A dedicated accessibility story (add later only if shared controls fail a real gap)
- New click-tracking events
- Backend, new-car, or trim/VIN/location pricing

## Review

**Verdict:** READY
**Reviewer:** aidlc-product-lead-agent
**Date:** 2026-09-08T15:44:00Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260904-mvp/inception/user-stories/stories.md > US3.1, US4.1 | US3.1 and US4.1 When clauses say “the existing vehicle-card back” and “the existing category card” with no host page or module locator. Requirements already left those page names unnamed. QA cannot write a test that opens a specific page from these ACs alone. | Name the existing host page or FRE module locator for vehicle-card backs and category cards, or explicitly accept find-time in FRE as the QA setup step. | New |
| R-02 | Major | aidlc/spaces/default/intents/260904-mvp/inception/user-stories/stories.md > AC4.1.1 | AC4.1.1 Given requires both marketplace low and high “for the category's model set.” A category is not one model. QA cannot tell whether the fixture is the card's existing `vehicle_models` pair, every model in the category, or an aggregated min/max. That invites a new aggregator, which this increment forbids. | State that the category card uses the marketplace low/high already bound to that card's existing `vehicle_models` read (no new aggregator). Keep “model set” on the click-through Then only. | New |
| R-03 | Minor | aidlc/spaces/default/intents/260904-mvp/inception/user-stories/stories.md > Won't Have | NFR1 (WCAG 2.1 AA: keyboard, contrast, meaning not by color) remains a requirement. Stories mark it N/A and list no dedicated accessibility story (Q4 X). None of the sixteen ACs would fail a keyboard, contrast, or color-only regression. | Confirm at the gate that NFR1 stays an existing-control assumption this increment, or add one testable AC if you want QA to catch a regression. Do not invent a new a11y story unless a real gap appears. | New |
| R-04 | Minor | aidlc/spaces/default/intents/260904-mvp/inception/user-stories/stories.md > AC1.1.2, AC2.1.2, AC3.1.2, AC4.1.2 | Fallback Then is “the Original MSRP that slot already uses.” That matches accepted-risk R-02 from requirements, but QA still has no single expected string when the current slot is a range or empty. | Weigh whether to keep accepted-risk R-02 or snapshot the current visible MSRP string (including range or empty) per placement before construction. Do not invent a new MSRP format. | New |

### Summary

Four Must Have stories (hero first), one P1 shopper, fallback as ACs, and accepted-risk copy are implementable and match the confirmed plan. Weigh the two Majors before approving: unnamed host pages for US3.1/US4.1, and which low/high pair AC4.1.1 uses for a category card.
