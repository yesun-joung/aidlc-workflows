## Sources

- [scope] Workflow-selected scope: `mvp`.
- Unit: `marketplace-price-mapper` (U1, library) — pure sync in-repo mapper; no GraphQL fetch (BR1.8).
- Upstream: `functional-spec.md`, `rules.md`, `requirements.md` (NFR1–NFR7), `contract-summary.md` (C1–C4).
- Affirmed: test-after (NFR7); public marketplace prices only (NFR4); no new analytics (NFR5); no new AWS; TypeScript-style sync function import.

Already locked — do not reopen: no network I/O in U1; return `{ hide, display }` only; `formatDollars` includes `$`; finite incl. `0` for both-present; `vehicleModelId` required but not used to branch copy.

This unit’s NFR artifacts are **security** and **tech stack** only (library kind). Performance, scalability, reliability, and observability docs are not produced for a library unit — those belong to the UI placements later.

## Q1. What language and module shape should the mapper use in FRE?

Needed so Code Generation does not invent a second stack beside the existing frontend.

- A. TypeScript module exported for in-repo import (match FRE’s existing TS conventions)
- B. Plain JavaScript module (no types)
- C. Not yet defined — find the nearest FRE pattern at Code Generation
- X. Other (please specify)

[Answer]: B

## Q2. How should the mapper treat a missing or blank `vehicleModelId`?

Functional Design requires the id on the call for identity, but mapping does not branch on it. Security needs one failure mode so callers cannot pass garbage silently.

- A. Reject the call (throw / hard fail) — caller bug; do not invent hide or MSRP
- B. Ignore the bad id and still map from the other fields (same hide/display rules)
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q3. Does the mapper log or emit anything about `vehicleModelId` or prices?

NFR4 says displayed prices are public and no new personal data is collected. NFR5 forbids new analytics events. Functional Design left “tracing” wording ambiguous.

- A. No logging, analytics, or telemetry inside the mapper — pure function only
- B. Allow debug-only console logging in non-production
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q4. How do we verify NFR7 (test-after) for this library?

U1 owns hide / both-present / half-populated / error-timeout mapping cases (`unit-of-work.md`).

- A. Unit tests with FRE’s existing test runner after implementation; cover hide, both-present (incl. 0), half/missing, readFailed, and both copy variants
- B. No dedicated unit tests for the mapper — rely on placement UI tests only
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Language: plain JavaScript module (no types) for in-repo import (Q1 B)
- Missing/blank `vehicleModelId`: reject the call — caller bug; do not invent hide or MSRP (Q2 A)
- No logging, analytics, or telemetry inside the mapper — pure function only (Q3 A)
- Unit tests after implementation with FRE’s existing runner; cover hide, both-present (incl. 0), half/missing, readFailed, and both copy variants (Q4 A)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
