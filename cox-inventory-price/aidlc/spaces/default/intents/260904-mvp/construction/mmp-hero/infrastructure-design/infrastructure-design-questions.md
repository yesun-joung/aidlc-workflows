## Sources

- [scope] Workflow-selected scope: `mvp`. Bolt 1 walking skeleton with U1 `marketplace-price-mapper` (shipped).
- Unit: `mmp-hero` (U2, ui) — CAD review-article hero; brownfield FRE frontend.
- Upstream: `logical-components.md`, `performance-design.md`, `security-design.md`, `functional-spec.md`, `tech-stack-decisions.md`.
- Affirmed: FRE PR path; test-after; no new AWS; no new analytics/monitoring.

Already locked — do not reopen: no new cloud resources; extend existing FRE bundle and GraphQL schema fields; ride existing FRE CI/CD.

## Q1. How does the hero price change ship through CI/CD?

U2 is a brownfield React slice inside FRE — not a standalone deployable.

- A. **Ride the existing FRE frontend CI/CD** — hero changes merge via FRE PR; no separate pipeline or deploy target for this unit
- B. Add a dedicated micro-frontend pipeline for the hero only
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q2. Where do hero price-section component tests run?

NFR7.1 requires component tests after implementation (inFlight hide, marketplace branch, MSRP fallback, readFailed, MarketplaceCta href).

- A. **Same FRE PR frontend test suite** that already runs for `caranddriver` components — add/extend tests near hero price-section
- B. Manual QA only for Bolt 1
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q3. What infrastructure (compute, network, storage) does this unit add?

Logical components: three in-process FRE surfaces + U1 import; no AWS.

- A. **None** — deploys as part of the existing FRE frontend artifact; GraphQL fields consumed from existing Voltron path; no new VPC, cache, queue, or CDN for U2 alone
- B. Add ElastiCache for marketplace prices on the hero
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q4. What monitoring or alerting does this unit add?

NFR5.1 and nfr-requirements Q6 A forbid new analytics; observe existing click-through after launch only.

- A. **None** — no new dashboards, alarms, metrics, or log pipelines for hero marketplace price display
- B. Add a CloudWatch alarm when mapper returns MSRP fallback
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- **CI/CD:** Ride existing FRE frontend pipeline — no separate deploy target (Q1 A)
- **Tests:** Hero price-section component tests in the same FRE PR frontend suite (Q2 A)
- **Infrastructure:** No new compute/network/storage — FRE bundle + existing GraphQL only (Q3 A)
- **Monitoring:** No new dashboards, alarms, or metrics for U2 alone (Q4 A)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
