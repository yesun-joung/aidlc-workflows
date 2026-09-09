# Performance Design — mmp-hero

Performance architecture for U2 (CAD hero price slot). Design only — implementation in Code Generation.

## Data path

| Step | Design | Requirement |
|------|--------|-------------|
| 1 | Extend `VehicleModelFragment` with `price { marketplace { high low } }` on the hero year selection | NFR6.2, BR2.1 |
| 2 | `VEHICLE_DATA_QUERY` on review-article loader fetches hero vehicle + marketplace fields in **one** SSR round-trip | NFR6.2 |
| 3 | Hero wrapper passes settled `low`/`high`, flags, and Voltron `price` into `ReviewArticlePriceSection` | functional-spec W1 |
| 4 | Price section calls `mapMarketplacePrice` **synchronously** during render | NFR6.3 |
| 5 | Client refetch reuses the same query; wrapper sets `inFlight=true` until settle → empty slot (no extra fetch in price section) | Q1 A, Q3 A, W2 |

## Optimization strategy

| Pattern | Decision | Rationale |
|---------|----------|-----------|
| Caching | **None** in this unit | Marketplace fields are small; piggyback existing hero query (Q1 A) |
| Lazy load | **Rejected** | Would violate single-query design and hide-while-in-flight UX |
| Async / defer mapper | **Rejected** | Mapper is sync CPU; NFR6.3 |
| CDN / pooling | **N/A** | UI render path only |
| Breakpoints | **Inherit** hero layout | NFR2.1–2.2; no new responsive rules |

## Performance budget

| Metric | Target |
|--------|--------|
| New network hops | 0 (fragment fields only) |
| Mapper latency | Negligible sync call — not instrumented separately |
| Hero LCP / TTFB | No regression attributable to this unit beyond two GraphQL scalars | NFR6.4 |

## Client refetch flow

```text
route transition / Apollo refetch
  → hero wrapper: inFlight=true
  → price section: mapper hide → render empty slot
  → query settles
  → hero wrapper: inFlight=false, readFailed per outcome
  → price section: mapper + branch render (W1)
```

## Summary

One query, sync mapper, inFlight hide — no caching layer or second fetch. Performance design is “stay on the existing hero critical path.”
