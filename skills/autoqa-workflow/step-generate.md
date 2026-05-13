# AutoQA Step Generate

## Scope
Handle Step 7 only.

## Execution guard
- Before executing Step 7, check if earlier steps have unresolved BLOCKED; if yes, stop progression.
- If generation is blocked by missing artifacts/dependencies, first attempt self-check/remediation (artifact existence check, template/script presence, runtime/package check and bootstrap) before classifying BLOCKED.

## Artifacts
- testing-artifact/deliverables/TestPlan.md
- testing-artifact/deliverables/TestCases.md
- testing-artifact/deliverables/RequirementTraceability.md
- testing-artifact/scripts/TestScript.ts
- testing-artifact/handoff/GenerationReview.md

## Gate loop
- 7A: draft generation
- 7B: first gate review
- 7C: remediation
- 7D: re-review
- Repeat 7C/7D until pass, max 5 review iterations (including 7B)

## Mandatory constraints
- case-to-source traceability is required
- when validation/permission/branch/boundary signals exist:
  non-happy cases (negative+boundary+permission) >= happy-path cases
- RTM must be bidirectional with coverage state
- write each gate result and gap list in GenerationReview.md
- TestCases.md must include `Coverage Statistics (required)` (or `覆蓋統計（必填）`) with:
  - Flow Type Counts: happy-path / negative / boundary / permission
  - Coverage Rule Check result
  - Critical Flow Mapping (critical flow -> case IDs)
- Each test case row must include:
  - `Case ID`, `Requirement ID or Doc Anchor`, `Source Ref`, `Flow Type`, `Preconditions`, `Steps`, `Assertions`, `Expected Result`, `Priority`
- TestScript.ts must:
  - map test cases by case ID
  - include explicit assertions (not URL-only smoke)
  - use action contract + interaction preflight output for high-risk interactions
  - include at least one protection strategy for high-risk interactions (wait signal / fallback selector / single retry / explicit fail message)

## Scenario planning baseline (must cover)
- Positive path:
  - core happy paths for each critical user goal
- Negative path:
  - invalid inputs, missing required fields, malformed format, and error handling paths
- Permission/role restrictions:
  - role-based allow/deny cases and unauthorized access handling
- Boundary/edge conditions:
  - min/max/empty/long input values and branch boundaries
- Recovery/resilience:
  - retry/cancel/back navigation and interruption recovery when applicable

## Coverage balance rule
- For requirements/pages that include validation, branching, or permission signals:
  - test set must include positive + negative + permission-restriction scenarios together
  - do not approve gate if only happy-path cases exist

## Minimum case allocation rule (machine-checkable)
- For each critical flow, at least 1 happy-path case is required.
- If validation/permission/branch/boundary signals are identified:
  - total(non-happy) >= total(happy-path)
- If no such signals are identified from current evidence:
  - still require at least 1 negative or boundary case globally.

## Gate result rules (7B/7D machine-checkable)
- PASS only if all conditions below are met:
  1) artifacts exist and are updated: TestPlan.md / TestCases.md / TestScript.ts / RequirementTraceability.md / GenerationReview.md
  2) case-to-source traceability is complete for all cases
  3) minimum case allocation rule passes
  4) script assertions and case ID mapping are complete
  5) RTM has covered/partial/not-covered summary
- Otherwise set gate result to FAIL, append structured gaps, and enter 7C remediation.
- Max review iterations: 5 (including first 7B). If still FAIL at iteration 5, mark Step 7 as `BLOCKED` with unresolved gaps and required user decision.

## Skill-local resources
- Template sources: `<skills_root>/autoqa-workflow/templates/{TestPlan,TestCases,RequirementTraceability,TestScript,GenerationReview}.template.*`
