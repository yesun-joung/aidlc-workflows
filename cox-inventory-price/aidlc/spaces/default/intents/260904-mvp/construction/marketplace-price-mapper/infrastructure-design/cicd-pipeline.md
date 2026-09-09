# CI/CD Pipeline — marketplace-price-mapper

Pipeline design for U1 (in-process FRE JavaScript library). No separate deployable.

## Pipeline choice

| Decision | Choice | Source |
|----------|--------|--------|
| Pipeline | Existing FRE frontend CI/CD only | Q1 A |
| Deploy target | None for U1 alone — ships inside the FRE frontend artifact | Q1 A, logical-components.md |
| Package registry | Do not publish a standalone mapper package | Q1 A (rejects Q1 B) |
| New AWS / alarms | None for U1 | Q3 A |

## Build and test stages (FRE path)

| Stage | U1 expectation |
|-------|----------------|
| Install / build | Mapper source is part of the FRE tree; built with the existing frontend build |
| Unit test | Mapper tests run in the same FRE PR frontend test suite (Q2 A) |
| Coverage cases | Per NFR7.1 / security-design: hide; both-present incl. 0; string low/high → MSRP; half/missing; readFailed; blank `vehicleModelId` → TypeError; both copy variants |
| Lint / typecheck | Follow whatever FRE already runs on touched JS; do not invent a second lint gate |
| Deploy | FRE’s existing promotion path; no mapper-specific deploy job |

## Rollback

Rollback is the FRE frontend rollback / revert of the PR that introduced the mapper. There is no independent U1 release to roll back.

## Summary

U1 rides FRE’s existing PR CI and frontend deploy. No second pipeline, registry publish, or monitoring stack.

## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-09-08T18:40:00Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Minor | aidlc/spaces/default/intents/260904-mvp/construction/marketplace-price-mapper/infrastructure-design/cicd-pipeline.md > Build and test stages (FRE path) > Coverage cases | The coverage checklist says only “hide” without naming `inFlight` as the hide trigger (tech-stack NFR7.1 / W1 BR1.1). A developer wiring FRE tests from this row alone could assert hide on the wrong condition. | Rephrase the coverage bullet to `inFlight` hide (not other fallbacks), keeping the rest of the NFR7.1 / security matrix. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| `date -u +"%Y-%m-%dT%H:%M:%SZ"` | Hook-denied | PreToolUse blocked Shell. Date uses dispatch fallback `2026-09-08T18:40:00Z`. |
| Stage frontmatter validation tools | None listed | No engine validator named on the stage; sensors are gate-fired. Manual checks below. |
| `aidlc-sensor-required-sections.ts` | Hook-denied; manual PASS | `cicd-pipeline.md` has 4 H2s before this review (`Pipeline choice`, `Build and test stages`, `Rollback`, `Summary`) — meets ≥2 floor. |
| `aidlc-sensor-traceability.ts` | Hook-denied; manual PASS | `upstream_ids` match nfr-design set (NFR4.1–4.4, NFR5.1, NFR7.1–7.2); no `GAP`/`ORPHAN`; OK/N/A rows have non-empty targets pointing into `cicd-pipeline.md` or explicit no-infra rationale. |
| Q1–Q3 vs artifacts (manual) | PASS | Q1 A → FRE frontend CI only, no registry publish; Q2 A → same FRE PR frontend suite; Q3 A → no new AWS/alarms/dashboards. |
| NFR7.1 coverage cases (manual) | PASS with caveat | Matrix lists both-present incl. 0, half/missing, readFailed, both copy variants, plus security string low/high and blank-id TypeError. `inFlight` hide is under-specified as bare “hide” (R-01). |
| Library `produces_kinds` / no invented AWS (manual) | PASS | Only `cicd-pipeline.md` + `traceability.json`; no infra-spec/monitoring files; no cloud resources invented. |
| Cross-unit / cycle (manual) | PASS | Pipeline rides FRE host path; C1–C4 remain in-process imports; no outbound U1 infra deps. |

### Summary

Q1–Q3, library-only artifact set, no invented AWS, and a complete NFR7.1 (+ security) CI case list make this implementable. One Minor: name `inFlight` on the hide coverage bullet so the FRE test suite cannot misfire.
