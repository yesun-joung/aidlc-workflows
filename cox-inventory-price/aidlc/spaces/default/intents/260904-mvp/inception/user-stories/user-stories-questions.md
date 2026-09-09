## Sources

- [scope] Workflow-selected scope: `mvp`.
- Upstream requirements: `requirements.md` (FR1–FR5, NFR1–NFR7).
- Affirmed practices: `team-practices.md`.
- Accepted risk from Requirements Analysis review: Marketplace label split (R-01), `$MSRP` when the current slot is a range or empty (R-02), observe-after-launch is click-through only (R-03).

## Plan

Persona: start from the confirmed target customer — an external used-car shopper on Car and Driver (`intent-statement.md`). Do not invent editor or dealer personas unless you say we need them.

Format: INVEST. Each story is independently testable. Acceptance criteria in Given/When/Then.

Priority: all four placements are Must Have for the increment (`scope-document.md`). The MMP hero is the first thin slice (`requirements.md` FR1, `team-practices.md`).

Breakdown: by placement (FR1 hero, FR2 ranking, FR3 card backs, FR4 category cards), with FR5 fallback as criteria on those stories unless you choose a shared fallback story.

Stories will follow the approved requirements as written, including the accepted-risk copy (`Marketplace  $LOW - $HIGH` on the hero; `starting at {low}` on the other three) and Original MSRP as whatever those slots already show.

## Q1. How many shopper personas should stories use?

Intent already names one customer: external shoppers researching used cars on Car and Driver.

- A. One persona — the external used-car shopper
- B. Two personas — a model-page shopper and a category-browsing shopper
- C. Additional personas (I'll name them)
- X. Other (please specify)

[Answer]: A

## Q2. How should we split stories across the four placements?

Needed so each story stays small enough to build and test on its own.

- A. One Must Have story per placement (hero, ranking, card backs, category cards); happy path and fallback are acceptance criteria on that story
- B. Two stories per placement — one happy path, one fallback
- C. One story for all four placements
- X. Other (please specify)

[Answer]: C

## Q3. How should the shared fallback (FR5) appear in the backlog?

Missing price, half-populated price, and API error all show the existing Original MSRP and keep the existing click-through.

- A. Keep fallback as acceptance criteria on each placement story — no separate fallback story
- B. One shared Must Have fallback story that all four placements must satisfy, plus the four placement stories
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q4. How should keyboard and WCAG 2.1 AA (NFR1) appear?

Each placement already has an existing click-through. Meaning must not rely on color alone.

- A. Add accessibility acceptance criteria on each placement story
- B. One shared accessibility story
- C. Not yet defined
- X. Other (please specify)

[Answer]: X will add the story if we need it since shared components, buttons already implemented the default functionality

## Q5. Should stories treat the MMP hero as the only first-slice Must Have?

Requirements already say hero is the walking-skeleton slice and all four are required for the increment.

- A. Yes — hero is the first Must Have slice; ranking, card backs, and category cards stay Must Have but follow after the hero is approved
- B. All four stories are equal Must Have with no story-level first slice
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q6. Q2 and Q5 conflict — which story split should we use?

Q2 is one story for all four placements. Q5 is the MMP hero as the first Must Have slice, with ranking, card backs, and category cards following after that hero is approved. One story cannot be approved as a hero-only first slice.

- A. Keep one story for all four placements. Hero-first stays a build order inside that story, not a separate story
- B. Switch to one Must Have story per placement. Hero is the first slice; the other three follow after it is approved
- C. Something else (I'll specify)
- X. Other (please specify)

[Answer]: B

## Consolidated Summary Confirmation

Does this all look correct before I generate the stories and personas?

- Looks correct
- Request changes

[Answer]: Looks correct
