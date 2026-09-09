# Performance Requirements — mmp-hero

Performance targets for U2 (CAD review-article hero price slot). No new network hop or async mapper — extend existing SSR query and sync render.

## Requirements

| ID | Statement | Target | Source |
|----|-----------|--------|--------|
| NFR2.1 | Hero price slot follows existing Car and Driver site breakpoints; no new breakpoint-specific copy or layout rules. | Same responsive behaviour as today’s hero price block | NFR2, interaction-spec |
| NFR2.2 | Hide, marketplace, and MSRP fallback copy behave identically at every breakpoint the hero already supports — no new wrap or overflow rule for this unit. | Parity with interaction-spec responsive table | NFR2, interaction-spec |
| NFR6.2 | Adding `price { marketplace { high low } }` to `VehicleModelFragment` must not introduce a separate GraphQL round-trip for marketplace prices. | Single hero `VEHICLE_DATA_QUERY` only | BR2.1, Q1 A |
| NFR6.3 | `mapMarketplacePrice` runs synchronously during hero render; no `await`, no client-side fetch inside the price section. | Sync in-process call | C1, functional-spec W1 |
| NFR6.4 | No new latency SLA for the price slot. Regression guard: hero SSR path must not add measurable delay beyond the cost of two extra GraphQL scalar fields on an existing selection. | No regression vs pre-change hero TTFB/LCP attributable to this unit | Q1 A |

## Measurement notes

| Area | Approach |
|------|----------|
| SSR query size | Fragment field addition only — review in Code Generation if query plan changes |
| Client refetch | `inFlight` hide is UX-only; no extra requests beyond existing hero vehicle read |
| Mapper CPU | Negligible sync map; not a perf test target for this unit |

## Out of scope

Throughput, horizontal scaling, and service-level SLOs belong to Voltron/GraphQL infrastructure, not this UI unit.

## Summary

Extend the existing hero query, map in render, and avoid regressing the current hero critical path. Breakpoint behaviour stays unchanged; no new performance budget beyond fragment-field cost.
