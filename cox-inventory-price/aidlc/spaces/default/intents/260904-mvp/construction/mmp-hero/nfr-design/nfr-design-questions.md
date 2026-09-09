## Sources

- [scope] Workflow-selected scope: `mvp`. Bolt 1 walking skeleton with U1 `marketplace-price-mapper` (shipped).
- Unit: `mmp-hero` (U2, ui) — CAD review-article hero price slot.
- Upstream: `performance-requirements.md`, `security-requirements.md`, `tech-stack-decisions.md`, `functional-spec.md`, `frontend-components.md`, `interaction-spec.md`.
- Functional Design review minors to pin: marketplace vs MSRP branch rule (R-02); SSR loader failure note (R-04).

Already locked — do not reopen: extend `VehicleModelFragment` only; sync U1 mapper in render; hide slot while inFlight; no new analytics/logging; WCAG silent swap; unchanged MarketplaceCta. UI unit produces **performance-design**, **security-design**, **logical-components** (+ traceability) only.

## Q1. How should performance be designed for the hero price path?

NFR6.2–6.4 forbid a separate fetch, async mapper, or new latency SLA.

- A. **No caching or pooling layer** — marketplace low/high ride on the existing hero SSR query; mapper runs sync in `ReviewArticlePriceSection` render; client refetch reuses the same query path with `inFlight` hide only
- B. Add a client-side cache for marketplace prices in the hero component
- C. Lazy-load marketplace fields after first paint
- X. Other (please specify)

[Answer]: A

## Q2. How should the price section tell marketplace copy from MSRP fallback after mapper settle?

Functional Design R-02 flagged `display starts with Marketplace` as fragile. NFR design should pin one branch rule for Code Generation.

- A. **`display !== originalMsrpCopy`** after mapper settle (both are caller-owned strings; marketplace hero-range never equals formatted Voltron MSRP body)
- B. Keep **`display.startsWith("Marketplace")`** as the branch predicate
- C. Mapper returns a third field (e.g. `mode`) — requires U1 change (out of scope)
- X. Other (please specify)

[Answer]: A

## Q3. How should inFlight / readFailed flags reach the price section?

Functional Design Q5–Q6 A lock SSR settled vs client refetch vs query error.

- A. **Hero wrapper** (`hero-section/index.jsx`) derives `inFlight` and `readFailed` from the page/loader vehicle read state and passes them as props to `ReviewArticlePriceSection`; price section does not fetch
- B. Price section owns its own Apollo query for marketplace fields
- C. Always pass `inFlight=false` / `readFailed=false` (SSR-only)
- X. Other (please specify)

[Answer]: A

## Q4. What security design applies at the hero UI boundary?

NFR4.1–4.4 and NFR1.2 require public display data, no new logging, and empty slot while loading.

- A. **Trust settled GraphQL numbers** passed to U1; no `console.*` or analytics in price section; on GraphQL error set `readFailed` and MSRP fallback — do not render raw error text in the slot; while `inFlight`, render **no** price DOM (no off-screen MSRP for screen readers)
- B. Log mapper inputs in development builds
- C. Show a generic error string in the price slot on read failure
- X. Other (please specify)

[Answer]: A

## Q5. How should logical components be drawn for Infrastructure Design?

U2 is a brownfield React slice, not a new service.

- A. **Three in-process components**: (1) `VehicleModelFragment` GraphQL selection, (2) `ReviewArticleHero` flag wiring, (3) `ReviewArticlePriceSection` render + U1 call. Blast radius = wrong/hidden hero price slot on CAD review pages only; no AWS, queue, or shared runtime beyond existing FRE frontend
- B. Model as a new microservice boundary for hero pricing
- C. Shared hook consumed by all four placements in this unit
- X. Other (please specify)

[Answer]: A

## Q6. What accessibility design applies beyond NFR1 rows?

Interaction spec locks silent swap and no new `aria-live`.

- A. **Inherit existing hero price semantics** when settled; while hidden, omit price title and body from DOM; keyboard focus stays on existing MarketplaceCta / shop CTAs only — no new focusable price control
- B. Add `aria-live="polite"` when marketplace copy appears
- C. Keep MSRP in DOM with `visibility:hidden` while inFlight
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- **Performance:** No cache or lazy load; fragment + sync mapper in render; refetch uses same query with inFlight hide (Q1 A)
- **Branch rule:** Marketplace vs MSRP via `display !== originalMsrpCopy` after settle (Q2 A)
- **Flag wiring:** Hero wrapper passes `inFlight` / `readFailed`; price section does not fetch (Q3 A)
- **Security:** Trust GraphQL numbers; no logging/analytics; empty DOM while inFlight; MSRP fallback on readFailed without error text in slot (Q4 A)
- **Logical view:** Fragment + hero wrapper + price section in-process; blast radius = CAD hero slot only (Q5 A)
- **Accessibility:** Silent swap; no aria-live; no off-screen MSRP while loading (Q6 A)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
