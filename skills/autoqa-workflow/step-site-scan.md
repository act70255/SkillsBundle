# AutoQA Step Site Scan

## Scope
Handle Step 6 only.

## Inputs
- DocsBaseline.md
- SrcScanSummary.md
- target_url

## Execution guard
- Before executing Step 6, check if earlier steps have unresolved BLOCKED; if yes, pause and confirm with user.
- If site scan cannot proceed, first attempt self-check/remediation (target reachability, basic browser/runtime checks, auth loader readiness when required). Only then classify BLOCKED.

## Required outputs
- SiteScanSummary.md must include:
  - page-by-page records
  - doc match/mismatch
  - automation candidates
  - interaction preflight risks and wait strategy
  - compatibility/a11y mini-sweep (>=2 viewports)

## Login handling
If login is required, use validated loader/auth path from Step 5.

## Skill-local resources
- Template source: `<skills_root>/autoqa-workflow/templates/SiteScanSummary.template.md`
