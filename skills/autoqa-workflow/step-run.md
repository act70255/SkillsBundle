# AutoQA Step Run

## Scope
Handle Step 8 only.

## Preconditions
- Step 7 complete
- TestScript.ts exists
- if login required: auth gate must pass in same step

## Execution rules
- Must apply precondition gate per case: ready/blocked_by_precondition
- blocked_by_precondition must be BLOCKED (not FAIL)
- Keep canonical raw output at:
  - testing-artifact/handoff/ExecutionRaw.json
- Write human summary at:
  - testing-artifact/handoff/ExecutionSummary.md

## Non-functional baseline (required)
- console error/warn summary
- main flow interaction latency notes
- weak-network/offline degradation behavior when spec-defined

## Skill-local resources
- Template source: `<skills_root>/autoqa-workflow/templates/ExecutionSummary.template.md`
