---
description: E2E 總流程（input -> spec -> site -> docs -> script -> validate）
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, e2e-testing, playwright-skill, code-review-checklist, verification-before-completion`

路徑規則唯一來源：`testing-e2e/commands/rule-testing-e2e-path.md`

目標：

- 針對 $ARGUMENTS 執行 E2E 端到端測試資產產出流程（不執行測試閘）。
- 本流程僅負責規劃/產出/驗證測試資產；正式執行由 `/workflow-testing-e2e-execute-playwright` 負責。
- 以「參數傳遞 + 文件交接」作為 workflow/subworkflow 的唯一資料交換機制。
- 使用子流程依序完成：
  1. `subworkflow-testing-e2e-input-preflight`
  2. `subworkflow-testing-e2e-analyze-spec`
  3. `subworkflow-testing-e2e-analyze-site-playwright`
  4. `subworkflow-testing-e2e-analyze-src-supplement`（條件式：僅 `--src-path` 提供時）
  5. `subworkflow-testing-e2e-generate-documents`
  6. `subworkflow-testing-e2e-generate-scripts`
  7. `subworkflow-testing-e2e-validate-docs`
  8. `subworkflow-testing-e2e-validate-scripts`

建議輸入格式：

- `<測試範圍> --site-url <url> [--test-path <path>] [--artifact-dir <path>] [--input-file <path>] [--src-path <path>] [--secrets-file <path>] [--scan-depth <n>] [--max-routes <n>] [--scan-timeout-sec <n>]`
- `--site-url` 為必填；缺失時需停在 preflight 補件，不得進入分析/產出階段。
- 預設值：
  - `--test-path testscripts/playwright`
  - `--artifact-dir testing-artifacts/playwright`
  - `--secrets-file .env.playwright`
  - `--scan-depth 3`
  - `--max-routes 30`
  - `--scan-timeout-sec 300`

`--artifact-dir` 僅作為根目錄，不可直接落檔；所有輸出必須落在：

- `--artifact-dir/workflow-handoff/*`
- `--artifact-dir/workflow-deliverables/*`

產物目錄分流（強制）：

- 交接文件資料夾（內部）：`--artifact-dir/workflow-handoff`
- 交付文件資料夾（對外）：`--artifact-dir/workflow-deliverables`
- 子流程不得混寫根目錄；所有檔案必須寫入上述兩個資料夾之一

交接檔規範（內部文件，統一以 `[WORKFLOW]` 開頭，皆存放於 `workflow-handoff/`）：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
   - 最小欄位：`scope`、`siteUrl`、`testPath`、`artifactDir`、`inputFile`、`srcPath`、`secretsFile`、`scanDepth`、`maxRoutes`、`scanTimeoutSec`、`secretKeys`、`skipped`、`confirmed`
2. `--artifact-dir/workflow-handoff/[WORKFLOW]SPEC-BASELINE.md`
   - 最小欄位：`sourceFiles`、`acItems`、`taskItems`、`inferredAcIds`、`inferredTaskIds`、`securitySensitiveFlows`、`requiredSecretKeysHint`、`gaps`
3. `--artifact-dir/workflow-handoff/[WORKFLOW]SITE-BASELINE.md`
   - 最小欄位：`siteUrl`、`reachable`、`observedRoutes`、`navigationFindings`、`assertionTargets`、`authSignals`、`requiresSecrets`、`requiredSecretKeys`、`mcpUsed`、`mcpFallbackReason`、`risks`
4. `--artifact-dir/workflow-handoff/[WORKFLOW]SRC-SUPPLEMENT.md`（條件式）
   - 最小欄位：`status`（`written|skipped`）、`reason`（skipped 時必填）、`srcPath`、`highRiskAreas`、`testabilityGaps`、`assertionHints`
5. `--artifact-dir/workflow-handoff/[WORKFLOW]DOC-VALIDATION.md`
   - 最小欄位：`requiredDocsStatus`、`traceCoverage`、`navigationCoverage`、`secretsReadiness`、`mismatches`、`result`
6. `--artifact-dir/workflow-handoff/[WORKFLOW]SCRIPT-VALIDATION.md`
   - 最小欄位：`caseScriptCoverage`、`navigationAssertionCoverage`、`locatorPolicyCheck`、`secretsPolicyCheck`、`envUsageCheck`、`hardcodedSecretCheck`、`executableCheck`、`result`
7. `--artifact-dir/workflow-handoff/[WORKFLOW]RUN-REPORT.md`
   - 最小欄位：`WorkflowType`、`CurrentState`、`FinalStatus`、`InputSnapshot`、`StageResults`、`BlockerType`、`NextAction`

資料交換原則（強制）：

1. 子流程只可讀取「參數 + 上游交接檔 + 既定輸出文件」
2. 子流程完成後必須寫回對應 `[WORKFLOW]*` 交接檔
3. 主流程以交接檔狀態決定下一步，不可僅依對話文字判定
4. 不得以對話中的摘要取代落檔；各階段結論必須可在對應檔案中被檢索

執行原則（Scout Lite 對齊）：

1. Evidence First：每階段必須輸出可驗證產物
2. Investigate Before Asking：先完成可自查項再向使用者補件
3. No Idle：若阻塞，輸出 blocker 與建議預設，不可空轉
4. Fail-Fast：禁止重複等價嘗試；需有新資訊才可重試

執行順序（強制）：

1. 先執行 `subworkflow-testing-e2e-input-preflight`，未確認最終參數不得進下一步
2. 再執行 `subworkflow-testing-e2e-analyze-spec`、`subworkflow-testing-e2e-analyze-site-playwright`
   - `subworkflow-testing-e2e-analyze-site-playwright` 需優先使用 Playwright MCP；不可用時需記錄 fallback 原因
3. 若提供 `--src-path`，執行 `subworkflow-testing-e2e-analyze-src-supplement`；未提供則標記 skipped
4. 以上游分析輸出作為輸入，先合併 `SPEC/SITE` 的 secrets 判定（`requiresSecrets` + `requiredSecretKeys`）
5. 若 `requiresSecrets=unknown`，立即標記 `BLOCKED(input-missing)`，要求補件後重跑分析（不得直接進文件/腳本階段）
6. 若 `requiresSecrets=true`，先檢查 `--secrets-file`：
   - `requiredSecretKeys` 不可為空；若為空，標記 `BLOCKED(input-missing)` 並向使用者補件確認
   - 檔案不存在：由 `subworkflow-testing-e2e-generate-documents` 負責建立 `.env.playwright.template` 並提醒使用者填值
   - 檔案存在但必要鍵空值：標記 `BLOCKED(environment)`，不得進入腳本驗證通過
   - 樣板產生後需提示使用者：將值填入 `--secrets-file` 指定檔案，完成後自 `subworkflow-testing-e2e-generate-scripts` 續跑
7. 執行 `subworkflow-testing-e2e-generate-documents`
8. 文件完成且確認後，執行 `subworkflow-testing-e2e-generate-scripts`
9. 依序執行 `subworkflow-testing-e2e-validate-docs`、`subworkflow-testing-e2e-validate-scripts`
10. 任一步失敗即停止並輸出阻塞資訊，不得跳步

強制產物：

1. `--artifact-dir/workflow-deliverables/TEST-PLAN.md`
2. `--artifact-dir/workflow-deliverables/TEST-CASES.md`
3. `--artifact-dir/workflow-deliverables/ACCEPTANCE-CRITERIA.md`（條件式；缺失時允許由 inferred AC 追溯）
4. `--artifact-dir/workflow-deliverables/INPUT-GAP.md`（條件式）
5. Playwright 腳本（`testscripts/playwright/` 或 `--test-path`）
6. `--artifact-dir/workflow-deliverables/TEST-SCRIPT-REPORT.md`
7. `--artifact-dir/workflow-deliverables/.env.playwright.template`（條件式：`requiresSecrets=true` 且 `--secrets-file` 不存在）
8. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
9. `--artifact-dir/workflow-handoff/[WORKFLOW]SPEC-BASELINE.md`
10. `--artifact-dir/workflow-handoff/[WORKFLOW]SITE-BASELINE.md`
11. `--artifact-dir/workflow-handoff/[WORKFLOW]SRC-SUPPLEMENT.md`（條件式）
12. `--artifact-dir/workflow-handoff/[WORKFLOW]DOC-VALIDATION.md`
13. `--artifact-dir/workflow-handoff/[WORKFLOW]SCRIPT-VALIDATION.md`
14. `--artifact-dir/workflow-handoff/[WORKFLOW]RUN-REPORT.md`

`[WORKFLOW]RUN-REPORT.md` 建議欄位：

- `WorkflowType`: `e2e`
- `CurrentState`: `PRECHECK | SPEC_DONE | SITE_DONE | SRC_DONE | DOCS_DONE | SCRIPT_DONE | VALIDATED | EXECUTED | BLOCKED`
- `FinalStatus`: `Pass | Fail | Blocked`
- `InputSnapshot`: `scope/siteUrl/testPath/artifactDir/inputFile/srcPath/secretsFile/scanDepth/maxRoutes/scanTimeoutSec/secretKeys/skipped`
- `StageResults`: 8 個子流程（含條件式 src 補強）的 `status/artifacts/keyNotes`
- `BlockerType`（若有）: `spec | implementation | environment | test-asset | input-missing`
- `NextAction`: 單一下一步命令或補件指示（例如 `/workflow-testing-e2e-execute-playwright`；或 `填寫 --secrets-file -> 重跑 subworkflow-testing-e2e-generate-scripts -> subworkflow-testing-e2e-validate-docs -> subworkflow-testing-e2e-validate-scripts`）
