# RAID Log

Risks, assumptions, issues, and dependencies for the intent in `intent-statement.md`.

## Risks

| ID | Risk | Likelihood | Impact | Treatment |
|----|------|------------|--------|-----------|
| RK-1 | Four unbuilt FRE placements miss the 2-week target | High | Medium | Sequence by placement milestone; cut or slip a placement if the first milestone overruns [Q3][Q4] |
| RK-2 | GraphQL `vehicle_models` marketplace high/low is missing, null, or shaped differently on some models | Medium | High | Confirm field availability on representative used models before treating all four placements as unblocked [Q1][Q8] |
| RK-3 | FRE modules and the GraphQL API disagree on which model identity to query | Medium | Medium | Keep one model-identity rule and fail visible if the API cannot return a price [Q8] |

## Assumptions

| ID | Assumption | Status |
|----|------------|--------|
| AS-1 | Marketplace high/low on GraphQL `vehicle_models` remains the price source for the four placements | Unvalidated [Q1][Q8] |
| AS-2 | FRE is the only implementation home; no second front-end repo is in play | Unvalidated [Q1][Q3] |
| AS-3 | No new personal data collection is introduced when measuring click-through later | Unvalidated [Q7] |

## Issues

| ID | Issue | Status |
|----|-------|--------|
| IS-1 | None identified | None known [Q5] |

## Dependencies

| ID | Dependency | Owner signal |
|----|------------|--------------|
| DP-1 | Existing GraphQL `vehicle_models` marketplace high/low fields | Already available per Q1/Q8 |
| DP-2 | FRE Car and Driver used-car page modules | Local repo named in Q1; four tickets not built [Q3] |
| DP-3 | Current site and accounts (no new AWS surface) | Confirmed [Q6] |

## Assumptions & Open Questions

- AS-1 through AS-3 stay assumptions until a later stage validates them.
- No compliance issue is open under the answers given; re-open if lead or identity data is added later.
