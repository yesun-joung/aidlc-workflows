# External Dependency Map

Gated items outside this team that could block a Bolt. A **Bolt** is one Construction build pass over one or more units.

## External waits

Confirmed **none** for Construction once Inception finishes (Q5 A). GraphQL marketplace high/low already exist on `vehicle_models`. No new AWS. Backend work is out of scope.

| Dependency | Owner | Lead time | Blocks Bolt | Slip plan |
|------------|-------|-----------|-------------|-----------|
| — | — | — | — | None. Fully unblocked for Construction after Inception approval. |

## In-repo / known constraints (not external waits)

| Item | Notes |
|------|-------|
| Existing FRE modules and query files | Find-time inside FRE at the start of each Bolt (Q6 A). Not an external team gate. |
| FRE PR / review / QA / product | Deployment practice; happens on each Bolt’s PR, not a pre-start hold. |
| Accepted risks | Unnamed host pages (US3.1/US4.1); YAML vs Directory naming (units-generation R-01); contract `formatDollars` typing (contract-design R-01) — resolve inside Construction, not by waiting on another org. |
