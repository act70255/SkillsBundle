# AutoQA Step Generate

## Scope
Handle Step 7 only.

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

## Skill-local resources
- Template sources: `<skills_root>/autoqa-workflow/templates/{TestPlan,TestCases,RequirementTraceability,TestScript,GenerationReview}.template.*`
