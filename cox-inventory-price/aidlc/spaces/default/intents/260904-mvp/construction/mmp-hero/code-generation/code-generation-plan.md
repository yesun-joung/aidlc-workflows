# Code Generation Plan — mmp-hero

Unit U2 UI: wire CAD review-article hero price slot to U1 `mapMarketplacePrice`. Application code ships in the FRE repo (`/Users/yesun.joung/GitHub/media-Platform/services/fre`) with workspace mirrors under `cox-inventory-price/apps/fre/` for `source-manifest.json`.

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "team",
  "ordering": "Implement each applicable testable layer, then write and run that layer's tests.",
  "scope": "mvp",
  "test_strategy": "standard",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "- **Methodology**: test-after\n- **Ordering**: Implement each applicable testable layer, then write and run that layer's tests.\n\nWe treat tests as a first-class deliverable in every Bolt. The merge bar is CI green. There is no coverage number and no coverage floor.\n\nThe active Test Strategy is Standard; that axis still governs test volume and types. We do not invent a coverage tool or report while Languages, Frameworks, and Build System remain Unknown."
    }
  ],
  "obligations": {
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Meet an 80% line-coverage floor.",
      "Run the selected tests in CI before merge."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:040b78a6bdb4b20694597c1eaed55225e309e80a5a46b984f3e6858947c0806a",
  "contract_sha256": "sha256:9ff989ee6a91de56a88a7e91f13ecc6908910f9f1de7f08a72dc0db6c74f6fcc"
}
```

## Story / AC coverage

| Source | Plan coverage |
|--------|----------------|
| US1.1 / AC1.1.1 marketplace copy | Steps 3–4 (fragment + mapper + branch without MSRP title) |
| AC1.1.2 MSRP fallback | Steps 4 (fallback layout) |
| AC1.1.3 read failure | Steps 3–4 (`readFailed` prop + MSRP fallback) |
| AC1.1.4 click-through | Step 4 (unchanged `MarketplaceCta` / shop CTAs) |
| FR5 hide while in flight | Steps 3–4 (`inFlight` → empty slot) |
| NFR design Q2 A branch rule | Step 4 (`display !== originalMsrpCopy`) |

## Steps

Adapted from the Testing Contract for a **frontend-only** brownfield unit (omit data-model, repository, API layers — N/A).

- [x] **Step 1** — Confirm FRE Vitest/Jest setup for `caranddriver` scope; record exact unit-scoped command in `unit-test-instructions.md`.
- [x] **Step 2** — Extend `VehicleModelFragment` `years.price` with `marketplace { high low }` in `caranddriver/components/content/fragments/vehicle-model.js`.
- [x] **Step 3** — Update `hero-section/index.jsx` to pass `vehicleModelId`, `marketplaceLow`/`marketplaceHigh` from year `price.marketplace`, and `inFlight` / `readFailed` (default `false`/`false` at SSR; props ready for client refetch).
- [x] **Step 4** — Update `price-section/index.jsx`: import `mapMarketplacePrice`; build `originalMsrpCopy` via `getFormattedPriceRange`; `formatDollars` via same `formatCurrency` pattern as `price-utils`; apply `{ hide, display }`; branch marketplace vs MSRP with `display !== originalMsrpCopy`; preserve shop CTAs / trade-in / forecast.
- [x] **Step 5** — Add `price-section/index.test.jsx` (~6 tests): inFlight empty slot; marketplace without MSRP title; MSRP fallback with title; readFailed MSRP; `MarketplaceCta` href when ingress on (mock mapper + marketplace utils).
- [ ] **Step 6** — Run unit-scoped test command; keep existing hero tests green.
- [x] **Step 7** — Mirror changed FRE paths under `cox-inventory-price/apps/fre/`; write `source-manifest.json`, `code-summary.md`, `traceability.json`.

## FRE files (indicative)

| File | Change |
|------|--------|
| `apps/fre/scopes/caranddriver/components/content/fragments/vehicle-model.js` | Add marketplace fields on year `price` |
| `apps/fre/scopes/caranddriver/components/content/review/hero-section/index.jsx` | Pass mapper props |
| `apps/fre/scopes/caranddriver/components/content/review/hero-section/price-section/index.jsx` | Mapper + render branches |
| `apps/fre/scopes/caranddriver/components/content/review/hero-section/price-section/index.test.jsx` | New component tests |

## Out of scope this unit

- MotorTrend hero, ranking/card/category placements
- Mapper implementation changes (U1)
- New analytics, AWS, or separate GraphQL query file
- Client refetch wiring beyond prop defaults (unless trivial in hero data path)
