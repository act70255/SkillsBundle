# AutoQA Step Auth Gate

## Scope
Only callable from Step 5 or Step 8 when Requires Login=true.

## Fixed order
0. Check unresolved BLOCKED from prior steps; if exists, stop progression.
1. Ensure credential file exists:
   - testing-artifact/deliverables/.env.playwright
2. Ensure loader exists:
   - testing-artifact/scripts/playwright-env-loader.cjs
3. Validate required keys with loader metadata using:
   - node -r testing-artifact/scripts/playwright-env-loader.cjs ...
4. If keys complete, run login availability check using same loader path

## Self-remediation first
- Before concluding BLOCKED, first attempt safe local remediation:
  - verify file/path existence and expected location
  - verify node/npm runtime availability
  - bootstrap dependencies when missing (e.g. npm install) if project-local and safe
 - If still unresolved, write BLOCKED directly with blocking issue and next action.

## Secret-missing handling (requires human intervention)
- When login is required and `.env.playwright` is missing or required secret keys are empty/missing:
  1. Create `testing-artifact/deliverables/.env.playwright` from template if file does not exist.
  2. Do not fabricate or auto-fill secret values.
  3. Mark status as BLOCKED (human input required).
  4. Ask user to fill secret values and reply when done.
  5. After user fills secrets, rerun env validation and continue.

## Security rule
- Never print secret values from .env.playwright
- Only report key names and validation status

## RunReport writeback
- Env Loaded Keys (Last Check)
- Env Missing Required Keys (Last Check)
- Env Validation Status (Last Check)

## Failure handling
- missing key -> write BLOCKED with missing key names and required user action
- key complete but login unavailable -> write BLOCKED as credential/permission/auth-flow issue
- preserve caller step ownership (stay Step 5 or Step 8); never auto-advance step index

## Skill-local resources
- Loader/env template source: `<skills_root>/autoqa-workflow/templates/.env.playwright.template` and `<skills_root>/autoqa-workflow/templates/PlaywrightEnvLoader.template.cjs`
