## Sources

- [scope] Workflow-selected scope: `mvp`.
- Upstream units: `unit-of-work.md` (U1 mapper library; U2–U5 UI placements).
- Upstream DAG: `unit-of-work-dependency.md` (four UI units depend on U1; in-repo library import).
- Upstream components: `components.md` (`MarketplacePrice`, `copyVariant` hero-range / starting-at).
- Upstream requirements: `requirements.md` (FR5 hide / both-present / Original MSRP fallback; NFR4 public prices).

Already locked — do not reopen: in-repo import of one shared mapper; no shared fetch; no new AWS; each placement owns its own `vehicle_models` query file and adds `price { marketplace { high low } }`; no HTTP/event/package boundary between units; all five units ship in the same FRE frontend.

This stage pins **what crosses each boundary** so Construction can build the mapper and four call sites without guessing.

## Q1. Which boundaries get a formal contract in this summary?

Units Generation already named four edges into the mapper. Each placement also talks to GraphQL `vehicle_models` on its own query file. I need which of those get a pinned contract here.

- A. Only the four placement → mapper edges (one shared mapper call shape, four consumers)
- B. The four mapper edges plus one shared note of the GraphQL `price.marketplace { high low }` selection each placement adds (existing API; not a new endpoint)
- C. Four separate mapper contracts with different shapes per placement
- X. Other (please specify)

[Answer]: A

## Q2. How should the mapper call shape be written?

Needed so Functional Design and Code Generation do not invent different argument lists.

- A. One shared TypeScript-style function contract: inputs (in-flight vs settled low/high, `copyVariant`, existing Original MSRP copy) and outputs (hide vs display string)
- B. A shared-schema document for `MarketplacePrice` only — call signature left to Construction
- C. OpenAPI / HTTP — even though units stay in-process
- X. Other (please specify)

[Answer]: A

## Q3. Who owns the mapper contract, and how do breaking changes land?

Four UI units import U1. I need who may change the call shape and how the others stay safe.

- A. U1 (`marketplace-price-mapper`) owns the spec. Breaking changes need agreement from all four consumer units before merge. Additive optional fields are OK; consumers ignore unknowns.
- B. Each consumer owns its own copy of the call shape
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q4. What happens at the mapper boundary when the GraphQL read fails or is in flight?

FR5 already says hide while in flight, then Original MSRP on missing/half/error/timeout. I need whether that behaviour is part of the **mapper contract** or stays only on each placement.

- A. Mapper contract: caller passes in-flight / settled / error flags; mapper returns hide or the fallback/marketplace string. GraphQL error stays on the placement; mapper never fetches or retries.
- B. Mapper retries or times out GraphQL itself
- C. Mapper only maps happy-path fields; placements invent hide/fallback separately
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Only the four placement → mapper edges get formal contracts (one shared call shape, four consumers). GraphQL selection stays on each placement’s query file — not a separate contract here (Q1 A)
- Mapper call written as one shared TypeScript-style function: inputs (in-flight vs settled low/high, `copyVariant`, existing Original MSRP copy) → outputs (hide vs display string) (Q2 A)
- U1 owns the spec. Breaking changes need agreement from all four consumers before merge. Additive optional fields OK; consumers ignore unknowns (Q3 A)
- Caller passes in-flight / settled / error flags; mapper returns hide or fallback/marketplace string. GraphQL stays on the placement; mapper never fetches or retries (Q4 A)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
