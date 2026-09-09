# Design System Mapping

How the refined mockups map onto the existing Car and Driver used-car modules. No new visual system (NFR3 in `requirements.md`; Rough Mockups Q5). `wireframes.md` already locked existing patterns; this file names the reuse for Construction (`team-practices.md`).

## Tokens to reuse

| Need | Map to | Do not invent |
|---|---|---|
| Price typeface, size, weight, color | Current price-slot styles on that module | A marketplace color, badge, or new type ramp |
| Hero `Marketplace` label | Current Original MSRP label styles (Q2 A) | A new eyebrow, pill, or icon |
| `starting at {low}` | Current price-slot styles, shrunk on one line when the string is longer (Q3 C) | A wrap rule, tooltip, or truncated “from” chip |
| Original MSRP fallback | Current Original MSRP string and styles the slot already uses | A new MSRP format (`stories.md` accepted risk R-04) |
| Spacing around the slot | Current slot box | A new price well or divider |
| Focus ring on click-through | Current focus styles on the existing control | A new CTA treatment |

Meaning is in the words (`Marketplace` or `starting at`), not in color (NFR1).

## Components to reuse

| Placement (`stories.md`) | Existing home | What changes | What stays |
|---|---|---|---|
| US1.1 MMP hero | Existing make/model-page hero | Price-slot string and hide-while-loading | Hero chrome, model title, existing click-through |
| US2.1 MMP ranking | Existing ranking list on the make/model page | Per-row price-slot string and hide-while-loading | Rank, model name, row layout, existing click-through |
| US3.1 Vehicle-card backs | Existing vehicle-card back (host page unnamed) | Back-face price-slot string and hide-while-loading | Card chrome, flip, existing click-through |
| US4.1 Category cards | Existing category card (host page unnamed) | Card price-slot string and hide-while-loading | Card chrome, category name, existing click-through |

FRE module locators for US3.1 and US4.1 are find-time in the FRE repo, not a new page map (`user-flow.md` starts on current page homes).

## Breakpoints

Reuse the current site breakpoints those four placements already use (NFR2). No mobile-only or desktop-only variant for this increment.

## Loading affordance

Hide the price slot while the existing GraphQL `vehicle_models` read is in flight (Q1 C). Do not add a spinner, skeleton, shimmer, or placeholder glyph from another design system.

## Out of mapping

- New See inventory button
- New click-tracking events
- New page frames
- Design tokens that do not already exist on these modules
