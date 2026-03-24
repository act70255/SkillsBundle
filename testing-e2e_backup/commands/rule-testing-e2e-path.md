---
description: E2E workflow 路徑規則（唯一來源）
---

# Path Rules: testing-e2e

本檔為 `workflow-testing-e2e` 與所有 `subworkflow-testing-e2e-*` 的路徑規則唯一來源。

規則：

1. `--artifact-dir` 只作為根目錄，不可直接落檔
2. 交接文件一律寫入：`--artifact-dir/workflow-handoff/`
3. 交付文件一律寫入：`--artifact-dir/workflow-deliverables/`
4. 交接文件檔名一律以 `[WORKFLOW]` 開頭

固定目錄：

- `handoffDir = --artifact-dir/workflow-handoff`
- `deliverablesDir = --artifact-dir/workflow-deliverables`

交接文件（handoffDir）：

- `[WORKFLOW]INPUT-SNAPSHOT.md`
- `[WORKFLOW]SPEC-BASELINE.md`
- `[WORKFLOW]SITE-BASELINE.md`
- `[WORKFLOW]SRC-SUPPLEMENT.md`（條件式）
- `[WORKFLOW]DOC-VALIDATION.md`
- `[WORKFLOW]SCRIPT-VALIDATION.md`
- `[WORKFLOW]RUN-REPORT.md`

交付文件（deliverablesDir）：

- `TEST-PLAN.md`
- `TEST-CASES.md`
- `ACCEPTANCE-CRITERIA.md`（條件式）
- `INPUT-GAP.md`（條件式）
- `TEST-SCRIPT-REPORT.md`
- `TEST-REPORT.md`（條件式：執行 workflow 完成後）
- `[TEST]BLOCKERS.md`（條件式：僅阻塞時）
- `.env.playwright.template`（條件式：`requiresSecrets=true` 且 `--secrets-file` 不存在）

資料欄位契約（必填最小欄位）：

- `[WORKFLOW]INPUT-SNAPSHOT.md`：`scope`、`siteUrl`、`testPath`、`artifactDir`、`inputFile`、`srcPath`、`secretsFile`、`scanDepth`、`maxRoutes`、`scanTimeoutSec`、`secretKeys`、`skipped`、`confirmed`
- `[WORKFLOW]SPEC-BASELINE.md`：`sourceFiles`、`acItems`、`taskItems`、`inferredAcIds`、`inferredTaskIds`、`securitySensitiveFlows`、`requiredSecretKeysHint`、`gaps`
- `[WORKFLOW]SITE-BASELINE.md`：`siteUrl`、`reachable`、`observedRoutes`、`navigationFindings`、`assertionTargets`、`authSignals`、`requiresSecrets`、`requiredSecretKeys`、`mcpUsed`、`mcpFallbackReason`、`risks`
- `[WORKFLOW]SRC-SUPPLEMENT.md`：`status`（`written|skipped`）、`reason`（skipped 時必填）、`srcPath`、`highRiskAreas`、`testabilityGaps`、`assertionHints`
- `[WORKFLOW]DOC-VALIDATION.md`：`result`、`requiredDocsStatus`、`traceCoverage`、`navigationCoverage`、`secretsReadiness`、`mismatches`
- `[WORKFLOW]SCRIPT-VALIDATION.md`：`result`、`caseScriptCoverage`、`navigationAssertionCoverage`、`locatorPolicyCheck`、`secretsPolicyCheck`、`envUsageCheck`、`hardcodedSecretCheck`、`executableCheck`
- `[WORKFLOW]RUN-REPORT.md`：`WorkflowType`、`CurrentState`、`FinalStatus`、`InputSnapshot`、`StageResults`、`BlockerType`、`NextAction`

欄位值域約束（建議遵循）：

- `[WORKFLOW]SITE-BASELINE.md.requiresSecrets`：`true | false | unknown`
- `[WORKFLOW]SITE-BASELINE.md.mcpUsed`：`true | false`
- `[WORKFLOW]DOC-VALIDATION.md.secretsReadiness`：`not-required | template-created | pending-user-input | ready | blocked`
- 當 `[WORKFLOW]SITE-BASELINE.md.requiresSecrets=true` 時，`requiredSecretKeys` 不可為空；若為空需標記 `BLOCKED(input-missing)`
- `[WORKFLOW]INPUT-SNAPSHOT.md.scanDepth|maxRoutes|scanTimeoutSec`：正整數（建議預設 `3|30|300`）

執行約束：

1. 不得只輸出對話摘要；所有結果必須寫入對應檔案
2. 子流程若未寫入其 `寫出檔案`，視為失敗（Blocked）
3. 任何交接/交付文件不得寫入 secrets 真值；僅可記錄變數鍵名與補件狀態

測試腳本（非 artifact 文件）：

- `--test-path`（預設 `testscripts/playwright`）
