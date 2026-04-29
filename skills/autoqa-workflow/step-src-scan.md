# AutoQA Step Source Scan

## Scope
Handle Step 4 only.

## Rules
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

## Output
- testing-artifact/handoff/SrcScanSummary.md
- RunReport checklist/status update

## Skill-local resources
- Template source: `<skills_root>/autoqa-workflow/templates/SrcScanSummary.template.md`
