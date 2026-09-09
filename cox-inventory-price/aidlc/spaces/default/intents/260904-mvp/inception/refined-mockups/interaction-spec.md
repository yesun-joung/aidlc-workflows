# Interaction Specification

Behaviors for the four price slots in `mockups.md`, traced to `stories.md` US1.1–US4.1 and `requirements.md` FR1–FR5. Flows refine `user-flow.md`. Component tables follow `.cursor/knowledge/aidlc-design-agent/component-spec-template.md`.

## Shared rules

- Marketplace copy appears only when both low and high are present (FR5).
- In-flight read: hide the price slot until the read settles (Q1 C). Hide is a loading rule, not a missing-price rule.
- Settled missing, half-populated, error, or timeout: show the Original MSRP that slot already uses (FR5.1, FR5.2).
- No new button. Activate the control already on the module (FR1.2–FR4.2).
- Destination: existing marketplace inventory listing for that model (or the category card's existing model set). Not a vehicle-detail page (FR1.3–FR4.3).
- No new click events (NFR5). Observe existing click-through after launch (`team-practices.md` does not add analytics work).
- Price string swap is silent — inherit whatever the current slot does when its text changes (Q6 A). Do not add `aria-live`.
- Dollar format: existing module formatter.

```mermaid
flowchart TD
  arrive[Arrives on existing used-car page] --> inflight[Price read in flight]
  inflight --> hide[Price slot hidden]
  hide --> settled{Read settled}
  settled -->|both low and high| market[Marketplace copy]
  settled -->|missing, one-of-two, error, timeout| msrp[Original MSRP that slot already uses]
  market --> click[Existing click-through]
  msrp --> click
  click --> listing[Marketplace inventory listing]
```

Text fallback: shopper arrives → slot hidden while the price read is in flight → both prices present shows marketplace copy, otherwise Original MSRP → existing click-through opens the marketplace listing.

## Hero price slot

| Field | Value |
|---|---|
| Component | Hero price slot |
| Description | Existing MMP hero price slot; first walking-skeleton slice |
| Category | display |

### States

| State | Description | Trigger |
|---|---|---|
| loading | Slot not rendered / not visible | GraphQL `vehicle_models` read in flight |
| marketplace | `Marketplace  $LOW - $HIGH`; label matches current Original MSRP treatment | Read settled with both low and high |
| fallback | Original MSRP that slot already uses | Settled missing, one-of-two, error, or timeout |
| hover | No new hover on the text | — |
| focus | Text is not a new control; focus stays on existing click-through | Tab to existing control |

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| marketplaceLow | number or absent | no | — | Marketplace low from existing `vehicle_models` read |
| marketplaceHigh | number or absent | no | — | Marketplace high from the same read |
| existingMsrpCopy | string | yes | current slot string | Original MSRP the slot already shows |
| readStatus | loading \| settled-ok \| settled-error | yes | loading | In-flight vs settled |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| current site breakpoints | Same copy and hide/show rules; no new breakpoint (NFR2) |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | None new. Keep the slot as text in the existing hero |
| Keyboard interaction | No new keys. Tab / Enter / Space stay on the existing click-through |
| Label | Visible `Marketplace` or existing Original MSRP label |
| Contrast ratio | Inherit current price-slot contrast; must remain WCAG 2.1 AA (NFR1) |
| Screen reader | Silent swap (Q6 A). Hidden while loading |
| Focus management | Do not move focus when the string appears |

### Usage Example

```
<HeroPriceSlot
  marketplaceLow={18400}
  marketplaceHigh={24900}
  existingMsrpCopy={currentHeroMsrp}
  readStatus="settled-ok"
/>
```

## Ranking row price slot

| Field | Value |
|---|---|
| Component | Ranking row price slot |
| Description | Per-row price on the existing MMP ranking |
| Category | display |

### States

| State | Description | Trigger |
|---|---|---|
| loading | That row's slot hidden | That row's price read in flight |
| marketplace | `starting at {low}`; shrink type to one line if needed (Q3 C) | Both low and high present for that row |
| fallback | Original MSRP that row already uses | Missing, one-of-two, error, or timeout on that row |

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| marketplaceLow | number or absent | no | — | Row model low |
| marketplaceHigh | number or absent | no | — | Row model high |
| existingMsrpCopy | string | yes | current row string | Original MSRP that row already shows |
| readStatus | loading \| settled-ok \| settled-error | yes | loading | Per-row read status |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| current site breakpoints | One-line shrink, not wrap; match current ranking layout |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | None new |
| Keyboard interaction | Tab through each row's existing click-through |
| Label | Visible `starting at` words, or existing Original MSRP |
| Contrast ratio | Inherit current row price contrast; WCAG 2.1 AA |
| Screen reader | Silent swap. Hidden while that row is loading |
| Focus management | Do not move focus when a row's string appears |

### Usage Example

```
<RankingRowPriceSlot
  marketplaceLow={18400}
  marketplaceHigh={24900}
  existingMsrpCopy={currentRowMsrp}
  readStatus="settled-ok"
/>
```

## Vehicle-card-back price slot

| Field | Value |
|---|---|
| Component | Vehicle-card-back price slot |
| Description | Price on the existing vehicle-card back |
| Category | display |

### States

Same loading / marketplace / fallback rules as the ranking row (`starting at {low}`; shrink to one line). Host page unnamed (`stories.md` accepted risk R-01).

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| marketplaceLow | number or absent | no | — | Card model low |
| marketplaceHigh | number or absent | no | — | Card model high |
| existingMsrpCopy | string | yes | current back string | Original MSRP the back already shows |
| readStatus | loading \| settled-ok \| settled-error | yes | loading | Card read status |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| current site breakpoints | Same hide/show and one-line shrink; current card-back layout |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | None new |
| Keyboard interaction | Tab to the card, then to its existing click-through |
| Label | Visible `starting at` or existing Original MSRP |
| Contrast ratio | Inherit current card price contrast; WCAG 2.1 AA |
| Screen reader | Silent swap. Hidden while loading |
| Focus management | Do not steal focus on flip or on string appear |

### Usage Example

```
<VehicleCardBackPriceSlot
  marketplaceLow={18400}
  marketplaceHigh={24900}
  existingMsrpCopy={currentCardMsrp}
  readStatus="settled-ok"
/>
```

## Category-card price slot

| Field | Value |
|---|---|
| Component | Category-card price slot |
| Description | Price on the existing category card |
| Category | display |

### States

Same loading / marketplace / fallback rules as the ranking row. Bind to the card's existing `vehicle_models` pair only — no category-wide aggregator (`stories.md` accepted risk R-02).

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| marketplaceLow | number or absent | no | — | Low from that card's existing `vehicle_models` read |
| marketplaceHigh | number or absent | no | — | High from the same read |
| existingMsrpCopy | string | yes | current card string | Original MSRP the card already shows |
| readStatus | loading \| settled-ok \| settled-error | yes | loading | Card read status |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| current site breakpoints | Same hide/show and one-line shrink; current category-card layout |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | None new |
| Keyboard interaction | Tab to the card, then to its existing click-through |
| Label | Visible `starting at` or existing Original MSRP |
| Contrast ratio | Inherit current card price contrast; WCAG 2.1 AA |
| Screen reader | Silent swap. Hidden while loading |
| Focus management | Do not move focus when the string appears |

### Usage Example

```
<CategoryCardPriceSlot
  marketplaceLow={18400}
  marketplaceHigh={24900}
  existingMsrpCopy={currentCategoryMsrp}
  readStatus="settled-ok"
/>
```

## Existing click-through

| Field | Value |
|---|---|
| Component | Existing inventory click-through |
| Description | The control already on each module; not a new button |
| Category | navigation |

### States

| State | Description | Trigger |
|---|---|---|
| default | Current module control, unchanged chrome | Always present on the existing module |
| hover | Current hover | Current site |
| focus | Current visible focus | Tab / click |
| available-on-fallback | Still activatable when the slot shows Original MSRP | Fallback state |

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| destination | existing listing URL | yes | current listing for that model / card set | Marketplace inventory listing, not VDP |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| current site breakpoints | Current control size and placement; no new chrome |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | Native control already on the module |
| Keyboard interaction | Tab to focus; Enter or Space to activate (existing) |
| Label | Current accessible name; do not rename unless FRE already requires it |
| Contrast ratio | Current control contrast; WCAG 2.1 AA |
| Screen reader | Current name and role; no new live region |
| Focus management | Current tab order. Price hide/show does not change tab order |

### Usage Example

```
<ExistingClickThrough
  destination={currentMarketplaceListing}
/>
```
