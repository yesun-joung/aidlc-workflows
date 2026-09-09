# Tech Stack Decisions — mmp-hero

Technology choices for U2. Brownfield extension of the Car and Driver review-article hero in FRE.

## Decisions

| Decision | Choice | Rationale | Source |
|----------|--------|-----------|--------|
| UI framework | Existing CAD React JSX components | Brownfield hero; no new framework | Q4 A |
| Hero surfaces | `caranddriver/components/content/review/hero-section/index.jsx` + `price-section/index.jsx` | Functional Design scope (CAD only) | Q1 A (FD) |
| GraphQL | Extend `VehicleModelFragment` in `caranddriver/components/content/fragments/vehicle-model.js` | ADR-002; single hero query | BR2.1, Q2 A (FD) |
| Price mapping | `@autos/utils/map-marketplace-price` (U1, plain JS) | C1 in-process import | functional-spec |
| Dollar formatting | `@caranddriver/page-utils/price-utils` | Existing hero MSRP + `formatDollars` | BR2.2, Q7 A (FD) |
| Cloud / AWS | None | Affirmed practices | requirements.md |
| Test tooling | FRE’s existing test runner; component tests after implementation | NFR7; mock mapper | Q5 A |

## Derived requirements

| ID | Statement | Source |
|----|-----------|--------|
| NFR3.1 | Visual treatment inherits current CAD used-car hero price chrome (`PriceTitleContainer`, `MarketplaceCta`, shop CTAs). No new design system. | NFR3, interaction-spec |
| NFR6.1 | Launch bar for Bolt 1: hero correctly renders hide / `Marketplace  $LOW - $HIGH` / Original MSRP fallback and preserves existing click-through on all three settled paths. | NFR6, AC1.1.x |
| NFR6.2 | Extend `VehicleModelFragment` only — no separate marketplace price query or round-trip. | NFR6, BR2.1, Q1 A |
| NFR6.3 | Sync `mapMarketplacePrice` in render; no client fetch in price section. | NFR6, C1 |
| NFR6.4 | No new hero latency SLA; avoid SSR/LCP regression beyond added fragment fields. | NFR6, Q1 A |
| NFR7.1 | After implementing the price section, add component tests with FRE’s existing runner covering: `inFlight` empty slot; both-present marketplace copy without MSRP title; MSRP fallback layout; `readFailed` → MSRP; `MarketplaceCta` `href` unchanged (mock mapper). | NFR7, Q5 A |
| NFR7.2 | Merge bar remains CI green; no coverage percentage floor beyond affirmed practice. | NFR7 |

## Alternatives rejected

| Option | Why not |
|--------|---------|
| TypeScript migration of price-section (Q4 B) | Out of scope; stay JSX brownfield |
| New shared React hook for marketplace prices (Q4 C) | Violates per-placement query ownership (ADR-002) |
| E2E-only verification (Q5 B) | Does not meet test-after for this unit’s state matrix |
| Debug logging in non-production (Q6 B) | Forbidden by Q6 A / NFR4.2 |

## Summary

Extend existing CAD React JSX hero with fragment fields, U1 mapper import, and price-utils formatting; verify with component tests and no new cloud or analytics stack.
