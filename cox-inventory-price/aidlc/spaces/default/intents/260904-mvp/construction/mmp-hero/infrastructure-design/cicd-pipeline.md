# CI/CD Pipeline — mmp-hero

Pipeline design for U2 (CAD hero price slot). Ships inside the FRE frontend artifact.

## Pipeline choice

| Decision | Choice | Source |
|----------|--------|--------|
| Pipeline | Existing FRE frontend CI/CD only | Q1 A |
| Deploy target | FRE frontend bundle (stage → prod via existing FRE promotion) | Q1 A, team.md Deployment |
| PR path | https://github.com/Media-Platforms/fre with existing template + bot/human/QA/product review | team.md |
| New AWS / deploy jobs | None for U2 alone | Q3 A, Q4 A |

## Build and test stages (FRE path)

| Stage | U2 expectation |
|-------|----------------|
| Install / build | Hero JSX + fragment changes build with existing FRE frontend |
| Unit / component test | Price-section tests in same FRE PR frontend suite (Q2 A) |
| Coverage cases (NFR7.1) | `inFlight` hide (empty slot); marketplace branch (`display !== originalMsrpCopy`, no MSRP title); MSRP fallback layout; `readFailed` → MSRP without error text in slot; `MarketplaceCta` href unchanged (mock U1 mapper) |
| Lint | Follow FRE lint on touched `caranddriver/` files |
| Deploy | FRE auto-merge to stage/feature then production per existing ready-to-merge label flow |

## Rollback

Revert the FRE PR (or FRE frontend rollback) that introduced the hero marketplace price change. No independent U2 release.

## Summary

U2 rides FRE’s existing PR CI and deploy path. Component tests gate the hero price matrix; no second pipeline or monitoring stack.


## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-09-08T19:36:00Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Minor | cicd-pipeline.md > Coverage cases | FRE test command still unnamed (same as U1/U2 NFR pattern). | Discover npm test path in Code Generation for `caranddriver` hero tests. | Accepted |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| traceability | Manual PASS | Infra-relevant NFR rows map to cicd/monitoring/spec artifacts. |
| Q1-Q4 vs artifacts | Manual PASS | FRE pipeline, no new AWS, no monitoring aligned. |
| produces_kinds | Manual PASS | infrastructure-spec, monitoring-design, cicd-pipeline present for ui unit. |

### Summary

Q1-Q4 locked. Brownfield FRE path with component test matrix is ready for Code Generation. No invented cloud resources.
