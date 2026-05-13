---
name: autoqa-workflow
description: Standard, complete, portable, reusable governed testing workflow core (Step 0~9) for cross-project service testing.
---

# AutoQA Workflow Core 0~9

## Positioning
This is the canonical process core for governed testing across different service projects. Self-contained bundle — no companion skills required.

## Recommended startup instruction
Use this exact startup phrase to avoid missing context:
`請載入 autoqa-workflow，並執行完整 Step 0~9。`

## Canonical step flow
- Step 0: testing-artifact/handoff/RunReport.md state check/init
- Step 1: Input validation
- Step 2: Input completion Q&A
- Step 3: Docs baseline
- Step 4: Source scan (or skipped)
- Step 5: Login requirement decision + auth gate if needed
- Step 6: Site scan
- Step 7: Generate TestPlan/TestCases/TestScript/RTM
- Step 8: Execute tests + precondition gate + non-functional baseline
- Step 9: Final report + DONE gate

## Controller contract (strict)
- Step order is fixed: `0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9`.
- Step 0 is mandatory entry. Do not execute downstream steps before Step 0 state check/init.
- testing-artifact/handoff/RunReport.md is the single source of truth for workflow state and resume.
- Resume from the first incomplete checklist step. Never reset completed steps.
- If a step succeeds and status is not `BLOCKED`/`FAILED`/`DONE`, controller must move to next step immediately.
- Do not request `continue` or any manual approval between normal steps.

### Legal stop points (only)
- Step 2 one-question-at-a-time input completion in progress
- Step 5 login requirement remains ambiguous after docs/src/probe
- Step 5/8 auth gate requires human secrets or permission action
- any step enters `BLOCKED`
- any step enters `FAILED`
- workflow reaches `DONE`

Outside legal stop points, workflow must auto-advance.

## Pipeline overview (治理流程總覽)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                      AUTOQA GOVERNED TEST PIPELINE                          │
│                                                                              │
│  Phase 0: Run Bootstrap (Step 0)                                             │
│    - init/check RunReport state                                              │
│                 │                                                            │
│                 ▼                                                            │
│  Phase 1: Input Gate (Step 1-2)                                              │
│    - input validation + one-question-at-a-time completion                    │
│                 │                                                            │
│                 ▼                                                            │
│  Phase 2: Baseline & Scope (Step 3-4)                                        │
│    - docs baseline, source scan (optional)                                   │
│                 │                                                            │
│                 ▼                                                            │
│  Phase 3: Auth Decision Gate (Step 5)                                        │
│    - decide login needed? run auth gate if needed                            │
│                 │                                                            │
│                 ▼                                                            │
│  Phase 4: Site Discovery (Step 6)                                            │
│    - site scan + compatibility/a11y mini-sweep                               │
│                 │                                                            │
│                 ▼                                                            │
│  Phase 5: Artifact Generation (Step 7)                                       │
│    - TestPlan / TestCases / TestScript / RTM                                 │
│                 │                                                            │
│                 ▼                                                            │
│  Phase 6: Execution Gate & Run (Step 8)                                      │
│    - precondition=ready => execute                                           │
│    - blocked_by_precondition => classify BLOCKED (not FAIL)                  │
│                 │                                                            │
│                 ▼                                                            │
│  Phase 7: Reporting & DONE Gate (Step 9)                                     │
│    - ExecutionRaw + ExecutionSummary + TestReport + RTM required             │
│    - evidence complete => DONE; else remain BLOCKED/IN_PROGRESS              │
│                                                                              │
│  Resume Rule: restart from last incomplete legal step in RunReport          │
│  Semantics Lock: PASS / FAIL / BLOCKED / SKIPPED                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Pipeline gate policy
- Entry gate:
  - Step 0 must initialize or validate `testing-artifact/handoff/RunReport.md` before any downstream step.
- Inter-step BLOCK gate:
  - Before starting each next step, check whether any prior step is currently `BLOCKED`.
  - If any `BLOCKED` exists, stop and keep current state until blocking issue is resolved.
- Self-remediation first:
  - Before marking a step/case as `BLOCKED`, first attempt local self-check/remediation when safe.
  - Typical checks include path/content checks (e.g. grep/file existence), runtime/tooling checks (e.g. npm/node), and dependency install/bootstrap (e.g. npm install).
  - Only mark `BLOCKED` when self-remediation cannot resolve the issue, then write blocking issue and next action directly.
- Execution gate:
  - Step 8 can run only when case precondition status is `ready`.
  - If `blocked_by_precondition`, case result must be `BLOCKED` (never relabel as `FAIL`).
- Done gate:
  - Step 9 can finalize `DONE` only when required evidence set is complete:
    - `ExecutionRaw.json`
    - `ExecutionSummary.md`
    - `TestReport.md`
    - `RequirementTraceability.md`

### Pipeline artifact contract (phase-aligned)
- Phase 0-2: RunReport + baseline inputs/scan summaries.
- Phase 5: generated governed artifacts (TestPlan, TestCases, TestScript, RTM).
- Phase 6-7: execution outputs and final governed report package.

## Dispatch mapping
- Step 1-2 -> [step-input-gate.md](step-input-gate.md)
- Step 3/5 -> [step-docs-login-decider.md](step-docs-login-decider.md)
- Step 4 -> [step-src-scan.md](step-src-scan.md)
- Step 5/8 helper -> [step-auth-gate.md](step-auth-gate.md)
- Step 6 -> [step-site-scan.md](step-site-scan.md)
- Step 7 -> [step-generate.md](step-generate.md)
- Step 8 -> [step-run.md](step-run.md)
- Step 9 -> [step-report.md](step-report.md)

## State machine
NEW / IN_PROGRESS / BLOCKED / DONE / FAILED

## Bundle contents
- governance.md : governance semantics and rules (sourced from autoqa-governance-core)
- project-profile-autoqa.md : AutoQA project-specific defaults (sourced from autoqa-project-profile-autoqa)
- step-input-gate.md : Step 1-2 input validation
- step-docs-login-decider.md : Step 3/5 docs baseline + login decision
- step-src-scan.md : Step 4 source scan
- step-auth-gate.md : Step 5/8 auth helper
- step-site-scan.md : Step 6 site scan
- step-generate.md : Step 7 artifact generation
- step-run.md : Step 8 test execution
- step-report.md : Step 9 final report
- templates/* : canonical artifact templates
- scripts/verify-skill-bundle.mjs : bundle integrity check
- scripts/verify-workflow-skills.mjs : skill-level rule check
- references/architecture.md : architecture notes

Optional compatibility check (non-blocking):
- scripts/verify-workflow-pure-skills.mjs : command-wrapper compatibility only

## Template source of truth
Use templates from this skill directory first:
`<skills_root>/autoqa-workflow/templates/`

Portable rule:
- Resolve templates/scripts/references from `<skills_root>/autoqa-workflow/`.
- Do not assume any repo-specific compatibility path.

## Integration contract
- governance semantics are locked by governance.md
- project-specific differences must stay in project-profile-autoqa.md only
- step instructions may not redefine PASS/FAIL/BLOCKED/SKIPPED semantics
