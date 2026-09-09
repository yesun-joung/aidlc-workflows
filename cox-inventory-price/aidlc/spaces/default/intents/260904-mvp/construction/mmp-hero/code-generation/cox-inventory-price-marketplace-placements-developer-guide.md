# Marketplace Price — Developer Guide (4 Placements)

**Repo:** `media-Platform/services/fre`  
**Scope:** Car and Driver used-car marketplace pricing on four existing UI placements

---

## 1. Purpose

Wire four existing Car and Driver placements to one shared in-repo mapper (`mapMarketplacePrice`) so shoppers see live marketplace prices when both low and high are present, hide the price slot while GraphQL is in flight, fall back to each slot’s existing Original MSRP copy otherwise, and keep existing click-through controls unchanged.

**Out of scope:** new buttons, new analytics, new AWS/network paths, shared fetch, trim/VIN/location pricing, backend changes.

---

## 2. Architecture

```mermaid
flowchart TB
  subgraph placements [UI Placements]
    Hero[MMP Hero]
    Rank[MMP Ranking]
    CardBack[Vehicle Card Back]
    CatCard[Category Card]
  end

  subgraph data [Per-placement GraphQL]
    Q1[Hero vehicle-model fragment]
    Q2[Ranking ranked_list fragment]
    Q3[Make feed fragment]
    Q4[Category page fragment]
  end

  Mapper[mapMarketplacePrice<br/>@autos/utils/map-marketplace-price]

  Hero --> Q1 --> Mapper
  Rank --> Q2 --> Mapper
  CardBack --> Q3 --> Mapper
  CatCard --> Q4 --> Mapper
```

| Layer | Module | Responsibility |
|-------|--------|----------------|
| **Mapper library** | `@autos/utils/map-marketplace-price` | Pure sync function: `{ hide, display }` from flags + prices + `copyVariant` |
| **Each placement** | Hero, ranking, card back, category card | Own GraphQL selection, build `originalMsrpCopy`, call mapper, render in existing chrome, own click-through |
| **GraphQL** | Per placement | Add `price { marketplace { high low } }` on that placement’s query file only |

**Dependencies:** All four placements import the mapper only. Category card work should follow hero (same patterns); ranking and card back can proceed independently once the mapper exists.

---

## 3. Shared Mapper

**Import:** `@autos/utils/map-marketplace-price`  
**File:** `apps/fre/scopes/autos/utils/map-marketplace-price.js`

### 3.1 Call signature

```javascript
mapMarketplacePrice({
  vehicleModelId,    // string, required; validated then discarded (identity-only)
  inFlight,          // boolean, required
  readFailed,        // boolean, required
  low,               // number | null | undefined
  high,              // number | null | undefined
  copyVariant,       // 'hero-range' | 'starting-at'
  originalMsrpCopy,  // exact string slot already uses for MSRP fallback
  formatDollars,     // (amount: number) => string — must include leading $
})
// → { hide: boolean, display: string | null }
```

### 3.2 Precedence (every call)

| Order | Condition | Result |
|-------|-----------|--------|
| 1 | `inFlight === true` | `{ hide: true, display: null }` — empty slot, no skeleton |
| 2 | `readFailed === true` | `{ hide: false, display: originalMsrpCopy }` |
| 3 | Both `low` and `high` are finite numbers (incl. `0`) | Marketplace copy (see below) |
| 4 | Else | `{ hide: false, display: originalMsrpCopy }` |

**Presence rule:** Both prices are present iff each of `low` and `high` is a finite number. `null`, `undefined`, and `NaN` count as absent.

### 3.3 Happy-path copy by `copyVariant`

| `copyVariant` | Placements | Mapper `display` |
|---------------|------------|------------------|
| `hero-range` | MMP hero | `Marketplace  $LOW - $HIGH` |
| `starting-at` | Ranking, card back, category card | `starting at $LOW` |

Placement chrome may uppercase or reformat (e.g. `STARTING AT: $LOW`); the mapper returns lowercase `starting at …`.

### 3.4 Standard caller helpers

```javascript
import { formatCurrency } from '@hdm/utils/currency';

const formatDollars = (amount) =>
  formatCurrency(Number(amount), 'USD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
```

### 3.5 Caller guard pattern (all placements)

```javascript
const normalizedModelId =
  modelId != null && String(modelId).trim() !== ''
    ? String(modelId).trim()
    : null;

const { hide, display } = normalizedModelId
  ? mapMarketplacePrice({ vehicleModelId: normalizedModelId, /* … */ })
  : inFlight
    ? { hide: true, display: null }
    : { hide: false, display: originalMsrpCopy || null };
```

Never call the mapper with a missing or empty `vehicleModelId` — it throws `TypeError`.

### 3.6 Used-market gate

Product rule applied on hero and ranking:

- Pass marketplace `low`/`high` to the mapper **only when** page/year `market_status === 'used'`.
- All other statuses → treat marketplace as absent → MSRP fallback.

Apply the same gate on card back and category card unless product reopens the rule.

---

## 4. Placements

### Summary

| # | Placement | `copyVariant` | Status |
|---|-----------|---------------|--------|
| 1 | MMP hero | `hero-range` | **Shipped** |
| 2 | MMP ranking | `starting-at` | **Staged** (not merged to FRE mainline yet) |
| 3 | Vehicle card back | `starting-at` | **Not started** |
| 4 | Category card | `starting-at` | **Not started** |

---

### 4.1 MMP Hero

**Surface:** Make/model review-article hero price slot  
**Example page:** `/honda/cr-v` (used-year review)

#### Files

| Role | Path (under `apps/fre/scopes/`) |
|------|----------------------------------|
| Orchestrator | `caranddriver/components/content/review/hero-section/index.jsx` |
| Price slot | `caranddriver/components/content/review/hero-section/price-section/index.jsx` |
| GraphQL fragment | `caranddriver/components/content/fragments/vehicle-model.js` |
| Query entry | `caranddriver/components/content/fragments/review-article.js` |
| Shared CTA | `autos/components/marketplace/marketplace-cta` |

#### GraphQL

Add under the hero year `price` block in `vehicle-model.js`:

```graphql
price {
  low
  high
  is_estimate
  marketplace {
    high
    low
  }
}
```

#### Wiring

| Prop | Source |
|------|--------|
| `vehicleModelId` | `vehicleModels?.id` → `String(...)` |
| `marketplaceLow/High` | `price?.marketplace?.low/high` — **only if** `marketStatus === 'used'` |
| `marketStatus` | `yearObject?.market_status` |
| `originalMsrpCopy` | `getFormattedPriceRange(price, …)` + ` est` when `is_estimate` |
| `copyVariant` | `'hero-range'` |
| `inFlight` / `readFailed` | Default `false` at SSR; wire on client refetch when added |

#### Render rules

| State | UI |
|-------|-----|
| `hide` | Empty price slot; shop CTAs below unchanged |
| Marketplace (used + both prices) | Title: `Marketplace` → Body: linked `$LOW - $HIGH` via `MarketplaceCta` (`hero-price`) |
| MSRP fallback | Title: `MSRP` → Body: formatted Voltron range |
| Branch detection | `display !== originalMsrpCopy` |

#### Click-through

- **Price link:** `MarketplaceCta` (`data-id="review-article-price-link"`) → `getMarketplaceHref(marketplaceData)` → Cox marketplace SRP
- **Shop buttons:** existing `getMarketplaceHrefNew/Used/…` — unchanged
- Do not add new buttons

#### Acceptance criteria

| Scenario | Expected |
|----------|----------|
| Both marketplace low and high present (used year) | Marketplace title + linked price range |
| Missing or half-populated marketplace price | Original MSRP layout unchanged |
| GraphQL read fails or times out | Original MSRP layout unchanged |
| Click existing price/shop control | Marketplace inventory listing (not VDP) |

#### Tests

```bash
cd apps/fre/scopes/caranddriver
npm test -- components/content/review/hero-section/price-section/index.test.jsx
npm test -- ../autos/utils/map-marketplace-price.test.js
```

---

### 4.2 MMP Ranking

**Surface:** “Where This Vehicle Ranks” embed on review articles (`data-embed="vehicle-ranking"`)

#### Files

| Role | Path (under `apps/fre/scopes/`) |
|------|----------------------------------|
| Section | `caranddriver/components/content/review/vehicle-ranking/index.jsx` |
| Row + price | `caranddriver/components/content/review/vehicle-ranking/vehicle-ranking-card.jsx` |
| List shaping | `caranddriver/components/content/review/vehicle-ranking/utils.js` |
| GraphQL | `caranddriver/components/content/fragments/vehicle-model.js` (both ranked-list `review_articles.price` blocks) |
| Data | `usePageData('data.content.0')` from review-article page load |

#### GraphQL

Add to **both** ranked-list `review_articles.price` blocks in `vehicle-model.js`:

```graphql
price {
  low
  high
  is_estimate
  marketplace {
    high
    low
  }
}
```

#### Wiring (per row)

| Input | Source |
|-------|--------|
| `vehicleModelId` | `rankedModel.model.id` |
| `marketplaceLow/High` | `price.marketplace` — **only if** page `market_status === 'used'` |
| `marketStatus` | Section passes `currentYear.market_status` |
| `originalMsrpCopy` | `STARTING AT: $${price.low.toLocaleString()}` (existing slot copy) |
| `copyVariant` | `'starting-at'` |
| `inFlight` / `readFailed` | `{ false, false }` at SSR today |

#### Render rules

| State | UI |
|-------|-----|
| `hide` | No `RankPrice` row |
| Marketplace | `STARTING AT: $LOW` |
| MSRP fallback | `STARTING AT: $msrpLow` (existing) |

#### Click-through

- **Shop button:** `MarketplaceCta` (`data-id="vehicle-ranking-shop-button"`) → `marketplace.cox.slug`
- **Row tile:** review article — unchanged
- Do not add new buttons

#### Acceptance criteria

| Scenario | Expected |
|----------|----------|
| Both marketplace prices on row (used page) | `STARTING AT: $LOW` |
| Missing/half marketplace price | Existing `STARTING AT: $msrpLow` |
| Read failure | MSRP fallback per row |
| Shop button | Marketplace listing for that model |

#### Tests

```bash
cd apps/fre/scopes/caranddriver
npm test -- components/content/review/vehicle-ranking/vehicle-ranking-card.test.jsx
npm test -- components/content/review/vehicle-ranking/utils.test.js
```

---

### 4.3 Vehicle Card Back

**Surface:** Flip-card back face on make-page vehicle cards (“All models” year list)  
**Host:** Vehicle make feed pages

#### Files

| Role | Path (under `apps/fre/scopes/`) |
|------|----------------------------------|
| Card back shell | `caranddriver/components/vehicle-card/card-back/index.jsx` |
| Back-face price lines | `caranddriver/components/vehicle-card/all-models-card/index.jsx` |
| Card wrapper | `caranddriver/components/vehicle-card/vehicle-card.jsx` |
| Host / data | `caranddriver/components/feed/vehicle-make/vehicle-card-container/index.jsx` |
| Price helpers | `caranddriver/components/vehicle-card/utils.js` |
| GraphQL | `caranddriver/components/feed/fragments/vehicle-make-feed.js` |
| Page query | `caranddriver/components/feed/fragments/vehicle-make.js` |
| Front-face shop | `caranddriver/components/vehicle-card/card-details-panel/price-section.jsx` |

#### Current behavior

- Back face: `Starting at ${getFormattedPrice(yearObj)}` (+ ` est`) per year
- Price text is static inside `ModelLink`
- No mapper; no `price.marketplace` in GraphQL

#### Implementation steps

1. Extend `vehicle-make-feed.js` with `price.marketplace { high low }` per model/year
2. Build `originalMsrpCopy` from the current `Starting at …` string
3. Call `mapMarketplacePrice` with `copyVariant: 'starting-at'` and used-market gate
4. Render mapper output in existing chrome; `hide` → empty line
5. Leave click-through unchanged

#### Click-through

- **Back-face row:** `ModelLink` (`data-id="vehicle-card-all-models-link"`) → review article
- **Front-face shop:** `MarketplaceCta` → `getMarketplaceHref(marketplace)` → marketplace listing

#### Acceptance criteria

| Scenario | Expected |
|----------|----------|
| Both marketplace prices present | `starting at {low}` in slot chrome |
| Missing/half/error | Original MSRP string slot already uses |
| Existing card control | Marketplace listing for that model |

#### Tests

Add component tests mocking `@autos/utils/map-marketplace-price` near `all-models-card` or `card-back`.

**Status:** Not started

---

### 4.4 Category Card

**Surface:** Primary/secondary vehicle cards on category and ranked-list preview pages

#### Files

| Role | Path (under `apps/fre/scopes/`) |
|------|----------------------------------|
| Primary card | `caranddriver/components/category/ranked-list-preview/primary-vehicle-card.jsx` |
| Secondary card | `caranddriver/components/category/ranked-list-preview/secondary-vehicle-card.jsx` |
| Layout | `caranddriver/components/category/ranked-list-preview/cards-layout/index.jsx` |
| Category host | `caranddriver/components/category/groups-section/index.jsx` |
| Shared price slot | `caranddriver/components/vehicle-card/card-details-panel/price-section.jsx` |
| GraphQL | `autos/fragments/vehicle-category-page.js` |
| Adapter | `autos/page-utils/category-page-adapter.js` |
| Data loaders | `pages/_templates/category/_data/index.js`, `pages/_templates/ranked-list/_data/index.js` |

**Price source:** Use the marketplace low/high from **that card’s own** `vehicle_models` read — do not aggregate across the category.

#### Current behavior

- `PriceSection`: `Starting at` + `$price.low.toLocaleString()` (+ ` est`)
- Separate `MarketplaceCta` shop button when ingress is on
- `content.price` and `content.marketplace` are separate fields — no `price.marketplace` yet

#### Implementation steps

1. Add `marketplace { high low }` under `content.price` in `vehicle-category-page.js`
2. Pass `vehicleModelId`, marketplace fields, and flags into `PriceSection`
3. Call mapper with `copyVariant: 'starting-at'`; build `originalMsrpCopy` from current `Starting at …` string
4. Render marketplace or MSRP in existing label chrome; `hide` → empty slot
5. Keep `MarketplaceCta` (`data-id="marketplace-cta-vehicle-card"`) → `getMarketplaceHref`

#### Click-through

- **Shop CTA:** marketplace SRP for that card’s model
- **Title/image links:** review article — unchanged
- Price text is not linked today

#### Acceptance criteria

| Scenario | Expected |
|----------|----------|
| Both marketplace prices for card’s model | `starting at {low}` |
| Missing/half/error | Original MSRP string slot already uses |
| Shop CTA | Marketplace listing for that model set |

#### Tests

- `category/ranked-list-preview/primary-vehicle-card.test.js`
- `category/ranked-list-preview/secondary-vehicle-card.test.js`
- Extend or add `price-section` mapper tests

**Status:** Not started

---

## 5. Cross-Placement Comparison

| Concern | Hero | Ranking | Card back | Category card |
|---------|------|---------|-----------|---------------|
| **Happy copy** | `Marketplace $LOW - $HIGH` | `starting at {low}` | `starting at {low}` | `starting at {low}` |
| **Placement chrome** | MSRP-style title + linked body | `STARTING AT: $LOW` | `Starting at …` | `Starting at …` |
| **`copyVariant`** | `hero-range` | `starting-at` | `starting-at` | `starting-at` |
| **Granularity** | One hero / page | Per ranking row | Per year line on back | Per card |
| **Original MSRP** | Voltron formatted range | `STARTING AT: $low` | `Starting at $formatted` | `Starting at $low` |
| **Used-only gate** | Yes | Yes (staged) | Recommended | Recommended |
| **Click-through** | Price link + shop CTAs | Shop button | ModelLink / front shop | Shop CTA |
| **GraphQL file** | `vehicle-model.js` | `vehicle-model.js` (ranked_list) | `vehicle-make-feed.js` | `vehicle-category-page.js` |

---

## 6. Test Fixtures (all placements)

Reuse the same fixture set everywhere:

| Fixture | Expected |
|---------|----------|
| Both low + high present | Marketplace copy |
| Low only / high only / neither | Original MSRP (slot stays visible) |
| GraphQL error / timeout | Original MSRP |
| Click-through | Works on marketplace copy **and** MSRP fallback; lands on marketplace listing, not VDP |

Write tests after implementation. Merge bar: CI green on scoped test commands.

---

## 7. Suggested Delivery Order

| Phase | Work | Validates |
|-------|------|-----------|
| **1** | Mapper + hero | End-to-end path: GraphQL → mapper → slot → click-through |
| **2** | Ranking | Second placement, `starting-at`, per-row |
| **3** | Card back | Back-face module wired |
| **4** | Category card | Fourth placement; MVP complete when all four ship |

Hero should land first; the other three can be separate PRs once the mapper is in mainline.

---

## 8. Implementation Checklist (per placement)

- [ ] Extend **this placement’s** GraphQL with `price.marketplace { high low }`
- [ ] Build `originalMsrpCopy` from the **exact string the slot shows today**
- [ ] Wire `formatDollars`, `inFlight`, `readFailed`, `vehicleModelId`
- [ ] Apply **used-only gate** (`market_status === 'used'`)
- [ ] Call `mapMarketplacePrice` with the correct `copyVariant`
- [ ] Render `{ hide, display }` in existing chrome; no spinner when `hide`
- [ ] Leave click-through control(s) unchanged
- [ ] Add component tests with mocked mapper
- [ ] Run scoped `npm test`; open FRE PR

---

## 9. Notes for implementers

- **Original MSRP** means whatever that slot already displayed — may be a range, `Starting at`, or empty. Do not invent a new MSRP format.
- **In flight:** hide the price slot entirely (no skeleton). Shop CTAs on hero may remain visible.
- **Parallel PRs:** multiple placements may touch the same FRE tree; coordinate merges on shared files (`vehicle-model.js`, shared `price-section.jsx`).
- **Mapper changes** that alter required inputs, output meaning, or `copyVariant` values need agreement across all four placements before merge.

---

*Last updated: 2026-09-09*
