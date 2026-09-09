**Collaborator:** aidlc-design-agent

## Contribution

P1 Riley is the right sole persona: an occasional public shopper who scans existing Car and Driver chrome for what cars list for today, then uses the control already on that module. Do not add an editor, dealer, or logged-in staff actor.

The four Must Have stories match existing-module UX. Each one is a price-slot swap on a module Riley already uses (MMP hero, ranking row, vehicle-card back, category card). No new page, no new button, no new visual system. Click-through ACs correctly reuse the control already on that module and land on the existing marketplace inventory listing, not a vehicle-detail page — including when the slot falls back to Original MSRP.

Shopper-facing copy follows the accepted-risk strings. Keep hero as `Marketplace  $LOW - $HIGH`. Keep ranking, card backs, and category cards as `starting at {low}` with no `Marketplace` prefix. Do not unify those four strings for visual consistency; that would invent a label the approved requirements dropped. Residual scan risk: on the three `starting at {low}` slots, Riley can still read the figure as MSRP-adjacent. That is accepted R-01, not a story to add.

Fallback as ACs (not a fifth story) is the right UX cut. Missing, half-populated, and failed reads keep the existing price slot and the Original MSRP that slot already shows. Riley still sees a familiar figure and can still click through. Do not invent empty, loading, or error chrome.

No accessibility story this increment (Q4). NFR1 rides the shared click-through already on these modules. Add an a11y story later only if those shared controls fail a real gap. Do not invent keyboard, contrast, or ARIA criteria on US1.1–US4.1.

Fold-in only: US4.1 so-that says “lists from today”; match Riley’s voice and US1.1 with “lists for today,” and say “marketplace inventory listing” so the destination stays as specific as the other three stories.

## Positions

- AGREE: one P1 persona, four placement stories, hero first — matches Q1 / Q5 / Q6 B and Riley’s scan path on modules already on the page
- AGREE: accepted-risk copy (`Marketplace  $LOW - $HIGH` on hero; `starting at {low}` on the other three) — do not invent a shared visual label
- AGREE: existing click-through to the marketplace listing, no new button, no new page — stories stay inside current module chrome
- AGREE: FR5 fallback as ACs, no a11y story — Q3 A and Q4 X; add a11y later only if shared controls fail
