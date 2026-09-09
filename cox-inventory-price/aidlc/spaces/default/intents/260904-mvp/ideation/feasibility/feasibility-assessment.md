# Feasibility Assessment

Upstream intent: `intent-statement.md` (four used-car placements showing marketplace prices instead of MSRP).

## Technical viability

The change is feasible as an update on a known surface, not a new platform. [Q3][Q8]

Work connects the existing Car and Driver used-car page modules in FRE (`/Users/yesun.joung/GitHub/media-platform/services/fre`) and reads marketplace high/low from the existing GraphQL `vehicle_models` price API. [Q1][Q8]

The four placement tickets are not built yet. The team already works in the FRE Car and Driver front-end stack. [Q3]

Marketplace high/low data is already available on that API. [Q1][Q8]

No new AWS account or service is required; the change stays on the current site and accounts. [Q6]

## Schedule and cost

There is no budget cap. The target is to complete in 2 weeks. [Q4]

That target is tight against four unbuilt placements and a review at each placement milestone. Treat 2 weeks as a goal, not a proven capacity. [Q3][Q4]

## Regulatory and data

No named regulatory framework applies to this pricing-display change. [Q2]

Displayed prices are public marketplace figures. No new personal data is collected. [Q7]

## Organizational

No freeze, missing owner, or competing priority was identified. [Q5]

## Verdict

Feasible to proceed. The main risk is schedule: four unbuilt FRE placements in 2 weeks, dependent on the existing GraphQL price fields remaining available.

## Assumptions & Open Questions

- The GraphQL `vehicle_models` marketplace high/low fields stay available and stable for the 2-week window.
- FRE at the named local path is the implementation home for the four placements.
- Two weeks is a target, not a confirmed team-capacity estimate.
