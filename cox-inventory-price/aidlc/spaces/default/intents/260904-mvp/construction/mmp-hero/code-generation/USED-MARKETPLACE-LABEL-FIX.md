# Used-only marketplace + MSRP-style label

Applied in staging; run `apply-fre-changes.sh` to copy into FRE + workspace mirror.

## Product rules (2026-09-08)

1. **MSRP-style layout for Marketplace**
   - Title: `PriceTitleContainer` → `Marketplace` (same component/styles as `MSRP`)
   - Body: `MarketplaceCta` (`hero-price`) → `$LOW - $HIGH` only

2. **Used market years only**
   - Hero passes `marketStatus={yearObject?.market_status}` (existing GraphQL field on hero year).
   - Price section passes marketplace low/high to U1 **only when** `marketStatus?.toLowerCase() === 'used'`.
   - All other statuses → Original MSRP.

3. **vehicleModelId guard**
   - Coerce with `String(vehicleModels.id)` when present.
   - Do not call mapper when id absent (avoids U1 `TypeError`).

## Files

| File | Change |
|------|--------|
| `price-section/index.jsx` | Used gate, split label, mapper guard |
| `price-section/index.test.jsx` | 8 tests incl. used vs new |
| `hero-section/index.jsx` | `marketStatus`, `String(vehicleModelId)` |

## Reference page

Used-year hero example: https://www.caranddriver.com/honda/cr-v

## Docs updated

- `code-summary.md`
- `unit-test-instructions.md`
- `traceability.json`
- `apply-fre-changes.sh`
