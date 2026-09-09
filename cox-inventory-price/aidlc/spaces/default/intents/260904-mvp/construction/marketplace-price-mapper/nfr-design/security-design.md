# Security Design — marketplace-price-mapper

Design patterns for U1 security requirements. Illustrative only — full implementation belongs in Code Generation.

## Input validation strategy

| Requirement | Design |
|-------------|--------|
| NFR4.3 | Before any mapping branch, validate `vehicleModelId`. **Blank** = omitted, `null`, non-string, or empty/whitespace-only string (`typeof id !== "string" \|\| id.trim() === ""`). On blank: `throw new TypeError("vehicleModelId is required")`. Callers must not catch and map to Original MSRP. |
| NFR4.4 / BR1.2 | Presence predicate (no coercion): `function isPresent(x) { return typeof x === "number" && Number.isFinite(x); }`. Both present iff `isPresent(low) && isPresent(high)`. String `"123"`, `null`, `undefined`, `NaN` → absent → Original MSRP path. Never `Number(x)`, unary `+`, or global `isFinite`. |
| NFR4.1 | Inputs/outputs are public marketplace figures and caller display strings only. No PII fields on the call surface. |
| NFR4.2 / NFR5.1 | After validating `vehicleModelId`, **discard** it for the rest of the call — do not return, store, or log it. No `console.*`, analytics, or metrics inside the module. |

## Call order (security-relevant)

```text
1. Validate vehicleModelId → TypeError or continue (discard id)
2. If inFlight → { hide: true, display: null }
3. If readFailed → { hide: false, display: originalMsrpCopy }
4. bothPresent = isPresent(low) && isPresent(high)
5. Marketplace templates or originalMsrpCopy per functional-spec
```

Snippet (≤15 lines, illustrative):

```javascript
function isPresent(x) {
  return typeof x === "number" && Number.isFinite(x);
}
function assertVehicleModelId(id) {
  if (typeof id !== "string" || id.trim() === "") {
    throw new TypeError("vehicleModelId is required");
  }
}
```

## Authn / encryption / headers

Not applicable. In-process import; no HTTP surface, secrets, or session.

## Test design hooks (closes NFR Requirements R-01 / R-02)

NFR7.1 cases must include: string `low`/`high` → Original MSRP (not coerced); blank `vehicleModelId` → thrown `TypeError` (not MSRP).

## Summary

Security is fail-loud id validation, non-coercing presence, and a pure function with no telemetry — not a service perimeter.

## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-09-08T18:33:28Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260904-mvp/construction/marketplace-price-mapper/nfr-design/security-design.md > Call order (security-relevant); functional-design/functional-spec.md > Workflow W1 step 2 | Security call order validates `vehicleModelId` (NFR4.3 / Q2 A) before `inFlight` / `readFailed`. Authoritative W1 evaluates BR1.1 (`inFlight`) first and never asserts blank-id reject. Code Generation following W1 alone will hide on blank id while in flight instead of throwing `TypeError`, violating NFR4.3 on a real caller path. | State explicitly that NFR4.3 `assertVehicleModelId` runs before BR1.1 and revises W1 step 2; require Code Generation to implement security order, not W1-only precedence. | New |
| R-02 | Major | aidlc/spaces/default/intents/260904-mvp/construction/marketplace-price-mapper/nfr-design/traceability.json > NFR7.1; security-design.md > Test design hooks; nfr-requirements/tech-stack-decisions.md > NFR7.1 | Traceability marks NFR7.1 `OK` with a target that only names the two additive security cases (string low/high; blank id). The authoritative NFR7.1 statement in `tech-stack-decisions.md` still omits those cases and lists hide / both-present incl. `0` / half-missing / `readFailed` / both copy variants. No single checklist covers the full matrix; Code Generation can “satisfy” the OK target and still drop either half. | Make one authoritative NFR7.1 checklist (update tech-stack NFR7.1 and/or expand the design + traceability target) that includes both the original Q4 A matrix and the R-01/R-02 security cases. | New |
| R-03 | Minor | aidlc/spaces/default/intents/260904-mvp/construction/marketplace-price-mapper/nfr-design/traceability.json > NFR7.2 | NFR7.2 is `OK` with target text “CI green left to FRE runner at Code Generation,” but `logical-components.md` only covers in-process isolation — it never mentions CI. The OK row over-claims what the cited artifact contains. | Point NFR7.2 at `tech-stack-decisions.md` (or add one CI sentence to logical-components), and keep the target resolvable in the named file. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| `date -u +"%Y-%m-%dT%H:%M:%SZ"` | Hook-denied | PreToolUse blocked Shell. Date uses dispatch fallback `2026-09-08T18:33:28Z`. |
| Stage frontmatter validation tools | None listed | No engine validator named on the stage; sensors are gate-fired. Manual checks below. |
| `aidlc-sensor-required-sections.ts` | Hook-denied; manual PASS | `security-design.md` has ≥5 H2s; `logical-components.md` has ≥5 H2s (floor ≥2). |
| `aidlc-sensor-traceability.ts` | Hook-denied; manual PASS with caveat | All unit detailed IDs NFR4.1–4.4, NFR5.1, NFR7.1–7.2 listed with non-empty OK targets; NFR7.1/NFR7.2 target fidelity weak (R-02, R-03). |
| Q1–Q3 vs artifacts (manual) | PASS | Q1 A → `typeof` + `Number.isFinite`; Q2 A → blank definition + `TypeError` + no catch-to-MSRP; Q3 A → one in-process FRE module, placement-local blast radius. |
| Closes NFR Requirements R-01 / R-02 (manual) | PASS with caveat | Presence predicate and blank/`TypeError` are pinned; test hooks name the two new cases. Full NFR7.1 single-checklist still split (R-02). |
| Library `produces_kinds` / no invented AWS (manual) | PASS | Only security-design + logical-components + traceability; snippet ≤15 lines; no AWS/queue/service boundary. |
| Cross-unit / cycle (manual) | PASS | C1–C4 in-process import; mapper has no outbound deps; acyclic. |

### Summary

Q1–Q3, NFR4.x/5.1 mapping, library artifact set, and fail-loud / non-coercing pins hold, so a developer can implement from this design. Weigh the two Majors before approving: reconcile security call order with authoritative W1, and collapse NFR7.1 into one complete test checklist.
