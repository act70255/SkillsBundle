# AutoQA Step Report

## Scope
Handle Step 9 only.

## Execution guard
- Before executing Step 9, check if earlier steps have unresolved BLOCKED; if yes, pause and confirm with user.
- If report finalization is blocked by missing evidence, first attempt self-check/remediation (artifact existence check, path correction, regenerate missing summaries if recoverable) before classifying BLOCKED.

## Inputs
- RunReport.md
- ExecutionSummary.md
- ExecutionRaw.json
- TestPlan.md
- TestCases.md
- RequirementTraceability.md

## Output
- testing-artifact/deliverables/TestReport.md

## Mandatory report content
- overall verdict and PASS/FAIL/BLOCKED/SKIPPED counts
- per-case result table (case id, status, assertions, failure reason, evidence)
- RTM summary: covered/partial/not-covered
- uncovered/blocked scope details
- residual risk + recommendations

## DONE gate
Set workflow DONE only if all required evidence artifacts exist and are linked.

## Skill-local resources
- Template source: `<skills_root>/autoqa-workflow/templates/TestReport.template.md`
