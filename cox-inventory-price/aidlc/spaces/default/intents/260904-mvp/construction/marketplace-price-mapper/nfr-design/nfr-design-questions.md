## Sources

- [scope] Workflow-selected scope: `mvp`.
- Unit: `marketplace-price-mapper` (U1, library) — plain JavaScript sync mapper (NFR Q1 B).
- Upstream: `security-requirements.md` (NFR4.1–4.4, NFR5.1), `tech-stack-decisions.md` (NFR7.1–7.2), `functional-spec.md`, `contract-summary.md`.
- Open majors from NFR Requirements to pin here: non-coercing presence check (R-01); blank `vehicleModelId` definition + throw shape (R-02).

Already locked — do not reopen: no fetch/AWS/logging; reject blank id; test-after unit tests; return `{ hide, display }` only; library produces only security-design + logical-components (+ traceability).

## Q1. How should “both present” be checked in plain JavaScript?

NFR4.4 forbids coercing strings into numbers. Global `isFinite` / unary `+` would treat `"123"` as present and risk wrong marketplace copy.

- A. `typeof x === "number" && Number.isFinite(x)` for both low and high (string/null/undefined/NaN → absent → Original MSRP)
- B. Rely on callers to only pass numbers; mapper uses `Number.isFinite` alone
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q2. What counts as a blank `vehicleModelId`, and how does reject look?

NFR4.3 requires hard fail. Code Generation needs one definition and Error kind. Callers must not catch-and-map to MSRP.

- A. Blank = omitted, `null`, non-string, or empty/whitespace-only string. Throw `TypeError`. Callers must not catch and convert to MSRP.
- B. Blank = only `""` or `null`. Throw a plain `Error`.
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q3. How is this library drawn as a logical component for later Infrastructure Design?

U1 has no AWS and no network. We still need a failure-domain picture so Infrastructure Design does not invent a service.

- A. One in-process FRE module: blast radius = wrong price string in calling placement only; no shared runtime, queue, or cache
- B. Treat it as a shared “pricing service” boundary even though it is in-repo
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Both present: `typeof x === "number" && Number.isFinite(x)` for low and high; strings/null/undefined/NaN → Original MSRP (Q1 A)
- Blank `vehicleModelId`: omitted, `null`, non-string, or empty/whitespace-only → throw `TypeError`; callers must not catch-and-map to MSRP (Q2 A)
- Logical component: one in-process FRE module; blast radius = wrong price string in the calling placement only; no shared runtime/queue/cache (Q3 A)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
