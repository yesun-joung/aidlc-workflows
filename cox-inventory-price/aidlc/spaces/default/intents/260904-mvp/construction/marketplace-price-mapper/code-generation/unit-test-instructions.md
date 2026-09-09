# Unit Test Instructions — marketplace-price-mapper

## Framework and setup

- Use **FRE’s existing** frontend test runner (Jest/Vitest/whatever the FRE tree already uses). Do not invent a second runner or coverage reporter while Languages/Frameworks remain Unknown in AIDLC state.
- Test-after: implement `mapMarketplacePrice` first, then add tests (Testing Contract methodology).
- Strategy volume (Standard): about **5–8 tests** for this one library component, covering the cases below. No integration/E2E for U1 (no I/O).

## Exact unit-scoped command

Record the real command after locating FRE’s test script (examples only until Code Generation finds the repo config):

```bash
cd /Users/yesun.joung/GitHub/media-Platform/services/fre/apps/fre/scopes/autos
npm test -- utils/map-marketplace-price.test.js
```

Verified: 8 passed (Vitest via scope-vitest). Build and Test re-runs this exact command.

## Cases to cover (NFR7.1 / security-design)

1. `inFlight: true` → `{ hide: true, display: null }`
2. Both present with `0` → marketplace copy (not MSRP)
3. String `low`/`high` → Original MSRP (no coercion; `typeof === "number" && Number.isFinite`)
4. Half/missing low or high → Original MSRP
5. `readFailed: true` → Original MSRP
6. Blank `vehicleModelId` (omit / `null` / non-string / `""` / whitespace) → throws `TypeError`
7. `copyVariant: "hero-range"` → `Marketplace  $… - $…` via `formatDollars`
8. `copyVariant: "starting-at"` → `starting at $…` via `formatDollars`

## Mocking

- Stub `formatDollars` as `(n) => "$" + String(n)` (or FRE’s real formatter if already imported in tests).
- Do not mock GraphQL — mapper never fetches.

## Coverage / CI

- Merge bar: FRE PR CI green (team practice). Team affirmed **no coverage number**; still run these unit tests in the existing FRE PR suite (infrastructure-design Q2 A).
- Do not weaken or disable any CI gate to make the step pass.

## How to run THIS UNIT only

Use the file-scoped command above. Do not use an unscoped project-wide `npm test` as the recorded unit command.
