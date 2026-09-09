# Story to Unit Map

Each story in `stories.md` maps to one implementing UI unit. All four stories also use the shared mapper library (U1).

## Implementing units

| Story | Unit ID | Directory | Unit |
|-------|---------|-----------|------|
| US1.1 | U2 | `u2-mmp-hero` | `mmp-hero` |
| US2.1 | U3 | `u3-mmp-ranking` | `mmp-ranking` |
| US3.1 | U4 | `u4-vehicle-card-back` | `vehicle-card-back` |
| US4.1 | U5 | `u5-category-card` | `category-card` |

## Cross-cutting

| Stories | Unit ID | Directory | Unit | Why |
|---------|---------|-----------|------|-----|
| US1.1, US2.1, US3.1, US4.1 | U1 | `u1-marketplace-price-mapper` | `marketplace-price-mapper` | Shared hide / marketplace copy / Original MSRP rules (`components.md`; FR5) |

No story spans two UI units. Click-through, slot chrome, and each query file stay on the implementing unit (`decisions.md` ADR-005).

## Story order inside each unit

| Unit | Stories in unit | Order inside the unit |
|------|-----------------|------------------------|
| `marketplace-price-mapper` | US1.1, US2.1, US3.1, US4.1 | One mapper; `copyVariant` `hero-range` and `starting-at` both required so the four stories cannot collapse into one string |
| `mmp-hero` | US1.1 | US1.1 only |
| `mmp-ranking` | US2.1 | US2.1 only |
| `vehicle-card-back` | US3.1 | US3.1 only |
| `category-card` | US4.1 | US4.1 only |

Stories.md still marks US1.1 as the first thin slice and US2.1–US4.1 as after US1.1 is approved. That is sequence guidance for Delivery Planning, not an edge in `unit-of-work-dependency.md`.

## Coverage

| Check | Result |
|-------|--------|
| Every story assigned | US1.1 → U2; US2.1 → U3; US3.1 → U4; US4.1 → U5 |
| Every unit has stories | U1 via all four; U2–U5 via their one story each |
| Unassigned stories | None |
| Units without stories | None |
