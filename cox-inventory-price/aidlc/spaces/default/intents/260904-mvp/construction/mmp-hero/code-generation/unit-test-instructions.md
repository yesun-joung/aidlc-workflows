# Unit Test Instructions — mmp-hero

## Framework and setup

- Use **FRE’s existing** frontend test runner (Vitest via scope config, same as hero `index.test.jsx` and U1 mapper tests).
- Test-after: implement price-section wiring first, then add tests (Testing Contract methodology).
- Standard strategy: **8 component tests** for `ReviewArticlePriceSection` (mock U1 mapper and marketplace CTA utils).

Apply latest sources before testing:

```bash
bash aidlc/spaces/default/intents/260904-mvp/construction/mmp-hero/code-generation/apply-fre-changes.sh
```

## Exact unit-scoped command

```bash
cd /Users/yesun.joung/GitHub/media-Platform/services/fre/apps/fre/scopes/caranddriver
npm test -- components/content/review/hero-section/price-section/index.test.jsx
```

## Cases to cover (NFR7.1 / cicd-pipeline / security-design)

1. `inFlight: true` → no title, no price text (empty slot); shop CTAs unchanged when marketplace ingress on
2. **`marketStatus: 'used'`** + both marketplace prices → **`Marketplace` title** (same row style as MSRP) + linked **`$LOW - $HIGH`** body; mapper receives low/high
3. **`marketStatus: 'new'`** (or non-used) with marketplace prices → MSRP fallback; mapper receives `low`/`high` as `undefined`
4. MSRP fallback (`display === originalMsrpCopy`) → `MSRP` title + body
5. `readFailed: true` → MSRP fallback; no error string in slot
6. Marketplace ingress on + used marketplace copy → `MarketplaceCta` receives expected `href`
7. `hide: true` from mapper → empty price text region
8. Absent `vehicleModelId` → MSRP fallback; mapper **not** called (no U1 `TypeError`)

## Mocking

- `vi.mock('@autos/utils/map-marketplace-price', () => ({ mapMarketplacePrice: vi.fn(...) }))`
- Mock `@autos/components/marketplace/marketplace-cta/utils` (`useDisplayMarketplaceCTA`, href helpers) as existing hero tests do
- Mock `@media-platforms/flagger` `useFlag` for trade-in / forecast flags

## Coverage / CI

- Merge bar: FRE PR CI green (team practice). Run this file’s tests in the FRE PR suite.
- Do not weaken CI gates to pass.

## How to run THIS UNIT only

Use the file-scoped command above. Do not record an unscoped project-wide `npm test` as the unit command.
