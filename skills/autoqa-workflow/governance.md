# AutoQA Governance Core

> Source of truth: autoqa-governance-core/SKILL.md — keep in sync when updating standalone skill.

## Non-negotiable rules
1. Status semantics lock:
   - PASS = preconditions satisfied + behavior matches spec
   - FAIL = preconditions satisfied + behavior mismatches spec
   - BLOCKED = preconditions missing or dependency unavailable
   - SKIPPED = intentionally not executed

2. Precondition gate (before Step 8 execution):
   - Each case must have `precondition_status = ready | blocked_by_precondition`
   - `blocked_by_precondition` MUST be reported as BLOCKED, never FAIL

3. Self-remediation-first BLOCK policy:
   - Before writing BLOCKED, agent must try safe, local checks/remediation first.
   - Examples: search/config checks, file existence checks, runtime/package checks, dependency bootstrap/install.
   - Only if unresolved after reasonable self-remediation attempts may status become BLOCKED.

4. Inter-step BLOCK stop policy:
   - Before entering each step, verify whether previous steps contain unresolved BLOCKED items.
   - If yes, pause and confirm with user before proceeding.

5. Spec-first policy:
   - Documentation/spec is oracle by default
   - If implementation conflicts and cannot be resolved, mark `SPEC_GAP`
   - Never auto-PASS unresolved conflicts

6. RTM mandatory:
   - Requirement/Doc Anchor -> Case ID
   - Case ID -> Requirement/Doc Anchor
   - Coverage state: covered / partial / not-covered

7. DONE evidence gate (all required):
   - testing-artifact/handoff/ExecutionRaw.json
   - testing-artifact/handoff/ExecutionSummary.md
   - testing-artifact/deliverables/TestReport.md
   - testing-artifact/deliverables/RequirementTraceability.md
   - metadata in report/run context:
     - target URL
     - env key-level validation status
     - test data identifier
     - app version/commit

## Required report sections
- Summary with PASS/FAIL/BLOCKED/SKIPPED counts
- Case-by-case result table
- RTM coverage summary (covered/partial/not-covered)
- Not-covered scope
- Residual risks + recommendations

## Forbidden anti-patterns
- Reclassifying BLOCKED to FAIL for "completion"
- Claiming full validation when not-covered requirements exist
- Missing evidence links/paths
- Passing cases with unresolved spec conflicts

## Standardization scope
- This governance is project-agnostic and reusable across services.
- Project profiles may configure inputs/data, but may not override governance semantics.
