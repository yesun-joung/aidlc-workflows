# mmp-ranking (U3) — Codegen Handoff

Bolt 2 implementation for contract **C2** (`copyVariant: starting-at`). Staged here because the active AIDLC directive is still `mmp-hero` code-generation; the plan-approval guard blocks direct writes to `apps/fre/`.

## Apply

```bash
bash aidlc/spaces/default/intents/260904-mvp/construction/mmp-hero/code-generation/apply-mmp-ranking-changes.sh
```

Then run tests:

```bash
cd /Users/yesun.joung/GitHub/media-Platform/services/fre/apps/fre/scopes/caranddriver
npm test -- components/content/review/vehicle-ranking/vehicle-ranking-card.test.jsx
npm test -- components/content/review/vehicle-ranking/utils.test.js
```

## What changed

| File | Change |
|------|--------|
| `vehicle-model.js` | Add `marketplace { high low }` (+ `high`, `is_estimate` on used path) to both ranked-list `review_articles.price` blocks |
| `utils.js` | Pass full `price` object per row |
| `vehicle-ranking-card.jsx` | Wire `mapMarketplacePrice` with `starting-at`; used-only gate; `STARTING AT:` chrome |
| `index.jsx` | Pass `marketStatus`, `inFlight={false}`, `readFailed={false}` |
| `vehicle-ranking-card.test.jsx` | New — 6 tests for AC2.1.1–2.1.4 + inFlight hide |

## C2 / US2.1 mapping

- **AC2.1.1:** Both marketplace prices on used page → `STARTING AT: $LOW` (mapper `starting-at` + placement chrome)
- **AC2.1.2:** Missing/half → `STARTING AT: $msrpLow` (existing slot copy)
- **AC2.1.3:** `readFailed` → MSRP fallback via mapper
- **AC2.1.4:** Unchanged `MarketplaceCta` Shop button

## Staging path

`staging-mmp-ranking/apps/fre/scopes/caranddriver/components/content/review/vehicle-ranking/`

## Next AIDLC step (optional)

When ready to formalize U3 in the workflow record, run `/aidlc --stage code-generation --unit mmp-ranking` and move these artifacts to `construction/mmp-ranking/code-generation/`.
