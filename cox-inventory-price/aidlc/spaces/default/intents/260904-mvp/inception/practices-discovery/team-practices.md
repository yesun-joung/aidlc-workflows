# Team Practices

**Status:** Affirmed from the practices-discovery interview. These replace the earlier suggested defaults.

## Way of Working

We work on short-lived feature branches and keep the full commit history. We do not squash-merge.

Construction worktrees still use `main` as the base and merge target. Staging and production are not gated by long-lived release branches; promotion follows the Deployment process below.

## Walking Skeleton

We build a thin end-to-end slice first (walking skeleton on). That first slice proves the pieces connect before the rest of the features go in. It is solo and gated: we approve it before remaining work runs. After it ships, we decide whether later Bolts stay gated or continue more autonomously.

## Testing Posture

- **Methodology**: test-after
- **Ordering**: Implement each applicable testable layer, then write and run that layer's tests.

We treat tests as a first-class deliverable in every Bolt. The merge bar is CI green. There is no coverage number and no coverage floor.

The active Test Strategy is Standard; that axis still governs test volume and types. We do not invent a coverage tool or report while Languages, Frameworks, and Build System remain Unknown.

## Deployment

We ship through the FRE repo. Create a PR in https://github.com/Media-Platforms/fre with the existing PR template and bot review/human review and QA pass / product pass then after we put ready to merge label. the bot will do auto merge to stage and feature then production.

## Code Style

We follow the project's formatter and linter. If none exist yet, we use ordinary language naming. We do not invent a project-wide style guide, rename rule, or a tool that is not in the repo.

This workspace currently reports Languages, Frameworks, and Build System as Unknown. Agents read repo formatter and linter config first once it appears.
