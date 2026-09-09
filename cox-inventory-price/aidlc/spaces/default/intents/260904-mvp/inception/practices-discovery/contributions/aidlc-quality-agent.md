**Collaborator:** aidlc-quality-agent

## Contribution

Greenfield quality review of the lead draft only. `team.md` and `project.md` practice sections are empty. `org.md` Testing Posture is a suggested default, not a Hearst, FRE, or Car and Driver fact. Reverse-engineering was skipped; no repo test suite, runner, coverage reporter, or CI config is in evidence. Languages, Frameworks, and Build System are Unknown, so no Jest, pytest, or similar tool may be treated as this team's practice.

**Testing posture.** The draft's `Methodology: test-after` and layer-then-test `Ordering` match the org default and the stage contract (`Methodology` and `Ordering` as structured fields; coverage and tooling as extra notes). "Tests as a first-class Bolt deliverable" and "do not weaken floors to make Build and Test pass" also match `org.md`. Those lines are interview candidates, not affirmed cadence. The interview must ask whether the team keeps test-after or chooses TDD, BDD, ATDD, or a mixed `custom` cadence. Do not infer BDD from later story Given/When/Then format; that is an inception writing convention, not a construction methodology.

**Coverage tooling.** The mvp 80% line-coverage floor is the org scope add-on for `mvp`, not a measured baseline. With no language or build system, there is no coverage tool, include/exclude path, or report artifact. Affirming "80%" without naming how Build and Test will measure it leaves the floor unverifiable. Interview should confirm the number (keep 80% line, add branch, or pick another floor) and that the first end-to-end slice is where the runner and coverage report get wired. Do not invent a tool name before the stack exists.

**CI quality gates.** "CI execution before merge" is the org mvp add-on and a sound suggested gate. The draft does not say which layers that job runs. Active Test Strategy is Standard, which governs volume and types (unit plus integration; e2e is not required at Standard). If the interview leaves the merge job unspecified, Construction will guess unit-only or unit-plus-integration. Ask: unit only before merge, or unit plus integration. Also ask whether a red coverage floor fails the merge. Operation stages are out of scope; that does not excuse skipping a Construction-time test gate.

**Test and code patterns.** No on-disk test layout, naming, factories, or shared fixtures exist. Independence and no shared mutable state are quality defaults to apply once a runner exists; they are not team facts and should not be written as Mandated unless the human says so. No FRE or Car and Driver test folder, pyramid, or flaky-test policy was observed; do not import one.

**Mandated / Forbidden.** Empty is correct. The interview has not run. Do not mint `ALWAYS` / `NEVER` testing rules from org suggestions.

**Gaps the interview must resolve**

1. Methodology and Ordering: keep org test-after, or choose TDD / BDD / ATDD / custom.
2. Coverage floor: accept 80% line, change the number, and/or add branch coverage.
3. Measurement: confirm the floor is wired in the first thin slice (runner + report), not left as an unenforceable percent.
4. Merge gate contents: unit only vs unit plus integration; coverage fail blocks merge or not.
5. Hard constraints: any human-stated testing ALWAYS/NEVER (for example, never weaken the floor to pass a step) — otherwise leave Mandated/Forbidden empty.

## Positions

- AGREE: Greenfield framing and empty Mandated/Forbidden — no team testing practice exists yet; org lines are suggestions only.
- AGREE: Structured `Methodology` / `Ordering` as test-after, layer then test — faithful restatement of `org.md` and the stage contract.
- AGREE: Tests as a first-class Bolt deliverable; Standard strategy stays additive; floors are not weakened to pass Build and Test — matches org Testing Posture.
- AGREE: mvp 80% line-coverage floor and CI before merge as the *suggested* org add-on — correctly sourced, not inferred from product context.
- OBJECT: Merge CI contents are unspecified — Standard implies unit plus integration, so the interview must name which layers block merge.
- OBJECT: 80% is proposed with no runner or coverage report — affirming the number without wiring measurement in the first slice makes the floor unverifiable.
