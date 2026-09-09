# Infrastructure Specification — mmp-hero

Infrastructure design for U2 (CAD hero price slot). Brownfield FRE frontend — no new cloud resources.

## Deployment

| Facet | Choice | Rationale |
|-------|--------|-----------|
| Compute model | Existing FRE frontend SSR/CSR bundle | UI slice ships with FRE app (Q3 A) |
| Networking | Existing FRE → Voltron GraphQL path | Single `VEHICLE_DATA_QUERY`; no new ingress (NFR6.2) |
| Storage | None added | Marketplace fields are read-only GraphQL scalars; no client persistence (NFR4.1) |
| Environments | FRE existing dev/staging/prod promotion | No U2-specific environment |
| IaC | None for U2 alone | No new AWS stacks or Terraform modules |
| Resource sizing | N/A | Two GraphQL scalar fields on existing fragment |

## Infrastructure Services

| Service | Role | Configuration | Notes |
|---------|------|---------------|-------|
| Voltron GraphQL (existing) | Data source for `price.marketplace { high low }` | Extend schema/fragment only | Hero loader already authenticated |
| FRE frontend (existing) | Host for hero React components | Standard FRE build | Blast radius = CAD review hero slot |
| `@autos/utils/map-marketplace-price` (U1) | In-process library | Sync import | No separate deploy |

No database, cache, queue, CDN, DNS, or load-balancer is added for this unit.

## Shared Infrastructure

| Shared Resource | Owner Unit | Consumer Units | Access Boundary |
|-----------------|------------|----------------|-----------------|
| FRE frontend CI/CD | FRE platform | U1–U5 MVP placements | Standard FRE PR checks |
| Voltron `vehicle_models` GraphQL | Platform | U2 hero fragment | Existing query auth |

## Summary

U2 adds GraphQL selection fields and React changes inside the existing FRE frontend. No standalone infrastructure.
