# AutoQA Step Generate

## Scope
Handle Step 7 only.

## Execution guard
- Before executing Step 7, check if earlier steps have unresolved BLOCKED; if yes, pause and confirm with user.
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

## Skill-local resources
- Template sources: `<skills_root>/autoqa-workflow/templates/{TestPlan,TestCases,RequirementTraceability,TestScript,GenerationReview}.template.*`
