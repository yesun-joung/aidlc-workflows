# Code Summary — mmp-hero

## What shipped

CAD review-article hero price slot wired to U1 `mapMarketplacePrice`.

| Path | Role |
|------|------|
| `apps/fre/scopes/caranddriver/components/content/fragments/vehicle-model.js` | Add `marketplace { high low }` on year `price` |
| `apps/fre/scopes/caranddriver/components/content/review/hero-section/index.jsx` | Pass mapper props + `marketStatus` from hero year |
| `apps/fre/scopes/caranddriver/components/content/review/hero-section/price-section/index.jsx` | Mapper, used-only gate, MSRP-style Marketplace label |
| `apps/fre/scopes/caranddriver/components/content/review/hero-section/price-section/index.test.jsx` | Component tests (mocked mapper) |

Ship target: `/Users/yesun.joung/GitHub/media-Platform/services/fre` (FRE PR). Workspace mirror under `cox-inventory-price/apps/fre/`.

Apply staged sources to FRE + mirror:

```bash
bash aidlc/spaces/default/intents/260904-mvp/construction/mmp-hero/code-generation/apply-fre-changes.sh
```

## Behaviour

### Marketplace (used years only)

- **`market_status === 'used'`** on the hero year (`yearObject.market_status`) — only then pass marketplace low/high to the mapper.
- **Label layout matches MSRP:** `PriceTitleContainer` → **Marketplace**; linked body → **`$LOW - $HIGH`** via `MarketplaceCta` (`hero-price`), not inline `Marketplace  $LOW - $HIGH`.
- Example: used-year review pages such as [caranddriver.com/honda/cr-v](https://www.caranddriver.com/honda/cr-v).

### MSRP fallback

- Non-`used` market status (`new`, `future`, `archived`, …) → Original MSRP even when marketplace GraphQL fields are present.
- Missing marketplace prices, `readFailed`, or absent `vehicleModelId` → MSRP title + body (` est` in string when estimate).
- **`inFlight`:** empty price slot; shop CTAs unchanged.

### Implementation notes

- Branch rule: mapper `display !== originalMsrpCopy`; UI splits marketplace title/body in the price section.
- `vehicleModelId` comes from existing `vehicle_models.id` (no new GraphQL field); coerce with `String(...)`; skip mapper when absent (avoids U1 `TypeError`).
- New GraphQL selection: `price.marketplace { high low }` on hero year only.

## Hero wrapper props (SSR defaults)

- `vehicleModelId={vehicleModels?.id != null ? String(vehicleModels.id) : undefined}`
- `marketplaceLow={price?.marketplace?.low}` / `marketplaceHigh={price?.marketplace?.high}`
- `marketStatus={yearObject?.market_status}`
- `inFlight={false}` / `readFailed={false}`

## Product change log (post–functional-design)

| Date | Change |
|------|--------|
| 2026-09-08 | Marketplace hero price **used market years only** (was: both prices present on any status). |
| 2026-09-08 | Marketplace label uses **MSRP-style title row** + price body (was: single-line mapper string in link). |

## Not done in this unit

- Client refetch wiring beyond prop defaults
- Other placements (ranking, cards, category)
- Mapper copy/template changes (U1)

## Tests

```bash
cd /Users/yesun.joung/GitHub/media-Platform/services/fre/apps/fre/scopes/caranddriver
npm test -- components/content/review/hero-section/price-section/index.test.jsx
```

Covers: inFlight hide; used + marketplace title/body; non-used MSRP; readFailed; href; absent model id; mapper hide.
