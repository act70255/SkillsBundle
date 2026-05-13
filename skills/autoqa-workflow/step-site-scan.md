# AutoQA Step Site Scan

## Scope
Handle Step 6 only.

## Inputs
- DocsBaseline.md
- SrcScanSummary.md
- target_url

## Execution guard
- Before executing Step 6, check if earlier steps have unresolved BLOCKED; if yes, stop progression.
- If site scan cannot proceed, first attempt self-check/remediation (target reachability, basic browser/runtime checks, auth loader readiness when required). Only then classify BLOCKED.

## Required outputs
- SiteScanSummary.md must include:
  - page-by-page records
  - doc match/mismatch
  - automation candidates
  - interaction preflight risks and wait strategy
  - compatibility/a11y mini-sweep (>=2 viewports)
- Page-by-page records must include at least:
  - `Page ID`, `Page Name`, `URL/Route`, `Reachability`, `Auth/Role`, `Entry Path`, `Key UI/Action`, `Doc Match`, `Automation Candidate`, `Notes/Risk`
- `Interaction Preflight` (or `互動前置檢查結果`) section must include >=3 high-risk interactions.
  - Each item must include: `Interaction-ID`, `Trigger`, `Precondition`, `Blocking Factor`, `Success Signal`, `Recommended Wait Strategy`, `Suggested Selector`.

## Login handling
If login is required, use validated loader/auth path from Step 5.

## Quality gate (machine-checkable)
- FAIL if no page-by-page records are produced.
- FAIL if required page record fields are missing.
- FAIL if interaction preflight (`Interaction Preflight` / `互動前置檢查結果`) high-risk items <3.
- FAIL if doc mismatch findings are not recorded when contradictions are observed.
- FAIL if compatibility/a11y mini-sweep does not cover >=2 viewports.
- On FAIL after local remediation attempts, classify Step 6 as `BLOCKED` and write exact blocker and next action.

## Skill-local resources
- Template source: `<skills_root>/autoqa-workflow/templates/SiteScanSummary.template.md`
