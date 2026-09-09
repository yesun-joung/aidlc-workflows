## Sources

- [scope] Workflow-selected scope: `mvp`. Bolt 1 walking skeleton with U1 `marketplace-price-mapper` (shipped).
- Unit: `mmp-hero` (U2, ui) — implements US1.1 / FR1.
- Upstream: `unit-of-work.md`, `contract-summary.md` (C1), `requirements.md` FR1/FR5, `stories.md` AC1.1.x, `interaction-spec.md` hero slot, `components.md` MmpHero.
- FRE brownfield (CAD review-article hero): `caranddriver/components/content/review/hero-section/price-section/index.jsx`, `caranddriver/components/content/fragments/vehicle-model.js` (`VehicleModelFragment`), `map-marketplace-price.js` at `@autos/utils/map-marketplace-price`.

Already locked — do not reopen: hero `copyVariant` `hero-range`; hide while inFlight; Original MSRP fallback; no new button or analytics; marketplace copy only when both low and high present; click-through to existing marketplace listing; Car and Driver placements only (`requirements.md`).

## Q1. Which FRE hero surface is in scope for this unit?

Both brands share autos patterns, but requirements and stories target **Car and Driver** used-car placements. MotorTrend has a separate hero price section under `motortrend/.../hero-section`.

- A. **Car and Driver only** — `caranddriver/.../review/hero-section` and its `price-section` (Bolt 1 walking skeleton)
- B. Car and Driver and MotorTrend heroes in the same unit
- C. MotorTrend only
- X. Other (please specify)

[Answer]: A

## Q2. Where should `price { marketplace { high low } }` be added?

Each placement owns its `vehicle_models` query file (`decisions.md` ADR-002). CAD hero data flows through `VehicleModelFragment` in `caranddriver/components/content/fragments/vehicle-model.js`, loaded by `VEHICLE_DATA_QUERY` on the review-article template.

- A. Extend **`VehicleModelFragment`** on the existing `vehicle_models` / year `price` selection used by the hero (same query file the hero already uses)
- B. Add a separate hero-only GraphQL query file
- C. Fetch marketplace prices in the hero component with a new client query
- X. Other (please specify)

[Answer]: A

## Q3. How should the hero build `originalMsrpCopy` for the mapper?

Today CAD hero builds `priceString` via `getFormattedPriceRange(price, …)` from the year’s Voltron `price { low high is_estimate }` and renders a separate `MSRP` title plus that string.

- A. Pass **`getFormattedPriceRange(price, …)`** (plus optional ` est` suffix when `is_estimate`) as `originalMsrpCopy` — the exact visible MSRP the slot already shows today
- B. Pass only the numeric range without the `MSRP` label; hero keeps the `MSRP` title for fallback
- C. Pass empty string when `priceString` is empty today
- X. Other (please specify)

[Answer]: A

## Q4. How should marketplace display replace today’s MSRP chrome?

Mapper `hero-range` returns the full shopper string `Marketplace  $LOW - $HIGH` in `display` (U1 locked). Today the hero uses a separate `PriceTitleContainer` (`MSRP`) plus the range body.

- A. When mapper returns `hide: false` and marketplace copy (display starts with `Marketplace`), **render `display` as the visible price text** and **omit the `MSRP` title**; when fallback MSRP, keep today’s `MSRP` title + `display` body (same as current layout)
- B. Always keep the `MSRP` title; append mapper `display` below it
- C. Replace the entire price block (title + values) with mapper `display` for both marketplace and MSRP fallback
- X. Other (please specify)

[Answer]: A

## Q5. When is `inFlight` true for the hero?

Review-article vehicle data is loaded via SSR (`getVehicleProps` + `VEHICLE_DATA_QUERY`) before first paint. Client refetch paths may exist on navigation.

- A. **`inFlight=false` at SSR render** (data settled before HTML). Set `inFlight=true` only when a **client-side** hero vehicle read is outstanding (e.g. Apollo refetch / route transition loading), matching interaction-spec hide-while-in-flight where applicable
- B. Always `inFlight=false` — SSR-only; hide path is untestable on hero and accepted as N/A
- C. Always `inFlight=true` until client hydration completes
- X. Other (please specify)

[Answer]: A

## Q6. When is `readFailed` true?

- A. **`readFailed=true`** when the hero’s vehicle GraphQL read **errors or times out** after an attempt; pass settled `low`/`high` as null. On SSR loader failure, fall back to existing page error handling **and** treat price read as failed for mapper (`readFailed=true`, MSRP fallback)
- B. `readFailed` stays false; rely on missing low/high for fallback only
- X. Other (please specify)

[Answer]: A

## Q7. Which existing dollar formatter should `formatDollars` use?

- A. Reuse **`getFormattedPriceRange`’s underlying single-dollar formatter** from `@caranddriver/page-utils/price-utils` (or a thin wrapper that returns one amount with leading `$` per U1 Q1 A)
- B. Inline `(n) => '$' + n` in the hero
- C. New shared formatter module
- X. Other (please specify)

[Answer]: A

## Q8. What stays unchanged in the hero price section?

- A. **Keep** existing `MarketplaceCta` click-through (`variant="hero-price"`, `getMarketplaceHref`, shop CTAs), trade-in flag block, car-value-forecast skip link, and marketplace ingress gating — only swap how the **price text** is chosen (mapper + hide)
- B. Replace MarketplaceCta with plain text for marketplace copy
- C. Change href targets for marketplace copy
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- **Scope:** Car and Driver review-article hero only (`caranddriver/.../price-section`) (Q1 A)
- **GraphQL:** Add `price { marketplace { high low } }` on the hero’s existing `VehicleModelFragment` selection (Q2 A)
- **Mapper call:** Import `@autos/utils/map-marketplace-price`; `copyVariant: 'hero-range'`; pass `vehicleModelId`, flags, marketplace low/high, `originalMsrpCopy` from `getFormattedPriceRange`, and `formatDollars` from price-utils (Q3 A, Q7 A)
- **Render:** `hide` → render no price text (empty slot); marketplace → show mapper `display` without `MSRP` title; MSRP fallback → keep today’s `MSRP` title + `display` (Q4 A)
- **Flags:** SSR settled → `inFlight=false`; client refetch → `inFlight=true`; query error/timeout → `readFailed=true` (Q5 A, Q6 A)
- **Click-through:** Unchanged MarketplaceCta and shop CTAs (Q8 A)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
