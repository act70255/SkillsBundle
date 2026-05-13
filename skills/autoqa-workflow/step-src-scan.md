# AutoQA Step Source Scan

## Scope
Handle Step 4 only.

## Rules
- Before executing Step 4, check if earlier steps have unresolved BLOCKED; if yes, stop progression.
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
- SrcScanSummary.md must include machine-checkable sections and minimum evidence:
  - `Result Findings` (or `結果條列`) section with >=3 traceable findings (each finding must contain: `Finding-ID`, `Evidence`, `Impact`)
  - `Interaction Risks & Preconditions` (or `互動風險與前置條件`) section with >=3 high-risk interactions (each item must contain: `Risk-ID`, `Evidence`, `Recommended Wait Signal`)
  - `Docs Alignment` (or `與文件基線差異`) section summarizing matched/mismatched items against DocsBaseline
- If source scanning cannot proceed, first attempt self-check/remediation (path existence, readable files, basic repo/layout discovery). Only then classify BLOCKED when still unresolved.

## Quality gate (machine-checkable)
- `source_code_path=none`:
  - PASS when skipped reason is explicitly written in SrcScanSummary.md and Step 4 is marked complete.
- `source_code_path` provided:
  - FAIL if route/page mappings are missing.
  - FAIL if auth/permission or validation signals exist but are not summarized.
  - FAIL if `Result Findings`/`結果條列` has <3 items.
  - FAIL if `Interaction Risks & Preconditions`/`互動風險與前置條件` has <3 items.
  - FAIL if action contracts are missing for high-risk interactions.
- On FAIL after local remediation attempts, classify Step 4 as `BLOCKED` and write exact missing prerequisites/evidence.

## Output
- testing-artifact/handoff/SrcScanSummary.md
- RunReport checklist/status update

## Skill-local resources
- Template source: `<skills_root>/autoqa-workflow/templates/SrcScanSummary.template.md`
