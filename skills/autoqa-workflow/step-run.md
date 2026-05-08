# AutoQA Step Run

## Scope
Handle Step 8 only.

## Preconditions
- Step 7 complete
- TestScript.ts exists
- if login required: auth gate must pass in same step
- Before executing Step 8, check if earlier steps have unresolved BLOCKED; if yes, pause and confirm with user.
- If execution cannot proceed, first attempt self-check/remediation (script/file existence, node/npm/playwright availability, dependency install/bootstrap) before classifying BLOCKED.

## Execution rules
- Must apply precondition gate per case: ready/blocked_by_precondition
- blocked_by_precondition must be BLOCKED (not FAIL)
- before finalizing BLOCKED classification in output/report, pause and confirm with user
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
