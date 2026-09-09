## Sources

- [scope] Workflow-selected scope: `mvp`.
- Upstream wireframes: `wireframes.md` (stale WF-2/WF-3/WF-4 range sketches — honor `starting at {low}` from stories and `project.md` Corrections).
- Upstream user flow: `user-flow.md`.
- Upstream stories: `stories.md` (US1.1–US4.1).
- Upstream requirements: `requirements.md` (FR1–FR5, NFR1–NFR7).
- Affirmed practices: `team-practices.md`.
- Accepted risk from User Stories review: unnamed host pages for card backs and category cards (R-01); category card binds to that card's existing `vehicle_models` read (R-02); no dedicated accessibility story (R-03); Original MSRP is whatever the slot already shows (R-04).

Already locked — do not reopen: existing page modules only; hero `Marketplace  $LOW - $HIGH`; ranking, card backs, and category cards `starting at {low}`; keep the slot and fall back to the Original MSRP that slot already uses on missing, half-populated, error, or timeout; no new button; click-through to the existing marketplace listing; current Car and Driver patterns and breakpoints; WCAG 2.1 AA; no new click events.

## Q1. What should the price slot show while marketplace prices are still loading?

Stories cover missing, half-populated, error, and timeout. They do not name the brief wait before the GraphQL `vehicle_models` read returns. The interaction spec needs one visible rule.

- A. Keep showing the current Original MSRP until both low and high arrive — no spinner or skeleton
- B. Show a loading treatment in the slot (I'll specify: spinner, skeleton, or other)
- C. Hide the slot until both low and high arrive
- X. Other (please specify)

[Answer]: C

## Q2. How should the hero's Marketplace label sit next to the numbers?

The hero string is locked as `Marketplace  $LOW - $HIGH`. I need whether that label uses the same treatment as today's Original MSRP label, or a different in-system treatment.

- A. Match the current Original MSRP label treatment (same type, weight, and placement)
- B. A different in-system treatment (I'll specify)
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q3. What happens when `starting at {low}` is longer than the current price string?

Ranking rows, card backs, and category cards will show a longer string than many current MSRP values. I need the overflow rule so mockups do not invent a new layout.

- A. Wrap onto a second line inside the existing slot
- B. Use the slot's current overflow (clip or ellipsis) — no new wrap rule
- C. Shrink type to fit one line
- X. Other (please specify)

[Answer]: C

## Q4. Which frames should the refined mockups show?

Host pages for vehicle-card backs and category cards are still unnamed (accepted risk). I need whether mockups stay on the four modules, or also name those host pages so the frames are locatable.

- A. The four modules in place — happy path and Original MSRP fallback for each. Do not name new host pages
- B. The four modules plus named host pages for vehicle-card backs and category cards (I'll name them)
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q5. Should marketplace copy look like today's price, or get a distinct in-system treatment?

NFR3 says follow existing Car and Driver used-car patterns. NFR1 says meaning must not be by color alone. This decides whether marketplace copy reuses the current price styles.

- A. Same typography and color as the current price slot; the words (`Marketplace` or `starting at`) carry the meaning
- B. A distinct in-system treatment that is not color-only (I'll specify)
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q6. When marketplace copy replaces Original MSRP, should a screen reader hear the change?

The click-through stays the existing control. I need whether swapping the price string is announced, or stays as quiet as today's content updates.

- A. Silent swap — inherit whatever the current slot does when its text changes
- B. Announce the new price politely (`aria-live="polite"`)
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
