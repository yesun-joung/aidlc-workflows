# Security Requirements — marketplace-price-mapper

Security and data-handling requirements for U1 (pure sync library). No network I/O, no AWS, no secrets store.

## Requirements

| ID | Statement | Category | Source |
|----|-----------|----------|--------|
| NFR4.1 | Mapper inputs and outputs carry only public marketplace figures and caller-owned display strings. No personal data is collected, stored, or inferred. | data-classification | NFR4, Q3 A |
| NFR4.2 | The mapper must not log, analytics-emit, or otherwise telemetrize `vehicleModelId`, low/high, or display strings. Pure function only. | telemetry | NFR4, NFR5, Q3 A |
| NFR4.3 | A missing or blank `vehicleModelId` must reject the call (throw / hard fail). Do not invent hide or Original MSRP for a caller bug. | input-validation | Q2 A, BR1.9 |
| NFR4.4 | Low/high presence uses finite numbers only (including `0`); omitted, `null`, and `NaN` are absent. No coercion of untrusted strings into numbers inside the mapper. | input-validation | BR1.2, NFR4 |
| NFR5.1 | No new analytics events, metrics, or tracking calls may be added inside this library. | analytics | NFR5, Q3 A |

## Threat notes (library scope)

| STRIDE area | Assessment | Control |
|-------------|------------|---------|
| Spoofing / Tampering | Callers pass already-fetched GraphQL fields; mapper is in-process and sync | Trust caller flags; no second fetch (BR1.8) |
| Information disclosure | Prices are public; avoid accidental logging of ids or copy | NFR4.2 |
| Denial of service | Pure CPU map; no I/O | Out of scope for U1 |
| Elevation | No authz surface | N/A |

## Summary

U1 is a pure JavaScript mapping function over public price fields. Security work here is input rejection for blank ids, no telemetry, and no new personal data — not authn/authz or encryption.

## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-09-08T18:25:14Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260904-mvp/construction/marketplace-price-mapper/nfr-requirements/security-requirements.md > NFR4.4; tech-stack-decisions.md > Language / NFR7.1 | Q1 B locks plain JavaScript (no types). NFR4.4 forbids coercing untrusted strings into numbers, and BR1.2 defines presence as “finite number,” but neither pins a non-coercing JS predicate. Global `isFinite` / unary `+` coerce numeric strings and would emit marketplace copy for string `low`/`high`, violating NFR4.4 and FR5. With no TypeScript boundary, this is a real Code Generation footgun. | Pin the presence check to a non-coercing form (e.g. `typeof x === "number" && Number.isFinite(x)`), and add an NFR7.1 case: string `low`/`high` → Original MSRP (not marketplace), not coerced. | New |
| R-02 | Major | aidlc/spaces/default/intents/260904-mvp/construction/marketplace-price-mapper/nfr-requirements/security-requirements.md > NFR4.3; tech-stack-decisions.md > NFR7.1 | Q2 A / NFR4.3 require reject on missing or blank `vehicleModelId`, but “blank” is undefined (`""`, whitespace-only, `null`, non-string in plain JS) and the fail shape is only “throw / hard fail” with no Error kind or message. NFR7.1’s confirmed Q4 A matrix omits this path, so the only new hard-fail security control can ship untested while hide/MSRP cases are covered. | Define blank as omitted/`null`/non-string/empty-or-whitespace-only string; name the throw (e.g. `TypeError`); state callers must not catch-and-map to MSRP; add that case to NFR7.1. | New |
| R-03 | Minor | aidlc/spaces/default/intents/260904-mvp/construction/marketplace-price-mapper/nfr-requirements/security-requirements.md > NFR4.2 / NFR4.3; Threat notes Spoofing | After NFR4.3 validation, nothing states that `vehicleModelId` is discarded (no return field, no log sink per Q3 A / NFR4.2). Implementers may still invent an identity object or “tracing” holdover from BR1.9 / earlier FD wording. | Add one sentence: validate then discard — id is not returned, stored, or logged. | New |
| R-04 | Minor | aidlc/spaces/default/intents/260904-mvp/construction/marketplace-price-mapper/nfr-requirements/tech-stack-decisions.md > Test tooling | “FRE’s existing test runner” is unnamed (no package, script, or path). NFR7.1 is implementable once the runner is found, but Code Generation still has to invent the discovery. | Name the FRE test command/package when known, or mark TBD with an owner for Code Generation. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| `date -u +"%Y-%m-%dT%H:%M:%SZ"` | Hook-denied | PreToolUse blocked Shell. Date uses dispatch fallback `2026-09-08T18:25:14Z`. |
| Stage frontmatter validation tools | None listed | No engine validator named on the stage; sensors are gate-fired. Manual checks below. |
| `aidlc-sensor-required-sections.ts` | Hook-denied; manual PASS | `security-requirements.md` has ≥2 H2s (Requirements, Threat notes, Summary); `tech-stack-decisions.md` has ≥2 H2s (Decisions, Derived requirements, Alternatives rejected, Summary). |
| `aidlc-sensor-traceability.ts` | Hook-denied; manual PASS | `upstream_ids` lists NFR1–NFR7; OK targets resolve to NFR4.1–4.4, NFR5.1, NFR4.2, NFR7.1–7.2; NFR1–3,6 are N/A with non-empty justifications. |
| Q1–Q4 vs artifacts (manual) | PASS | Plain JS (Q1 B); reject blank id (Q2 A / NFR4.3); no logging/telemetry (Q3 A / NFR4.2, NFR5.1); test-after with FRE runner cases (Q4 A / NFR7.1). |
| Library `produces_kinds` (manual) | PASS | Only security + tech-stack + traceability present; missing performance/scalability/reliability/observability is by design for a library unit. |
| Contract “TypeScript-style” vs Q1 B (manual) | PASS | Contract denotes call shape; tech-stack correctly chooses plain JS and rejects TS module (Q1 A). No new AWS/analytics. |
| Cross-unit / cycle (manual) | PASS | No outbound unit deps; C1–C4 remain in-process import; throw is caller-bug fail-loud per Q2 A (precision gaps in R-02). |

### Summary

Q1–Q4, NFR4/5/7 derivation, N/A rows, library artifact set, and JS-vs-contract wording hold, so a developer can build from this. Weigh the two Majors before approving: pin non-coercing presence checks for plain JS, and make blank-id reject (and its test) precise enough that Code Generation cannot guess wrong.
