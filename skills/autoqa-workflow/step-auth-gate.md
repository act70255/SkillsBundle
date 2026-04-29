# AutoQA Step Auth Gate

## Scope
Only callable from Step 5 or Step 8 when Requires Login=true.

## Fixed order
1. Ensure credential file exists:
   - testing-artifact/deliverables/.env.playwright
2. Ensure loader exists:
   - testing-artifact/scripts/playwright-env-loader.cjs
3. Validate required keys with loader metadata using:
   - node -r testing-artifact/scripts/playwright-env-loader.cjs ...
4. If keys complete, run login availability check using same loader path

## Security rule
- Never print secret values from .env.playwright
- Only report key names and validation status

## RunReport writeback
- Env Loaded Keys (Last Check)
- Env Missing Required Keys (Last Check)
- Env Validation Status (Last Check)

## Failure handling
- missing key -> BLOCKED with missing key names
- key complete but login unavailable -> BLOCKED as credential/permission/auth-flow issue
- preserve caller step ownership (stay Step 5 or Step 8)

## Skill-local resources
- Loader/env template source: `<skills_root>/autoqa-workflow/templates/.env.playwright.template` and `<skills_root>/autoqa-workflow/templates/PlaywrightEnvLoader.template.cjs`
