## Sources

- [scope] Workflow-selected scope: `mvp`.
- Suggested defaults from `aidlc/spaces/default/memory/org.md` (not team facts).
- Lead draft: `team-practices.md`.

## Q1. How should we merge work?

Suggested default: short-lived branches off `main`, squash-merge back to `main`, typically within one to two days.

- A. Yes — short-lived branches, squash-merge to `main`
- B. Short-lived branches, but keep the full commit history (no squash)
- C. A different merge style (I'll specify)
- D. Not yet defined
- X. Other (please specify)

[Answer]: B

## Q2. Build a thin end-to-end slice first? A walking skeleton is a minimal version that runs the whole way through, built first to prove the pieces connect before the real features go in.

Suggested default for this mvp plan: yes — build that thin slice first and approve it before the rest.

- A. Yes — build the thin end-to-end slice first
- B. No — start the first placement like any other piece of work
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q3. When do we write tests?

Suggested default: write tests after the code for that layer exists (test-after).

- A. After the code — implement the layer, then write and run its tests
- B. Before the code — write a failing test first (TDD)
- C. As scenarios first — describe the behavior, then implement (BDD)
- D. A mix (I'll specify)
- E. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q4. What quality bar must pass before we merge?

Suggested default for this mvp: 80% line coverage and the test run in CI must pass before merge.

- A. 80% line coverage and CI green before merge
- B. CI green, but a different coverage number (I'll specify)
- C. CI green, no coverage number
- D. Not yet defined
- X. Other (please specify)

[Answer]: C

## Q5. How do we ship to staging and production?

Suggested default: merge deploys to staging; production needs a separate human approval.

- A. Merge deploys to staging; production needs a separate human approval
- B. Every passing merge goes all the way to production
- C. No automatic deploy; we ship by hand
- D. Not yet defined
- X. Other (please specify)

[Answer]: X Create PR in FRE repo [https://github.com/Media-Platforms/fre](https://github.com/Media-Platforms/fre) with the existing PR template and bot review/human review and QA pass / product pass then after we put ready to merge label. the bot will do auto merge to stage and feature then production

## Q6. What style rules should agents follow?

Suggested default: use the project's formatter and linter if they exist; otherwise use ordinary language naming. Do not invent a new style guide.

- A. Follow the project's formatter and linter; otherwise ordinary language naming
- B. A named style guide applies (I'll specify)
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
