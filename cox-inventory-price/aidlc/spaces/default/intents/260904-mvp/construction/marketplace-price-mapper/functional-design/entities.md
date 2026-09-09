# Entities — marketplace-price-mapper

Logical data for U1 (library). Technology-agnostic. Source of truth is the fenced YAML block.

```yaml
entities:
  - name: MarketplacePrice
    description: >
      Derived value for one vehicle model’s marketplace pair and copy variant.
      Not persisted. Built per call from caller inputs.
    identifier: vehicleModelId
    attributes:
      - name: vehicleModelId
        logical_type: string
        required: true
        unique: false
        description: Identity only — each placement passes the id it already has; mapping does not branch on it (Q3b A)
      - name: low
        logical_type: number | null
        required: false
        description: Marketplace low when settled
      - name: high
        logical_type: number | null
        required: false
        description: Marketplace high when settled
      - name: bothPresent
        logical_type: boolean
        required: true
        description: True iff low and high are each a finite number, including 0 (Q2 A)
      - name: copyVariant
        logical_type: enum
        required: true
        allowed_values: [hero-range, starting-at]
    constraints:
      - bothPresent is derived from low/high; callers must not invent a second presence rule
    relationships: []

  - name: MapMarketplacePriceInput
    description: Caller-supplied arguments to the sync mapMarketplacePrice function (contract C1–C4).
    identifier: null
    attributes:
      - name: vehicleModelId
        logical_type: string
        required: true
      - name: inFlight
        logical_type: boolean
        required: true
      - name: readFailed
        logical_type: boolean
        required: true
      - name: low
        logical_type: number | null
        required: false
      - name: high
        logical_type: number | null
        required: false
      - name: copyVariant
        logical_type: enum
        required: true
        allowed_values: [hero-range, starting-at]
      - name: originalMsrpCopy
        logical_type: string
        required: true
        description: Exact Original MSRP string the slot already uses
      - name: formatDollars
        logical_type: function
        required: true
        description: "(amount: number) => string; return includes leading $ (Q1 A)"
    constraints:
      - Mapper never fetches GraphQL; inFlight and readFailed are owned by the caller
    relationships: []

  - name: MapMarketplacePriceResult
    description: Sync return from mapMarketplacePrice (Q4 A).
    identifier: null
    attributes:
      - name: hide
        logical_type: boolean
        required: true
        description: True only while inFlight
      - name: display
        logical_type: string | null
        required: false
        description: Null when hide is true; otherwise marketplace copy or originalMsrpCopy
    constraints:
      - When hide is true, display must be null
      - When hide is false, display must be a non-null string
    relationships: []
```

## Summary

| Entity | Role |
|--------|------|
| MarketplacePrice | Domain value for the pair + variant (identity + derived bothPresent) |
| MapMarketplacePriceInput | Call boundary from U2–U5 |
| MapMarketplacePriceResult | `{ hide, display }` only — no structured MarketplacePrice on the wire (Q4 A) |
