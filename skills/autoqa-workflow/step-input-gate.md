# AutoQA Step Input Gate

## Scope
Handle Step 1-2 only.

## Inputs
Required:
- target_url
- dev_docs_path (must confirm with user)

Optional:
- source_code_path (must confirm with user before marking as none/skip)
- playwright_max_depth (default: 3)
- playwright_max_pages (default: 20)
- playwright_headless (default: true)

## Process
1. Read RunReport.md
2. If any previous step is BLOCKED, pause and confirm with user before continuing
3. Ensure InputSummary.md exists from template
4. Validate required fields
5. For `dev_docs_path`, always ask user to confirm the concrete docs path for this run.
   - If path is missing or invalid, attempt safe discovery/self-check first, then ask user to confirm the final path.
6. If required missing, ask one question at a time
7. Resolve optional fields explicitly (value or default marker)
8. For `source_code_path`, always ask user to confirm one of:
   - provide a concrete path
   - explicitly skip source scan for this run
   Do not auto-fill `none (default)` without user confirmation.
9. For any missing/unavailable input, try self-check first (e.g. path existence, docs/source discovery) before proposing BLOCKED
10. Write InputSummary.md and RunReport updates

## Exit criteria
- All required fields populated
- Optional fields resolved with explicit value/default status
- Step 1 and Step 2 checklist checked

## Skill-local resources
- Template source: `<skills_root>/autoqa-workflow/templates/InputSummary.template.md`
