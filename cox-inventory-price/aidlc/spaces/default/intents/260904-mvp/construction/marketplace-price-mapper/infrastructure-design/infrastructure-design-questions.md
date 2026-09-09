## Sources

- [scope] Workflow-selected scope: `mvp`.
- Unit: `marketplace-price-mapper` (U1, library) — in-process FRE JavaScript module; no AWS (`logical-components.md`).
- Upstream: `security-design.md`, `logical-components.md`, `components.md`, `functional-spec.md`, `contract-summary.md`.
- Affirmed: FRE PR path; test-after; no new AWS; full history no squash on FRE.

Already locked — do not reopen: no new cloud resources, queues, caches, or monitoring services for U1. Library artifacts for this stage are **cicd-pipeline** + **traceability** only.

## Q1. How does this library ship through CI/CD?

U1 has no deployable service. It must not invent a second pipeline.

- A. Ride the existing FRE frontend CI/CD — build and test with the FRE app; no separate pipeline or deploy target for the mapper
- B. Add a dedicated library package pipeline (publish to a registry)
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q2. Where do mapper unit tests run in that path?

NFR7.1 requires unit tests after implementation (hide, presence, blank id TypeError, both copy variants).

- A. Same FRE PR checks that already run the frontend test suite — mapper tests are part of that suite
- B. Manual-only until a later CI change
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q3. Any new AWS or monitoring for U1?

Logical components said blast radius is in-process only.

- A. None — no new infra, dashboards, or alarms for the mapper alone
- B. Add a dedicated CloudWatch (or similar) alarm for mapper errors
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- CI/CD: ride existing FRE frontend pipeline — no separate pipeline or deploy target for the mapper (Q1 A)
- Unit tests: run in the same FRE PR frontend test suite (Q2 A)
- No new AWS, dashboards, or alarms for U1 alone (Q3 A)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
