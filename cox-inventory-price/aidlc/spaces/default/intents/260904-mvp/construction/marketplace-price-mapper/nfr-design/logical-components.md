# Logical Components — marketplace-price-mapper

Logical view for U1 so Infrastructure Design does not invent a service or shared runtime.

## Component inventory

| Component | Kind | Host | Isolation |
|-----------|------|------|-----------|
| `MarketplacePriceMapper` module | In-process FRE library (plain JavaScript) | Same FRE frontend bundle as callers | No separate process, container, queue, cache, or AWS resource |

## Failure domain

| Domain | Blast radius | Shared resources |
|--------|--------------|------------------|
| Mapper call in placement P | Wrong or missing price string in P’s existing slot only | None — pure sync function; no shared mutable state |

A bug or throw in the mapper affects only the calling placement’s render path for that call. It does not take down other placements’ runtimes or create a shared outage domain.

## Boundaries

| From | To | Mechanism | Notes |
|------|-----|-----------|-------|
| mmp-hero / mmp-ranking / vehicle-card-back / category-card | MarketplacePriceMapper | In-repo sync import (C1–C4) | Callers own GraphQL; mapper never fetches |
| MarketplacePriceMapper | (none) | — | No outbound deps |

## Patterns that do **not** apply

- Circuit breaker / retry / bulkhead — no I/O
- Horizontal scale / partitioning / CDN — not a service
- Shared “pricing service” boundary — rejected (nfr-design Q3 A)

## Summary

One in-process FRE module. Blast radius = wrong price string in the calling placement. Infrastructure Design should add **no** new cloud component for U1.
