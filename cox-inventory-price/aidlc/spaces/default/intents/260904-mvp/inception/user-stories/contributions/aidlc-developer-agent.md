**Collaborator:** aidlc-developer-agent

## Contribution

FRE can implement each story on its own existing used-car module. The GraphQL `vehicle_models` marketplace high/low fields already exist; no new price source, backend, or button is required. Size each story at 1–3 days (inside the 1–5 day band). Walking skeleton is US1.1, then US2.1 / US3.1 / US4.1 after that slice is approved. Test-after: implement the slot swap, then write tests against the four ACs.

- **US1.1 (MMP hero, first slice):** One existing hero module. Prove `vehicle_models` read → `Marketplace  $LOW - $HIGH` when both sides are present → keep the current Original MSRP string when missing, half-populated, or the read fails → reuse the hero's existing click-through to the marketplace inventory listing. About 2 days. This is the only story that should start first.
- **US2.1 (MMP ranking):** Independent after US1.1. Same API and fallback/click-through rules on the ranking rows. Per-row rendering does not push it past 3 days. No shared-code gate with the hero.
- **US3.1 (vehicle-card backs):** Independent after US1.1. Same slot/fallback/click-through pattern on the existing card-back module. Host page names are still unnamed; that is find-time in FRE, not extra story size or a new page. About 2 days once the module is located.
- **US4.1 (category cards):** Independent after US1.1. Same pattern for the category's existing model-set price slot. Bind to the module's current `vehicle_models` usage; do not invent trim/VIN/location pricing or a new aggregator. About 2 days once the module is located.
- **Shared ACs, not a shared story:** Missing/half/error fallback (FR5) and "no new button" are the same branch in each module. Keep them as ACs. Do not extract a helper that would couple the four stories.
- **Test-after / merge bar:** Implement, then cover happy path, missing/half, read-fail, and existing click-through. CI green; no coverage number.
- **Won't Have is implementable as written:** No new See inventory button, no vehicle-detail destination, no new click events.

## Positions

- AGREE: One Must Have story per placement, US1.1 first — FRE can ship and approve the hero independently; the other three have no shared-code gate.
- AGREE: Fallback stays ACs on each story — same keep-slot / existing-Original-MSRP branch; a fifth story would not change implementation.
- AGREE: No new button; reuse existing click-through — ACs are verify-href, not new UI.
- AGREE: Story size 1–3 days each (inside 1–5) — one existing module plus existing `vehicle_models` high/low; none are unimplementable or oversize.
- AGREE: Test-after — ACs are Given/When/Then enough to write tests after the slot swap; merge bar is CI green.
