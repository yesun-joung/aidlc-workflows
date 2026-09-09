# Rules — marketplace-price-mapper

Business rules for U1. Source of truth is the fenced YAML block.

```yaml
rules:
  - id: BR1.1
    statement: While the caller’s price read is in flight, the slot must hide (no spinner or skeleton).
    category: policy
    applies_to: MapMarketplacePriceResult
    trigger: mapMarketplacePrice called with inFlight true
    logic: IF inFlight is true THEN hide=true AND display=null
    violation: Showing marketplace or Original MSRP while inFlight
    source: FR5, refined-mockups Q1 C

  - id: BR1.2
    statement: Low and high are both present only when each is a finite number (including zero).
    category: validation
    applies_to: MarketplacePrice.bothPresent
    trigger: Evaluating presence after settle
    logic: IF low is a finite number AND high is a finite number THEN bothPresent=true ELSE bothPresent=false. Omitted, null, or NaN means absent.
    violation: Treating null/NaN/omit as present, or treating 0 as absent
    source: FR5, functional-design Q2 A

  - id: BR1.3
    statement: When both present and copyVariant is hero-range, display Marketplace with formatted low and high.
    category: calculation
    applies_to: MapMarketplacePriceResult.display
    trigger: Settled, not readFailed, bothPresent, copyVariant hero-range
    logic: IF bothPresent AND copyVariant is hero-range THEN display = "Marketplace  " + formatDollars(low) + " - " + formatDollars(high)
    violation: Wrong template, missing $, or using starting-at wording on hero
    source: FR1.1, Q1 A

  - id: BR1.4
    statement: When both present and copyVariant is starting-at, display starting at with formatted low only.
    category: calculation
    applies_to: MapMarketplacePriceResult.display
    trigger: Settled, not readFailed, bothPresent, copyVariant starting-at
    logic: IF bothPresent AND copyVariant is starting-at THEN display = "starting at " + formatDollars(low)
    violation: Showing a range on starting-at slots, or omitting formatDollars
    source: FR2.1 FR3.1 FR4.1, Q1 A

  - id: BR1.5
    statement: When settled and not both present, display the caller’s Original MSRP copy.
    category: policy
    applies_to: MapMarketplacePriceResult.display
    trigger: Settled, not readFailed, bothPresent false
    logic: IF NOT inFlight AND NOT readFailed AND NOT bothPresent THEN hide=false AND display=originalMsrpCopy
    violation: Inventing a new MSRP format or clearing the slot
    source: FR5.1

  - id: BR1.6
    statement: When the caller reports readFailed, display the caller’s Original MSRP copy (same as missing price).
    category: policy
    applies_to: MapMarketplacePriceResult.display
    trigger: readFailed true after settle attempt
    logic: IF NOT inFlight AND readFailed THEN hide=false AND display=originalMsrpCopy
    violation: Retrying GraphQL inside the mapper, or hiding forever on error
    source: FR5.2

  - id: BR1.7
    statement: formatDollars is a caller-owned callback (amount) => string that includes a leading dollar sign.
    category: constraint
    applies_to: MapMarketplacePriceInput.formatDollars
    trigger: Building marketplace display strings
    logic: IF formatting an amount THEN use formatDollars(amount) and do not invent currency formatting inside the mapper
    violation: Mapper inventing its own currency format or requiring a digits-only callback
    source: contract-design R-01, Q1 A

  - id: BR1.8
    statement: The mapper never fetches, retries, or times out GraphQL.
    category: constraint
    applies_to: marketplace-price-mapper
    trigger: Any mapMarketplacePrice call
    logic: IF mapping THEN use only caller-supplied fields; do not perform network I/O
    violation: Shared fetch or retry inside U1
    source: ADR-002, contract Q4 A

  - id: BR1.9
    statement: vehicleModelId is required for identity; mapping logic does not branch on it.
    category: constraint
    applies_to: MarketplacePrice.vehicleModelId
    trigger: mapMarketplacePrice call
    logic: IF call is valid THEN vehicleModelId is present; IF choosing hide/display THEN do not use vehicleModelId in the decision
    violation: Dropping the id from the call or branching copy on id
    source: Q3b A
```

## Rules summary

| ID | Statement (short) | Category |
|----|-------------------|----------|
| BR1.1 | Hide while inFlight | policy |
| BR1.2 | Finite low and high (incl. 0) = both present | validation |
| BR1.3 | hero-range marketplace string | calculation |
| BR1.4 | starting-at low string | calculation |
| BR1.5 | Fallback Original MSRP when not both present | policy |
| BR1.6 | Fallback Original MSRP on readFailed | policy |
| BR1.7 | formatDollars includes `$` | constraint |
| BR1.8 | No fetch/retry in mapper | constraint |
| BR1.9 | vehicleModelId identity-only | constraint |
