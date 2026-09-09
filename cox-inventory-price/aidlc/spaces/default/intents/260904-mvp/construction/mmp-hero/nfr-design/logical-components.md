# Logical Components — mmp-hero

Logical view for U2 so Infrastructure Design does not invent a service or shared runtime.

## Component inventory

| Component | Kind | FRE path (indicative) | Role |
|-----------|------|----------------------|------|
| `VehicleModelFragment` | GraphQL selection | `caranddriver/components/content/fragments/vehicle-model.js` | Adds `marketplace { high low }` on hero year `price` |
| `ReviewArticleHero` | React wrapper | `caranddriver/.../hero-section/index.jsx` | Derives `inFlight` / `readFailed`; passes props |
| `ReviewArticlePriceSection` | React UI | `caranddriver/.../price-section/index.jsx` | Sync U1 call + slot render |
| `MarketplacePriceMapper` (U1) | In-process library | `@autos/utils/map-marketplace-price` | `{ hide, display }` mapping |

## Failure domain

| Domain | Blast radius | Shared resources |
|--------|--------------|------------------|
| Hero price slot on CAD review-article pages | Wrong, hidden, or fallback price copy in that slot only | None — no new process, queue, cache, or AWS resource |

A defect in flag wiring or branch logic affects only the CAD review-article hero price area for that page view. It does not create a shared outage domain across placements or services.

## Boundaries

| From | To | Mechanism | Notes |
|------|-----|-----------|-------|
| Review-article loader | `VehicleModelFragment` | Existing `VEHICLE_DATA_QUERY` | Single query (NFR6.2) |
| `ReviewArticleHero` | `ReviewArticlePriceSection` | React props | Wrapper owns flags (Q3 A) |
| `ReviewArticlePriceSection` | U1 mapper | Sync import | No fetch in price section |
| U1 mapper | Voltron GraphQL | **None** | Caller-owned data |

## Patterns that do **not** apply

- Microservice / new pricing API — rejected (Q5 B)
- Shared marketplace hook for all placements in this unit — rejected (Q5 C); ADR-002 per-placement ownership
- Circuit breaker / retry / bulkhead on price section — no I/O in render path
- Horizontal scale / CDN for this slice — existing FRE frontend only
- AWS resources for U2 — none

## Infrastructure Design handoff

Add **no** new cloud component for the hero price slot. Deployment is the existing FRE frontend bundle and GraphQL schema fields already consumed by Voltron.

## Summary

Three in-process FRE surfaces plus U1 import. Blast radius = CAD hero price slot only.
