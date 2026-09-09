# Code Generation Plan — marketplace-price-mapper

Unit U1 library: plain JavaScript sync `mapMarketplacePrice` for in-repo FRE import. No GraphQL, no AWS, no UI.

Application code ships in the FRE repo (`/Users/yesun.joung/GitHub/media-Platform/services/fre`), not under the AIDLC record dir.

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "team",
  "ordering": "Implement each applicable testable layer, then write and run that layer's tests.",
  "scope": "mvp",
  "test_strategy": "standard",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "- **Methodology**: test-after\n- **Ordering**: Implement each applicable testable layer, then write and run that layer's tests.\n\nWe treat tests as a first-class deliverable in every Bolt. The merge bar is CI green. There is no coverage number and no coverage floor.\n\nThe active Test Strategy is Standard; that axis still governs test volume and types. We do not invent a coverage tool or report while Languages, Frameworks, and Build System remain Unknown."
    }
  ],
  "obligations": {
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Meet an 80% line-coverage floor.",
      "Run the selected tests in CI before merge."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:040b78a6bdb4b20694597c1eaed55225e309e80a5a46b984f3e6858947c0806a",
  "contract_sha256": "sha256:9ff989ee6a91de56a88a7e91f13ecc6908910f9f1de7f08a72dc0db6c74f6fcc"
}
```

## Story / AC coverage

| Source | Plan coverage |
|--------|----------------|
| Cross-cutting FR5 / US1.1–US4.1 mapper rules | Steps 3–4 (map function + presence + templates) |
| NFR4.3 / NFR4.4 / security-design | Steps 3–4 (TypeError blank id; non-coercing presence) |
| NFR7.1 / cicd-pipeline | Steps 5–6 (unit tests in FRE suite) |

## Steps

Adapted from the Testing Contract `plan_profile` for a **library-only** unit (omit data-model, repository, API, and frontend layers — N/A for U1).

- [x] **Step 1** — Locate FRE module home for shared helpers (brownfield find). Prefer an existing shared/utils or pricing-adjacent path; do not invent a new package or AWS resource. Record the chosen path in `code-summary.md`.
- [x] **Step 2** — Confirm FRE’s existing test runner and record the exact unit-scoped command in `unit-test-instructions.md` (replace the placeholder path).
- [x] **Step 3** — Implement `mapMarketplacePrice` (and tiny helpers) as plain JavaScript named exports: validate/discard `vehicleModelId` (`TypeError` on blank); `inFlight` → `{ hide: true, display: null }`; `readFailed` → Original MSRP; `isPresent` = `typeof x === "number" && Number.isFinite(x)`; hero-range / starting-at templates via caller `formatDollars`; else Original MSRP. No logging or fetch.
- [x] **Step 4** — Export only the sync API needed by C1–C4 (no structured `MarketplacePrice` on the wire). Keep zero outbound network from this module. Do not wire placements yet (U2–U5).
- [x] **Step 5** — Write unit tests after implementation (test-after) for the cases in `unit-test-instructions.md` (about 5–8 tests; Standard strategy).
- [x] **Step 6** — Run the unit-scoped test command; leave FRE PR CI green.
- [x] **Step 7** — Write `source-manifest.json` listing every FRE path created/modified; write `code-summary.md` and `traceability.json`.

## Out of scope this unit

- Placement GraphQL query edits (U2–U5)
- Price-slot chrome / shrink-to-one-line
- New pipeline, registry package, or monitoring
- Data model / repository / API / frontend layers (not applicable to this library)

## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-09-08T19:05:00Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Minor | apps/fre/scopes/autos/utils/map-marketplace-price.test.js > throws TypeError for blank vehicleModelId; unit-test-instructions.md > Cases to cover item 6 | Blank-id case is implemented correctly (`typeof !== "string" \|\| trim() === ""` → `TypeError`), and the suite has 8 tests covering inFlight, 0-as-present, string non-coercion, half-missing, readFailed, hero-range, starting-at, and TypeError. The blank-id test only asserts whitespace and `null`; unit-test-instructions also list omit / `""` / non-string. | Optionally add assertions for omitted/`undefined`, `""`, and a non-string id so the NFR4.3 blank matrix matches the written case list. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| `date -u +"%Y-%m-%dT%H:%M:%SZ"` | Hook-denied | PreToolUse blocked Shell. Date uses dispatch fallback `2026-09-08T19:05:00Z`. |
| Stage frontmatter validation tools | None listed / Shell blocked | Manual plan-vs-code checks below. |
| Plan approval gate (manual) | PASS | `code-generation-questions.md` records `[Answer]: Approve Plan` with fingerprint. |
| Plan Steps 3–4 vs `map-marketplace-price.js` (manual) | PASS | Security call order (assert → inFlight → readFailed → isPresent); `TypeError` on blank id; non-coercing presence; hero-range / starting-at templates via `formatDollars`; id discarded; no fetch/log/analytics; only `{ hide, display }` returned. |
| Unit test matrix vs instructions (manual) | PASS with caveat | Exactly 8 Vitest cases; all eight instruction rows covered at least once. Blank-id variants incomplete (R-01). |
| `source-manifest.json` / `traceability.json` (manual) | PASS | Manifest paths match shipped files; FR5 / NFR4.1–4.4 / NFR5.1 / NFR7.1–7.2 targets resolve to implementation or tests. |
| Cross-unit / cycle (manual) | PASS | Pure library; no outbound I/O; U2–U5 wiring correctly out of scope. |

### Summary

Approve Plan is recorded, and the shipped mapper matches the plan and security-design on TypeError blank id, non-coercing presence, copy templates, eight tests, and no fetch/log — READY for Build and Test. Only optional blank-id test variants remain.
