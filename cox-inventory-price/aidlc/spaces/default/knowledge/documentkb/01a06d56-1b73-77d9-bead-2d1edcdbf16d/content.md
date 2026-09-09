# Vision Doc: Model-level Used Car Pricing

*Replacing legacy MSRP messaging with current marketplace pricing*

| **Audience**         | Product, Design, Engineering, QA, and AI DLC workflow reviewers                                |
|----------------------|------------------------------------------------------------------------------------------------|
| **Experience scope** | Front-end updates across four used-car pricing placements                                      |
| **Data source**      | Model-year Low and High marketplace prices stored in VDAT and exposed through the existing API |
| **Status**           | Backend data work complete; front-end implementation is the remaining project scope            |

# 1. Executive Summary

Car and Driver currently shows Starting At MSRP values and MSRP ranges
in several places where shoppers are researching used vehicles. Original
MSRP describes what a vehicle cost when it was new; it does not tell a
used-car shopper what comparable vehicles are being listed for in the
market today. This creates a mismatch between the shopper’s
question—“Can I afford this vehicle now?”—and the price information we
provide.

This project will replace legacy MSRP messaging on used-car experiences
with marketplace pricing sourced from AutoTrader inventory. The existing
backend work is complete: model-year marketplace Low and High prices are
stored in VDAT and available to the front end through API fields. The
remaining work is to update the four front-end placements so used-car
shoppers see current, actionable price guidance wherever the legacy MSRP
is displayed.

# 2. Vision

When a shopper researches a used vehicle on Car and Driver, every price
signal should help them understand the vehicle’s current market
affordability—not the vehicle’s historical new-car price. By replacing
original MSRP with marketplace pricing at the model-year level, we will
make used-car research more relevant, improve price transparency, and
help shoppers move confidently from research toward local inventory.

# 3. Problem to Solve

- Original MSRP is anchored to the vehicle’s new-car launch pricing and
  becomes less useful as the vehicle enters the used market.

- An MSRP range can imply a level of precision or relevance that does
  not reflect current used inventory, mileage, condition, trim mix, or
  local availability.

- Displaying historical MSRP alongside used-car content can confuse
  shoppers about what they should expect to pay today.

- The site has current marketplace pricing available, but the front-end
  experience does not yet surface it consistently across key research
  and discovery modules.

# 4. Goals

- Make pricing on used-car experiences current and relevant to the
  shopper’s purchase decision.

- Replace Starting At MSRP and MSRP range messaging in the defined
  placements for vehicles identified as Used in VDAT.

- Present marketplace prices consistently using the model-year Low and
  High price fields already available through the API.

- Give shoppers a clearer affordability signal and a more credible
  reason to continue to marketplace inventory.

- Preserve a reliable, understandable experience when marketplace
  pricing is unavailable or incomplete.

# 5. Non-Goals and Scope Boundaries

- No changes to AutoTrader inventory ingestion, price calculation, VDAT
  storage, or API creation; this backend work is complete.

- No redesign of the four modules beyond the pricing treatment needed to
  replace MSRP.

- No change to new-car pricing experiences; new vehicles should continue
  to use the existing MSRP treatment unless separately specified.

- No trim-level, VIN-level, or location-specific price calculation in
  this phase; the supplied values are model-year-level marketplace
  prices.

- No claim that a marketplace range represents every vehicle, every
  configuration, or a guaranteed transaction price.

# 6. Intended Shopper Experience

A shopper viewing used-car content should be able to quickly answer
three questions:

1.  Is this vehicle likely within my budget?

2.  What are comparable vehicles currently listed for?

3.  Where can I see the actual vehicles behind this price signal?

The pricing treatment should be concise and scannable. It should clearly
distinguish a current marketplace price from an original MSRP and use
supporting language or a tooltip where needed to set expectations that
prices reflect listed inventory and can vary by vehicle, mileage,
condition, equipment, and market.

# 7. Front-end Scope by Placement

| **Placement**          | **Used experience**                                     | **Current treatment** | **Target treatment**                                                                      | **Source Jira** |
|------------------------|---------------------------------------------------------|-----------------------|-------------------------------------------------------------------------------------------|-----------------|
| MMP hero               | MMPs with Used VDAT marketplace status                  | MSRP or MSRP range    | Retail Price Range / nationwide Marketplace Price Range using Low–High marketplace prices | SHOP-822        |
| MMP ranking module     | MMPs with Used VDAT marketplace status                  | Starting At MSRP      | Starting at the lowest available marketplace price                                        | SHOP-823        |
| Back of vehicle cards  | Vehicle cards for Used vehicles                         | Starting At MSRP      | Starting at price based on the lowest marketplace price for the model                     | SHOP-825        |
| Category vehicle cards | Used Category, Sub-Category, and Category Ranking pages | Starting At MSRP      | Starting at the lowest available marketplace price                                        | SHOP-829        |

# 8. Functional Requirements

> **Used-only applicability:** Apply the marketplace pricing treatment
> when the relevant vehicle or page is identified as Used by the VDAT
> marketplace status. Do not apply it to new-car or future-car
> experiences.
>
> **Model-year source:** Use the model-year-level marketplace Low and
> High values returned by the existing VDAT API fields. Do not derive or
> recalculate values in the client.
>
> **Range display:** Where the placement currently communicates an MSRP
> range, display the marketplace Low–High range with clear
> marketplace-oriented labeling.
>
> **Starting price display:** Where the placement currently communicates
> Starting At MSRP, display the marketplace Low value as the starting
> price.
>
> **Consistent formatting:** Use the site’s existing currency
> formatting, rounding, and responsive behavior. Avoid implying a
> greater level of precision than the source supports.
>
> **Fallback behavior:** If required marketplace price data is missing,
> null, invalid, or cannot be returned, the approved fallback treatment
> is to continue to display the Starting At MSRP or MSRP range.
>
> **Accessibility:** Pricing labels must remain understandable to
> screen-reader users and must not rely on visual styling alone to
> communicate that the value is marketplace pricing.
>
> **Analytics continuity:** Preserve existing module and pricing
> interaction analytics where possible; if event names or metadata
> change, document the changes so pre/post performance can be compared.

# 9. Pricing Language and Content Principles

- Use “Marketplace” or equivalent language wherever the UI could
  otherwise be mistaken for an original MSRP or a guaranteed selling
  price.

- Use “Starting at” only when the value represents the lowest available
  marketplace price in the applicable model-year data set.

- Use “Price range” when both Low and High values are available and
  valid.

- Avoid calling the marketplace range an MSRP range; that term should
  remain reserved for new-vehicle pricing.

- Set expectations that actual prices vary by vehicle and can change as
  inventory changes.

- Keep the primary price signal concise; supporting explanation should
  be secondary, such as helper text, tooltip, or nearby disclaimer.

# 10. Edge Cases and Expected Handling

| **Scenario**                        | **Expected behavior**                                                                         | **Decision needed before launch**                               |
|-------------------------------------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| Low and High are present            | Render the marketplace price range in range placements; render Low in Starting At placements. | Confirm exact label and separator formatting.                   |
| Only Low is present                 | Render a Starting At price where appropriate; do not fabricate a High value.                  | Confirm whether range placements show Low only or use fallback. |
| Used status is missing or ambiguous | Do not assume Used; retain existing behavior until status is resolved.                        | Confirm source-of-truth behavior for ambiguous status.          |

# 11. Success Measures

The primary success measure is whether the new pricing signal improves
the usefulness and performance of used-car discovery experiences without
introducing data or comprehension issues.

- Primary: increase click-through rate from affected used-car modules to
  marketplace inventory.

- Secondary: improve downstream marketplace engagement, including
  vehicle-detail views and lead-start or lead-submit activity where
  measurable.

- Quality: reduce shopper confusion or support feedback related to
  used-car MSRP messaging.

- Trust: maintain or improve engagement with affected pages while
  avoiding increases in pricing-related complaints or misinterpretation.

- Technical: achieve complete and accurate rendering across the four
  placements, responsive breakpoints, and defined data edge cases.

Recommended measurement approach: establish a pre-launch baseline for
affected used pages and compare post-launch performance by placement,
device, page type, and availability of marketplace price data. If
traffic and implementation conditions allow, use an A/B test or phased
rollout to isolate the impact of the pricing treatment.

# 12. Validation and Launch Criteria

- Each of the four defined placements displays the correct marketplace
  treatment for Used experiences.

- New-car and future-car pages continue to display the existing new-car
  price treatment.

- Low, High, partial, invalid, and missing data cases behave according
  to the approved fallback rules.

- Prices match the model-year values returned by the API and are not
  recalculated or substituted by the client.

- Labels are understandable, accessible, responsive, and visually
  consistent with surrounding content.

- Existing analytics events remain functional or are updated and
  documented.

- QA verifies representative page types, makes, model years, devices,
  and inventory-availability states before release.

# 13. Dependencies, Assumptions, and Open Decisions

- Dependency: the front end can access the completed VDAT model-year Low
  and High marketplace price fields through the existing API.

- Assumption: the API contract, field definitions, currency, and update
  cadence are stable for this front-end release.

- Assumption: Cox marketplace prices represent listed prices and should
  be presented as guidance, not a guaranteed transaction price.

- Open decision: approve final user-facing labels for range and Starting
  At treatments.

- Open decision: approve fallback copy and whether pricing is hidden
  when no valid marketplace price is available.

- Open decision: confirm whether a short explanation or tooltip is
  required to distinguish marketplace pricing from MSRP.

- Open decision: confirm analytics naming and reporting treatment for
  the new price values.

# 14. Related Jira Work

- SHOP-822 — Integrate Used Price Ranges on the MMP Hero —
  https://mediaos.atlassian.net/browse/SHOP-822

- SHOP-823 — Integrate Used Starting At Price on the MMP Ranking Module
  — https://mediaos.atlassian.net/browse/SHOP-823

- SHOP-825 — Integrate Used Starting At Price on the Back of Vehicle
  Cards — https://mediaos.atlassian.net/browse/SHOP-825

- SHOP-829 — Integrate Used Starting At Price on Category Vehicle Cards
  — https://mediaos.atlassian.net/browse/SHOP-829

# 15. DLC Handoff Summary

AI DLC should evaluate the front-end implementation against the
following product intent:

- A used-car shopper sees current marketplace pricing wherever the
  experience previously showed original MSRP.

- The displayed value is sourced from the correct model-year VDAT
  marketplace fields through the API.

- The experience clearly communicates whether it is showing a starting
  price or a marketplace range.

- The change is limited to the four defined front-end placements and
  does not regress new-car pricing.

- Missing or invalid data produces a deliberate, non-misleading
  fallback.

- The resulting UI is understandable, accessible, responsive, and
  measurable.
