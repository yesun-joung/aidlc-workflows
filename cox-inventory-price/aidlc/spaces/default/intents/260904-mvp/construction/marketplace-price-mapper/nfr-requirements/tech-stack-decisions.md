# Tech Stack Decisions — marketplace-price-mapper

Technology choices for U1. Embedded in the FRE frontend; not a standalone package or service.

## Decisions

| Decision | Choice | Rationale | Source |
|----------|--------|-----------|--------|
| Language | Plain JavaScript (no TypeScript types in this module) | Confirmed for this unit; still an in-repo import matching FRE module layout | Q1 B |
| Module shape | Named export of sync `mapMarketplacePrice` (and any small helpers) | C1–C4 in-process import; no HTTP, no OpenAPI | contract-summary.md |
| Runtime I/O | None | BR1.8; callers own GraphQL | functional-spec.md |
| Cloud / AWS | None | Affirmed practices; no new AWS | requirements.md |
| Test tooling | FRE’s existing test runner; tests written after implementation | NFR7; cover hide, both-present (incl. 0), half/missing, readFailed, both copy variants | Q4 A, NFR7 |

## Derived requirements

| ID | Statement | Source |
|----|-----------|--------|
| NFR7.1 | After implementing the mapper, add unit tests with FRE’s existing runner covering: `inFlight` hide; both-present incl. `0`; half/missing → Original MSRP; `readFailed`; `hero-range` and `starting-at` templates. | NFR7, Q4 A |
| NFR7.2 | Merge bar remains CI green; no coverage percentage floor for this unit beyond the affirmed practice. | NFR7 |

## Alternatives rejected

| Option | Why not |
|--------|---------|
| TypeScript module (Q1 A) | User chose plain JavaScript for this library |
| Plain JS with debug console logging (Q3 B) | Forbidden by Q3 A / NFR4.2 |
| UI-only tests with no mapper unit tests (Q4 B) | U1 owns the mapping cases in `unit-of-work.md` |

## Summary

Ship a plain JavaScript sync mapper imported by placements, with test-after unit coverage and no cloud or network stack of its own.
