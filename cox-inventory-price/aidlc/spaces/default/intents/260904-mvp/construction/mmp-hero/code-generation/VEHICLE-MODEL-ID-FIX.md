# Fix: vehicleModelId TypeError in price-section

U1 `mapMarketplacePrice` throws when `vehicleModelId` is blank or not a string. The price section was defaulting to `''` and always calling the mapper.

## Root cause

- `vehicleModelId = ''` default → mapper `assertVehicleModelId` throws
- GraphQL `id` may be absent in tests/mocks, or not yet a string at runtime

## Fix

1. **`price-section/index.jsx`** — normalize id; call mapper only when present; otherwise MSRP / inFlight hide
2. **`hero-section/index.jsx`** — pass `String(vehicleModels.id)` when id exists

Apply staged files:

```bash
WS="/Users/yesun.joung/GitHub/aidlc-workflows/cox-inventory-price"
FRE="/Users/yesun.joung/GitHub/media-Platform/services/fre/apps/fre/scopes/caranddriver"
ST="$WS/aidlc/spaces/default/intents/260904-mvp/construction/mmp-hero/code-generation/staging/apps/fre/scopes/caranddriver"

cp "$ST/components/content/review/hero-section/price-section/index.jsx" \
   "$FRE/components/content/review/hero-section/price-section/index.jsx"
cp "$WS/apps/fre/scopes/caranddriver/components/content/review/hero-section/price-section/index.jsx" \
   "$FRE/components/content/review/hero-section/price-section/index.jsx" 2>/dev/null || true
```

Hero index one-line change:

```jsx
vehicleModelId={
  vehicleModels?.id != null ? String(vehicleModels.id) : undefined
}
```

## Expected behaviour

| `vehicleModels.id` | Behaviour |
|--------------------|-----------|
| Present (string or number) | Mapper runs with `String(id)` |
| Absent | MSRP fallback; **no mapper call** (no throw) |
| `inFlight` + absent id | Empty slot |

Production review articles with `vehicle_models.id` from the existing query use marketplace copy when prices are present.
