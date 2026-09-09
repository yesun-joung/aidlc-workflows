# Code Summary — marketplace-price-mapper

## What shipped

Plain JavaScript sync mapper `mapMarketplacePrice` for in-repo FRE import.

| Path | Role |
|------|------|
| `apps/fre/scopes/autos/utils/map-marketplace-price.js` | Implementation |
| `apps/fre/scopes/autos/utils/map-marketplace-price.test.js` | Vitest unit tests |

Import alias for consumers: `@autos/utils/map-marketplace-price`.

## Behaviour

- Blank `vehicleModelId` → `TypeError`
- `inFlight` → hide
- `readFailed` / not both present → caller `originalMsrpCopy`
- Both present (`typeof === "number" && Number.isFinite`) → hero-range or starting-at via `formatDollars`
- No fetch, logging, or analytics

## Not done in this unit

- Wiring MMP hero / ranking / cards (U2–U5)
- GraphQL query selection changes

## Tests

```bash
cd apps/fre/scopes/autos
npm test -- utils/map-marketplace-price.test.js
```
