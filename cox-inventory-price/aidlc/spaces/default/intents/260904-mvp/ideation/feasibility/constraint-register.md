# Constraint Register

Constraints for the intent in `intent-statement.md`.

## Technical

| ID | Constraint | Source |
|----|------------|--------|
| T-1 | Integration surface is FRE used-car page modules plus the existing GraphQL `vehicle_models` price API | [Q8] |
| T-2 | Implementation home is the FRE repo at `/Users/yesun.joung/GitHub/media-platform/services/fre` | [Q1] |
| T-3 | Marketplace high/low is already available on `vehicle_models`; do not invent a new price source | [Q1][Q8] |
| T-4 | Stack is the existing Car and Driver front-end in FRE; the four tickets are not developed yet | [Q3] |
| T-5 | No new AWS account or service; stay on current site and accounts | [Q6] |

## Organizational

| ID | Constraint | Source |
|----|------------|--------|
| O-1 | No budget cap | [Q4] |
| O-2 | Target completion is 2 weeks | [Q4] |
| O-3 | No known freeze, dependency, or competing priority | [Q5] |

## Regulatory

| ID | Constraint | Source |
|----|------------|--------|
| R-1 | No named framework (PCI, HIPAA, SOC 2, GDPR, or other) applies to this pricing-display change | [Q2] |
| R-2 | Displayed prices are public marketplace figures; no new personal data is collected | [Q7] |

## Assumptions & Open Questions

- Whether four unbuilt placements can actually ship in 2 weeks is unproven.
- Intent-capture left product-boundary exclusions (backend, new-car, trim/VIN/location) as accepted risk, not as confirmed constraints here.
