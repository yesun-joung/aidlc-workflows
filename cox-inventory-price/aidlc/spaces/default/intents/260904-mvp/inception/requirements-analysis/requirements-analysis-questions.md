## Sources

- [scope] Workflow-selected scope: `mvp`.
- Upstream intent: `intent-statement.md`.
- Upstream scope: `scope-document.md`.
- Upstream backlog: `intent-backlog.md`.
- Upstream sketches: `wireframes.md`, `user-flow.md`.
- Affirmed practices: `team-practices.md`.
- Project correction: ranking, card backs, and category cards use only the low marketplace price as `starting at {low}`.

## Q1. How should marketplace price appear on each placement?

Rough Mockups Q3 locked a range (low to high) on every placement. After that gate you also said ranking, vehicle-card backs, and category cards should show only the low as `starting at {low}`, with the hero still a range. Requirements need one rule.

- A. Hero shows `$LOW - $HIGH`; ranking, card backs, and category cards show `starting at {low}`
- B. All four placements show `$LOW - $HIGH` (the Rough Mockups Q3 answer)
- C. All four placements show `starting at {low}`
- D. A different format per placement (I'll specify)
- X. Other (please specify)

[Answer]: A

## Q2. Which placement is the first thin slice?

Scope said prove the price read on one placement first, then the other three. Walking skeleton is on. Which placement is that first slice?

- A. MMP hero
- B. MMP ranking
- C. Vehicle-card backs
- D. Category cards
- E. No preference — use whichever placement proves the GraphQL price read with the least new chrome
- X. Other (please specify)

[Answer]: A

## Q3. Where does See inventory take the shopper?

The approved path ends at marketplace inventory. The landing page was never named.

- A. The existing marketplace inventory listing for that model (not a vehicle-detail page)
- B. Whatever destination the module's current See inventory / shop control already uses
- C. A vehicle-detail page
- D. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q4. What is the click-through control on each placement?

Sketches drew a `[ See inventory ]` control. I need whether that is existing chrome or a new button.

- A. Use the click-through control already on each module; do not add a new button
- B. Add a See inventory control where the module does not already have one
- C. The price itself is the click-through; no separate button
- D. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q5. What should a placement show when only one of low or high is present?

Missing both already falls back to Original MSRP. This is the half-populated case.

- A. Treat it as missing marketplace price — keep the slot and show Original MSRP
- B. Show the one available figure with the same label rules as Q1
- C. Hero needs both numbers for a range; ranking, card backs, and category cards may show `starting at {low}` when low exists
- D. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q6. Do we add click tracking for the primary click-through metric?

Launch bar is correct rendering. Click-through is observed after launch. I need whether this MVP adds events.

- A. No new events — observe existing click-through after launch
- B. Emit a click event on each placement's click-through (I'll specify the name if needed)
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q7. What should a placement show when the price API errors or times out?

This is a failed read, not an empty field. Needed so the error path has a pass/fail rule.

- A. Same as missing price — keep the slot and show Original MSRP
- B. Keep a last-known marketplace price if the page already has one; otherwise Original MSRP
- C. Hide the price slot on error
- D. Not yet defined
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
