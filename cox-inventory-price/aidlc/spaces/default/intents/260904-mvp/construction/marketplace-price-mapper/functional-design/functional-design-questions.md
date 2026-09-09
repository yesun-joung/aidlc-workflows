## Sources

- [scope] Workflow-selected scope: `mvp`.
- Unit: `marketplace-price-mapper` (U1, library) — Bolt 1 walking skeleton with `mmp-hero`.
- Upstream: `unit-of-work.md`, `components.md` (`MarketplacePrice`), `contract-summary.md` (C1–C4), `requirements.md` FR5, stories US1.1–US4.1 (cross-cutting).
- Affirmed practices: test-after; no new AWS; in-repo import only.

Already locked — do not reopen: pure mapping, no fetch/retry; `copyVariant` hero-range vs starting-at; hide while inFlight; Original MSRP fallback on missing/half/error; public prices only.

This unit designs the **mapper library only** (entities, rules, behaviour). Placement chrome and GraphQL query files belong to U2–U5 later.

Open contract findings to pin here: typed `formatDollars` (R-01), “both present” for low/high (R-02), role of `vehicleModelId` (R-03).

## Q1. How should `formatDollars` be typed on the mapper call?

Contract Design left this as an untyped function. Hero copy uses `$LOW` / `$HIGH` in `Marketplace  $LOW - $HIGH`; starting-at is `starting at {low}` (FR2–FR4 do not put `$` in the template itself).

- A. `(amount: number) => string` where the return **includes** a leading `$` (e.g. `"$12,345"`). Hero builds `Marketplace  {formatDollars(low)} - {formatDollars(high)}`. Starting-at builds `starting at {formatDollars(low)}`.
- B. `(amount: number) => string` where the return is **digits only** (no `$`). Mapper adds `$` itself in both templates.
- C. Two formatters — one for hero, one for starting-at
- X. Other (please specify)

[Answer]: A

## Q2. When do low and high count as “both present”?

Needed so FR5 fallback cannot drift across four call sites.

- A. Both present iff each is a finite number (including `0`). Omitted, `null`, or `NaN` means absent → Original MSRP.
- B. Both present iff each is a number greater than zero. Zero counts as absent.
- C. Both present iff both are non-null strings after formatting
- X. Other (please specify)

[Answer]: A

## Q3. What is `vehicleModelId` for on the mapper call?

It is required on the contract but unused in the behaviour bullets today.

- A. Identity-only — required for `MarketplacePrice` / tracing; mapping logic does not branch on it
- B. Drop it from the required call until a later need appears
- C. Not yet defined
- X. Other (please specify)

[Answer]: X — Id already passed from each location

## Q3b. When you say the id is already passed from each location, which should the mapper do?

- A. Keep `vehicleModelId` required on the call — each placement passes the id it already has; mapper stores it for identity/tracing and does not branch on it
- B. Drop `vehicleModelId` from the mapper call — placements keep the id locally only
- X. Other (please specify)

[Answer]: A

## Q4. Should the mapper return a structured result or only hide + display string?

Code Generation needs one return shape.

- A. `{ hide: boolean, display: string | null }` only — callers render `display` or hide the slot
- B. Also return a derived `MarketplacePrice` object (vehicleModelId, low, high, bothPresent, copyVariant) alongside hide/display
- C. Return the display string only; hide is implied by null
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- `formatDollars`: `(amount: number) => string` with leading `$` in the return; hero and starting-at templates wrap that string (Q1 A)
- Both present iff each of low/high is a finite number (including `0`); omitted/`null`/`NaN` → Original MSRP (Q2 A)
- `vehicleModelId` stays required: each placement passes the id it already has; mapper uses it for identity/tracing only, no branch (Q3 X + Q3b A)
- Return shape: `{ hide: boolean, display: string | null }` only (Q4 A)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
