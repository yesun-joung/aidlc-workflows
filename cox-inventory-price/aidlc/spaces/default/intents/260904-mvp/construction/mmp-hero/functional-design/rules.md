# Rules — mmp-hero

Placement business rules for U2 (CAD review-article hero). Mapper precedence rules remain in U1 `rules.md` (C1); this unit wires flags, GraphQL fields, and slot chrome.

```yaml
rules:
  - id: BR2.1
    statement: Extend the hero VehicleModelFragment with marketplace low and high on the year price selection used by the hero.
    category: constraint
    applies_to: VehicleModelFragment
    trigger: Hero vehicle_models GraphQL query
    logic: IF loading hero data THEN selection includes price.marketplace high and low for the hero year
    violation: Separate fetch or shared query outside the hero fragment
    source: ADR-002, functional-design Q2 A

  - id: BR2.2
    statement: Call mapMarketplacePrice with copyVariant hero-range and caller-owned formatDollars from price-utils.
    category: policy
    applies_to: ReviewArticlePriceSection
    trigger: Rendering hero price slot after data settle
    logic: IF rendering price THEN invoke U1 with vehicleModelId, inFlight, readFailed, low, high, originalMsrpCopy, formatDollars, copyVariant hero-range
    violation: Inline marketplace copy without U1 or wrong copyVariant
    source: C1, FR1.1

  - id: BR2.3
    statement: While the hero vehicle_models read is in flight, hide the price slot (no title, no text).
    category: policy
    applies_to: ReviewArticlePriceSection
    trigger: inFlight true
    logic: IF inFlight THEN render empty price slot per mapper hide result
    violation: Showing MSRP or marketplace during inFlight
    source: FR5, interaction-spec loading state

  - id: BR2.4
    statement: When mapper returns marketplace copy, render display without the MSRP title.
    category: presentation
    applies_to: ReviewArticlePriceSection
    trigger: hide false and display is marketplace hero-range string
    logic: IF marketplace copy THEN show display only; omit PriceTitleContainer MSRP label
    violation: Duplicate MSRP title above Marketplace string
    source: FR1.1, functional-design Q4 A

  - id: BR2.5
    statement: When mapper returns Original MSRP fallback, keep today MSRP title plus display body.
    category: presentation
    applies_to: ReviewArticlePriceSection
    trigger: hide false and display equals originalMsrpCopy path
    logic: IF MSRP fallback THEN render MSRP title and display as today
    violation: Changing MSRP layout on fallback
    source: FR5.1, AC1.1.2

  - id: BR2.6
    statement: originalMsrpCopy is the existing getFormattedPriceRange output for the hero year price.
    category: constraint
    applies_to: MapMarketplacePriceInput.originalMsrpCopy
    trigger: Building mapper input
    logic: IF building mapper input THEN originalMsrpCopy matches getFormattedPriceRange(price) including est suffix when is_estimate
    violation: Inventing a new MSRP string shape
    source: functional-design Q3 A, accepted risk R-02

  - id: BR2.7
    statement: On GraphQL read error or timeout, set readFailed and fall back to Original MSRP via mapper.
    category: policy
    applies_to: ReviewArticlePriceSection
    trigger: Hero vehicle read fails after attempt
    logic: IF query error or timeout THEN readFailed true, inFlight false, mapper returns originalMsrpCopy
    violation: Blank slot forever or silent failure without MSRP
    source: FR5.2, AC1.1.3

  - id: BR2.8
    statement: Keep existing MarketplaceCta click-through and shop CTAs unchanged.
    category: constraint
    applies_to: ReviewArticlePriceSection
    trigger: Shopper activates existing hero controls
    logic: IF marketplace ingress on THEN price text uses existing MarketplaceCta href helpers; no new button or destination
    violation: New control, VDP destination, or changed href rules
    source: FR1.2, FR1.3, AC1.1.4
```

| ID | Summary |
|----|---------|
| BR2.1 | GraphQL marketplace fields on hero fragment |
| BR2.2 | Call U1 with hero-range |
| BR2.3 | Hide slot while inFlight |
| BR2.4 | Marketplace display without MSRP title |
| BR2.5 | MSRP fallback layout unchanged |
| BR2.6 | originalMsrpCopy from getFormattedPriceRange |
| BR2.7 | readFailed → MSRP fallback |
| BR2.8 | Unchanged click-through |
