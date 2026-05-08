# AutoQA Step Source Scan

## Scope
Handle Step 4 only.

## Rules
- Before executing Step 4, check if earlier steps have unresolved BLOCKED; if yes, pause and confirm with user.
- If source_code_path=none: record skipped with reason and still mark Step 4 complete
- If provided, extract:
  - route/page mappings
  - auth/permission logic
  - validation rules
  - core branch/error handling
  - test data clues
  - automation candidates
- Also write action contracts for high-risk interactions:
  - trigger type
  - interactability preconditions
  - stable selectors
  - expected success signal
- If source scanning cannot proceed, first attempt self-check/remediation (path existence, readable files, basic repo/layout discovery). Only then classify BLOCKED when still unresolved.

## Output
- testing-artifact/handoff/SrcScanSummary.md
- RunReport checklist/status update

## Skill-local resources
- Template source: `<skills_root>/autoqa-workflow/templates/SrcScanSummary.template.md`
