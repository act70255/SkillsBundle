# AutoQA Step Docs + Login Decider

## Scope
- Step 3: docs baseline
- Step 5: requires-login decision

## Step 3 rules
- Before executing Step 3, check if earlier steps have unresolved BLOCKED; if yes, stop progression.
- Read docs from dev_docs_path
- Write DocsBaseline.md with:
  - feature/page inventory
  - roles/permissions
  - core/exception flows
  - business rules
  - test preconditions/data
  - observable UI/API clues
- Record contradictions as known risks/open questions
- If docs path/content is unavailable, first attempt self-check/remediation (path existence, file discovery, readable format checks) before proposing BLOCKED.

## Step 5 rules
- Before executing Step 5, check if earlier steps have unresolved BLOCKED; if yes, stop progression.
- Decide login requirement in this order:
  1) docs evidence
  2) src evidence
  3) lightweight browser probe
  4) ask user only if still ambiguous
- If requires login=false:
  - set Env Validation Status (Last Check): not_required
  - complete Step 5
- If requires login=true:
  - set Env Validation Status (Last Check): pending_auth_validation
  - keep Step 5 incomplete
  - do not ask for step-level continuation approval
  - hand over to step-auth-gate.md

## Skill-local resources
- Template source: `<skills_root>/autoqa-workflow/templates/DocsBaseline.template.md`
