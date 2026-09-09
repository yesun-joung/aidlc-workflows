# Accessibility Checklist

WCAG 2.1 AA on the four placements (NFR1 in `requirements.md`; Rough Mockups Q7). Stories have no dedicated accessibility story (`stories.md` Q4 X / accepted risk R-03). This checklist binds NFR1 to the existing controls so Construction does not invent a new a11y surface. Keyboard and contrast follow current Car and Driver chrome (`wireframes.md`, `team-practices.md` Code Style: do not invent a new guide).

## Bar

- WCAG 2.1 Level AA on MMP hero, MMP ranking, vehicle-card backs, and category cards.
- Keyboard access to the existing click-through.
- Contrast on reused price text and the existing control.
- Meaning not by color alone — `Marketplace` or `starting at` is visible text (Q5 A).
- Price swap is silent (Q6 A). No new `aria-live`.

## Shared checks

| Check | Pass | Fail |
|---|---|---|
| Existing click-through is reachable by Tab and activatable with Enter or Space | Current control still works after the string change | New button, mouse-only hit target, or lost tab stop |
| Visible focus on that control | Current focus ring remains | `outline: none` with no replacement |
| Price meaning not by color alone | Words `Marketplace` or `starting at` (or Original MSRP) are visible | Color-only badge or tint to mark marketplace |
| Contrast of reused price text | Current price styles still meet 4.5:1 (3:1 if already large text) | New color that drops below AA |
| Loading hide | Slot not shown while the read is in flight; no unlabeled spinner | Spinner without accessible name, or slot hidden after the read has settled |
| Silent swap | No new live region when marketplace copy or Original MSRP appears | Added `aria-live` or focus jump |
| Tab order | Hide/show of the slot does not insert a new tab stop or skip the existing control | Price text becomes a new link |
| Touch target on existing control | Current target size stays; no smaller replacement | New text-only link below 44×44 CSS px |
| `prefers-reduced-motion` | No new motion on the string swap | Added animation on the price change |

## Per placement

| Placement | Keyboard entry | Heading / landmark (existing) | Notes |
|---|---|---|---|
| RM-1 Hero | Tab to the hero's existing click-through | Keep current hero heading and page landmarks | First slice; same checks as the other three |
| RM-2 Ranking | Tab through each row's existing click-through | Keep current ranking heading | Per-row hide must not trap keyboard on an empty slot |
| RM-3 Card backs | Tab to the card, then to its existing click-through | Keep current card title semantics | Flip behavior stays current; do not add a second control |
| RM-4 Category cards | Tab to the card, then to its existing click-through | Keep current category name semantics | Same as card backs |

## Out of this increment

- A new accessibility story unless a real gap appears on these shared controls.
- New ARIA roles, labels, or live regions.
- A coverage number or automated-scan floor (`team-practices.md`).
