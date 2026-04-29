# AutoQA Step Input Gate

## Scope
Handle Step 1-2 only.

## Inputs
Required:
- target_url
- dev_docs_path

Optional:
- source_code_path (default: none)
- playwright_max_depth (default: 3)
- playwright_max_pages (default: 20)
- playwright_headless (default: true)

## Process
1. Read RunReport.md
2. Ensure InputSummary.md exists from template
3. Validate required fields
4. If required missing, ask one question at a time
5. Resolve optional fields explicitly (value or default marker)
6. Write InputSummary.md and RunReport updates

## Exit criteria
- All required fields populated
- Optional fields resolved with explicit value/default status
- Step 1 and Step 2 checklist checked

## Skill-local resources
- Template source: `<skills_root>/autoqa-workflow/templates/InputSummary.template.md`
