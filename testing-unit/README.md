# testing-unit

此目錄提供一套以 OpenCode custom commands 為核心的固定式 unit testing workflow，目標是把「輸入補件」、「技術棧判定」、「測試腳本產生」、「測試執行」與「報告彙整」拆成可續跑、可阻塞、可追蹤的流程。

注意：`testing-unit/commands/`、`testing-unit/template/` 與 `testing-unit/scripts/` 是開發規格來源；runtime 版本對應到 `.opencode/commands/` 與 `.opencode/template/testing-unit/`。

## 目標

- 以固定步驟推進，不依賴臨場發揮。
- 以 `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` 作為 runtime 唯一狀態來源。
- 缺少必要資訊時，先互動補齊；仍不足則標記 `BLOCKED` 並停止。
- 將文件分析、原始碼分析、技術棧歸類、測試腳本、執行摘要與最終報告串成可追溯鏈條。

## 目錄角色

- `testing-unit/commands/`: workflow command 規格與流程約束。
- `testing-unit/template/`: handoff 與 deliverable 模板來源。
- `testing-unit/scripts/`: workflow 規格驗證腳本。

## 固定流程

| Step | 目的 | 核心輸出 |
| --- | --- | --- |
| 0 | 檢查 `WORKFLOW-RUN-REPORT.md` 狀態 | `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` |
| 1 | 檢查輸入資訊 | 缺漏清單 |
| 2 | 與使用者問答補充輸入資訊 | `testing-artifacts/unit/INPUT-SUMMARY.md` |
| 3 | 分析文件與原始碼 | `testing-artifacts/unit/SOURCE-BASELINE.md` |
| 4 | 歸類技術棧與 runner 路由 | `testing-artifacts/unit/STACK-CLASSIFICATION.md` |
| 5 | 依路由產出測試腳本 | `testscripts/vitest/`、`testscripts/jest/`、`testing-artifacts/unit/TEST-SCRIPT-REPORT.md` |
| 6 | 依路由執行測試 | `testing-artifacts/unit/EXECUTION-SUMMARY.md` |
| 7 | 產出最終報告 | `testing-artifacts/unit/TEST-REPORT.md` |

## 狀態與狀態機

### Workflow Status

- `NEW`: 新工作，尚未開始。
- `IN_PROGRESS`: 已開始，仍有未完成步驟。
- `BLOCKED`: 缺少必要資訊、環境或資產，需停止等待補件。
- `DONE`: 全部完成。
- `FAILED`: 發生錯誤且未能完成。

### Current State

- `PRECHECK`: 輸入補件中。
- `ANALYZED`: 文件與原始碼分析完成。
- `CLASSIFIED`: 技術棧歸類完成。
- `SCRIPT_DONE`: 測試腳本產生完成。
- `EXEC_DONE`: 測試執行完成。
- `BLOCKED`: 任一步驟阻塞。

## 輸入規則

### 必填

- `scope`: 測試範圍（功能、模組或路徑）。

### 選填

- `src_path`: 預設 `src`；若不存在改用工作區根目錄。
- `artifact_dir`: 預設 `testing-artifacts/unit`。
- `test_path_vitest`: 預設 `testscripts/vitest`。
- `test_path_jest`: 預設 `testscripts/jest`。
- `preferred_runner`: `auto | vitest | jest | hybrid`，預設 `auto`。
- `package_manager`: `auto | npm | pnpm | yarn`，預設 `auto`。
- `site_url`: 站台 URL（僅作為行為對照線索，非 unit 必填）。
- `dev_docs_path`: 規格文件路徑（若有）。

### 輸入確認規則

- Step 2 補齊輸入時必須採用一問一答；一次只問一個欄位。
- 先確認 `scope`，再確認是否調整選填欄位。
- 若使用者不調整選填欄位，必須一次寫入全部預設值。
- Step 2 完成前，`INPUT-SUMMARY.md` 不可保留意義不明空白欄位。

## Fail-fast 與路由

- `TEST-PLAN.md`、`TEST-CASES.md`、`ACCEPTANCE-CRITERIA.md` 任一缺失，不得進入 Step 5。
- `STACK-CLASSIFICATION.md` 無法判定 runner 時，狀態必須轉為 `BLOCKED`。
- Step 5 產生不到可執行測試檔時，不得進入 Step 6。
- Step 6 任一 runner 失敗時，可標記 `FAILED` 或 `BLOCKED`，但不得假設 Step 7 結果。

## 建議使用方式

1. 執行 `/workflow-testing-unit`。
2. 若流程停在 `BLOCKED`，先依 `WORKFLOW-RUN-REPORT.md` 補件。
3. 補件後再次執行 `/workflow-testing-unit`，流程會從第一個未完成步驟續跑。

## 指令設計

| 指令 | 範圍 | 用途 |
| --- | --- | --- |
| `/workflow-testing-unit` | Step 0-7 | 唯一主控入口；初始化或續跑 |
| `/subworkflow-unit-input` | Step 1-2 | 輸入檢查、補齊缺漏 |
| `/subworkflow-unit-analyze` | Step 3 | 文件與原始碼分析 |
| `/subworkflow-unit-classify` | Step 4 | 技術棧與 runner 路由決策 |
| `/subworkflow-unit-genscript` | Step 5 | 腳本產生分派器 |
| `/subworkflow-unit-genscript-vitest` | Step 5 | 產生 Vitest 腳本 |
| `/subworkflow-unit-genscript-jest` | Step 5 | 產生 Jest 腳本 |
| `/subworkflow-unit-execute` | Step 6 | 測試執行分派器 |
| `/subworkflow-unit-execute-vitest` | Step 6 | 執行 Vitest |
| `/subworkflow-unit-execute-jest` | Step 6 | 執行 Jest |
| `/subworkflow-unit-report` | Step 7 | 彙整最終報告 |

## 規格驗證

- 開發規格驗證：`node testing-unit/scripts/verify-workflow-dev.mjs`
- runtime 版本驗證：`node testing-unit/scripts/verify-workflow.mjs`
- 開發期同步驗證：`node testing-unit/scripts/verify-workflow-sync.mjs`

## 設計原則

- `README.md` 負責說明規則與架構。
- `commands/*.md` 負責固定 prompt 流程與最低品質門檻。
- `template/*.md` 負責限制 handoff 與報告欄位完整度。
- `WORKFLOW-RUN-REPORT.md` 負責 runtime 狀態持久化與步驟交接。
