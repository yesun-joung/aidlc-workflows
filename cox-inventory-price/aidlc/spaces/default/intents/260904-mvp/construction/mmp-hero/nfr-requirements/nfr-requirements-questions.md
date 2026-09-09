## Sources

- [scope] Workflow-selected scope: `mvp`. Bolt 1 walking skeleton with U1 `marketplace-price-mapper` (shipped).
- Unit: `mmp-hero` (U2, ui) — CAD review-article hero price slot only.
- Upstream: `functional-spec.md`, `rules.md`, `frontend-components.md`, `requirements.md` (NFR1–NFR7), `interaction-spec.md` (hero slot), `contract-summary.md` (C1).
- Affirmed: test-after (NFR7); no new analytics (NFR5); no new AWS; WCAG 2.1 AA (NFR1); inherit site breakpoints (NFR2); inherit CAD used-car patterns (NFR3).

Already locked — do not reopen: hide slot while inFlight; Original MSRP fallback; marketplace copy only when both low and high; silent price swap (no new `aria-live`); unchanged MarketplaceCta click-through; GraphQL fields on existing `VehicleModelFragment`.

This unit’s NFR artifacts are **performance**, **security**, and **tech stack** (ui kind). Scalability, reliability, and observability docs are not produced for a ui unit — those belong to service units.

## Q1. What performance target applies to the hero price slot change?

The hero is SSR-critical. This unit adds two GraphQL numbers and a sync mapper call on an existing query — no new fetch.

- A. **No new latency budget** — extend the existing hero `VEHICLE_DATA_QUERY` only; mapper is sync in render; must not regress current hero TTFB/LCP beyond what the added fragment fields cost
- B. Hard cap: price slot visible within 100 ms of hero data settle (new SLA)
- C. Not yet defined — measure in Code Generation
- X. Other (please specify)

[Answer]: A

## Q2. How should the hero handle accessibility while the slot is hidden (inFlight)?

Interaction spec locks silent swap and “hidden while loading” for screen readers (refined mockups Q6 A).

- A. **Do not render price text or MSRP title while inFlight** (empty slot); no new `aria-live`, `aria-busy`, or loading announcement; when settled, inherit existing hero text semantics
- B. Render an explicit “loading prices” message for screen readers
- C. Keep MSRP visible to screen readers while visually hidden
- X. Other (please specify)

[Answer]: A

## Q3. What security constraints apply to marketplace fields on the hero GraphQL read?

NFR4: public marketplace figures only. Hero uses existing Voltron/authenticated GraphQL patterns today.

- A. **Treat low/high as public display data** once returned; do not log shopper identifiers with prices; do not add new analytics or client-side storage; rely on existing query auth/error boundaries — mapper receives numbers only after the hero loader settles
- B. Encrypt marketplace numbers in component state
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q4. Which tech stack surfaces does this unit use in FRE?

Brownfield CAD hero — need one pinned stack row for Code Generation.

- A. **Existing CAD React JSX** in `caranddriver/components/content/review/hero-section/`; extend `VehicleModelFragment` (JS); import `@autos/utils/map-marketplace-price` and `@caranddriver/page-utils/price-utils`; no new package or TypeScript migration in this unit
- B. Convert price-section to TypeScript in this Bolt
- C. New shared React hook for marketplace prices
- X. Other (please specify)

[Answer]: A

## Q5. How do we verify NFR7 (test-after) for the hero price section?

Functional Design covers hide / marketplace / MSRP / readFailed paths. U1 mapper tests already ship separately.

- A. **Component tests** (FRE’s existing runner) for `ReviewArticlePriceSection` after implementation: inFlight hide (empty slot); both-present marketplace copy without MSRP title; MSRP fallback layout; readFailed → MSRP; mock `mapMarketplacePrice` — plus keep existing hero tests green
- B. E2E only — no dedicated price-section unit tests
- C. Manual QA only for Bolt 1
- X. Other (please specify)

[Answer]: A

## Q6. Does this unit add any new observability or client logging for price reads?

NFR5 forbids new analytics events. Functional Design leaves hero loader errors to existing page handling.

- A. **No new metrics, logs, or analytics** for marketplace price display or GraphQL read outcomes in this unit — observe existing click-through after launch only
- B. Add debug logging for mapper inputs in non-production
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- **Performance:** No new latency SLA; extend existing hero query + sync mapper only; avoid hero regression (Q1 A)
- **Accessibility:** Empty slot while inFlight; silent settled swap; no new `aria-live` (Q2 A, NFR1)
- **Security:** Public marketplace display data; no new PII collection, storage, or analytics (Q3 A, NFR4–NFR5)
- **Tech stack:** CAD React JSX hero + fragment extension + U1 mapper + price-utils; no TS migration (Q4 A)
- **Testing:** Component tests for hide / marketplace / MSRP / readFailed after implementation (Q5 A, NFR7)
- **Observability:** No new logging or analytics in this unit (Q6 A)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
