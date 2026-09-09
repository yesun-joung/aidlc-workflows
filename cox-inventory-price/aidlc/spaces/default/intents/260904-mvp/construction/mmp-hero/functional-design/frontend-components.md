# Frontend Components — mmp-hero

Car and Driver review-article hero price slot. Hierarchy and props for Code Generation.

## Component hierarchy

```
ReviewArticleHero (caranddriver/.../hero-section/index.jsx)
└── ReviewArticlePriceSection (caranddriver/.../price-section/index.jsx)
    ├── PriceTitleContainer (MSRP label — fallback only)
    ├── MarketplaceCta | PriceValues (price text + existing click-through)
    ├── HeroPriceCtasWrapper (shop used/new/certified — unchanged)
    └── TradeInCta / CarValueForecast (unchanged)
```

## ReviewArticlePriceSection

| Prop / input | Source | Notes |
|--------------|--------|-------|
| `price` | Year Voltron price object | Existing MSRP input to `getFormattedPriceRange` |
| `marketplaceLow` / `marketplaceHigh` | GraphQL `price.marketplace` on hero year | New selection on fragment |
| `vehicleModelId` | `vehicle_models[0].id` | Required for mapper |
| `inFlight` | Page/loader loading state | true during client refetch |
| `readFailed` | Query error / timeout | Drives MSRP fallback |
| `marketplace` | Existing cox slug object | Unchanged ingress + href |
| `year` | Current model year | Unchanged shop CTAs |
| `showCarValueForecast` | Existing flag | Unchanged |

### Internal behaviour

1. Compute `originalMsrpCopy` from `getFormattedPriceRange(price, …)` (+ ` est`).
2. Import `mapMarketplacePrice` from `@autos/utils/map-marketplace-price`.
3. `{ hide, display } = mapMarketplacePrice({ … copyVariant: 'hero-range' … })`.
4. If `hide`, return price container with **no** title/text (shop CTAs below remain unchanged).
5. If marketplace copy (`display` starts with `Marketplace`), render `display` inside existing `MarketplaceCta` or `PriceValues` without `MSRP` title.
6. Else render `MSRP` title + `display` as today.

### Interaction flows

| Flow | Trigger | UI |
|------|---------|-----|
| Loading | `inFlight` | Empty price slot |
| Marketplace | both prices | `Marketplace  $LOW - $HIGH` in existing link chrome |
| Fallback | missing/half/error | `MSRP` + formatted Voltron range |
| Click-through | click price link | Existing marketplace listing URL |

### Form validation

N/A — display-only slot.

### API integration

- **GraphQL:** extend `VehicleModelFragment` — add under hero year `price`: `marketplace { high low }` (field names per schema).
- **Library:** `@autos/utils/map-marketplace-price` sync import only; no new network from mapper.

## Tests (Code Generation hint)

Extend or add tests near `caranddriver/.../hero-section/index.test.jsx` and/or new `price-section/index.test.jsx`: mock mapper; assert hide, marketplace string, MSRP fallback, and that `MarketplaceCta` still receives `href` from existing utils.
