# Practices Discovery Evidence

Lead draft, three support contributions, and the completed interview. The six interview answers replace the suggested defaults.

## Sources inspected

- `aidlc/spaces/default/memory/org.md` — five practice sections used as suggested defaults for the interview, not as established team facts.
- `aidlc/spaces/default/memory/team.md` — empty. Every practice section is template comments only (MEMORY_EMPTY). Example comment prose was not parsed as team intent.
- `aidlc/spaces/default/memory/project.md` — practice sections empty. `## Mandated` and `## Forbidden` are unpopulated templates. One `## Corrections` learning from rough-mockups (WF-2 / WF-3 / WF-4 price-display wording) is product copy, not a way-of-working, testing, or deploy practice.
- `aidlc/spaces/default/intents/260904-mvp/aidlc-state.md` — Project Type Greenfield; Scope mvp; Depth Standard; Test Strategy Standard; reverse-engineering SKIP (greenfield); Languages / Frameworks / Build System Unknown.
- Support contributions:
  - `contributions/aidlc-quality-agent.md`
  - `contributions/aidlc-developer-agent.md`
  - `contributions/aidlc-devsecops-agent.md`
- Interview: `practices-discovery-questions.md` (authoritative answers; consolidated summary confirmed as Looks correct).

Reverse-engineering artifacts were not consumed. Those inputs are conditional on brownfield, and this workflow skipped reverse-engineering.

## Classification note

The workspace is classified **Greenfield**. Product work may later target existing Car and Driver placements. That product target is not brownfield evidence and was not used to infer practices. No Hearst, FRE, or Car and Driver engineering practice was treated as fact except the human-stated FRE ship path in Q5.

## Interview decisions

| Area | Answer | Decision |
| --- | --- | --- |
| Q1 Way of Working | B | Short-lived branches; keep the full commit history (no squash). Resolves the draft squash-merge suggestion. |
| Q2 Walking Skeleton | A | Build the thin end-to-end slice first (walking skeleton on). |
| Q3 Testing methodology | A | Test-after: implement the layer, then write and run its tests. |
| Q4 Quality bar | C | CI green before merge; no coverage number. Drops the org/mvp 80% line-coverage floor (quality OBJECT on unverifiable 80%). |
| Q5 Deployment | X (verbatim) | Create PR in FRE repo https://github.com/Media-Platforms/fre with the existing PR template and bot review/human review and QA pass / product pass then after we put ready to merge label. the bot will do auto merge to stage and feature then production. Replaces org staging-on-merge / separate production approval. |
| Q6 Code Style | A | Follow the project's formatter and linter; otherwise ordinary language naming. |

## Support OBJECT items resolved by the interview

- Quality: drop the 80% coverage floor (Q4 C). CI green remains the merge bar. Coverage measurement is not required.
- Developer: merge history is no-squash (Q1 B), not the draft squash-merge.
- DevSecOps: deploy is the FRE PR path (Q5), not the org staging-on-merge default.

Unanswered style extras (naming beyond ordinary language case, layer boundaries, error handling, file organization) and unanswered security extras (SAST, secret detection, dependency CVE scanning, linter-failure CI block as a named gate) were not asked or answered. They are not recorded as facts.

## Remaining uncertainty

- Coverage is not measured and is not a merge gate. No runner, include/exclude path, or report artifact is required.
- Languages, Frameworks, and Build System remain Unknown. Formatter and linter are followed when they exist; no tool is named yet.
- The interview did not name which CI layers must be green (unit only vs unit plus integration). Standard Test Strategy still governs volume and types; the merge bar is only "CI green."
- No human-stated ALWAYS / NEVER hard constraints. Mandated and Forbidden remain None.
