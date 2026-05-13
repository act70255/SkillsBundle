# Step 8 - 執行測試

## Scope
只處理 Step 8。

## Path convention
- 本文件提及的檔名皆指 `testing-artifact/` 目錄樹下的標準路徑（例如 `testing-artifact/evidence/ExecutionRaw.log`、`testing-artifact/evidence/test-report-html/index.html`、`testing-artifact/evidence/coverage-html/index.html`）。

## Entry Gate
- 必須確認 `RunReport.md` 中 `Script Generation Gate = passed`，才可執行測試
- 若 `Script Generation Gate ≠ passed`，不得執行 Step 8；應回退到 Step 7 修正腳本
- 若 `Script Generation Gate = failed`，`Current Step` 應停留在 Step 7，不得進入 Step 8

## Process
1. 確認 `RunReport.md` 中 `Script Generation Gate = passed`
2. 確認前置條件（以下全部需成立）：
   - `Test Env Status = passed`（package.json、test runner、node_modules 已就緒；由 Step 1 自動偵測與初始化）
   - `Script Generation Gate = passed`
   - 測試方法符合 unit test 執行規範（被測程式由 `import`/`require` 載入；非 `eval`/字串執行）
3. 若前置條件不成立，設定 `Execution Gate = blocked`，將 `Status = BLOCKED`，在 `阻塞問題` 記錄缺失的前置條件（如 `Test Env Status ≠ passed`）
4. 若前置條件不成立，設定 `Execution Raw Status = not_applicable`
5. 若前置條件不成立，設定 `Test Result HTML Report Status = not_applicable` 與 `Coverage HTML Report Status = not_applicable`
6. 若前置條件不成立，產出 `ExecutionSummary.md`，明確記錄 `BLOCKED` 原因
7. 若前置條件不成立，產出 `CoverageSummary.md`，明確記錄 `not_applicable`
8. 僅在前置條件成立時，執行測試腳本與 coverage
9. 僅在前置條件成立時，保存原始輸出證據為標準路徑 `ExecutionRaw.log`；若工具輸出其他檔名，需複製、重新命名或明確正規化到此路徑
10. 僅在前置條件成立時，產出測試結果 HTML 報告至標準路徑 `test-report-html/index.html`；若 runner 原生輸出其他檔名或目錄，需複製、重新命名或明確正規化到此路徑
11. 僅在前置條件成立時，產出 coverage HTML 報告至標準路徑 `coverage-html/index.html`；若工具輸出其他檔名或目錄，需複製、重新命名或明確正規化到此路徑
12. 若任一必要 HTML 報告無法合法產出（例如 runner / reporter 不支援且無可行轉換機制），設定 `Execution Gate = blocked`，將 `Status = BLOCKED`，在 `阻塞問題` 記錄原因；未成功產出的 HTML 報告狀態維持 `pending`，不得視為完成
13. 僅在 `ExecutionRaw.log`、`test-report-html/index.html`、`coverage-html/index.html` 皆已合法產出時，於 `RunReport.md` 記錄 `Execution Raw Status = generated`、`Test Result HTML Report Status = generated`、`Coverage HTML Report Status = generated`
14. 僅在前置條件成立且必要 HTML 報告已合法產出時，產出 `ExecutionSummary.md` 與 `CoverageSummary.md`
15. 執行 Coverage Zero Gate（機器可判定）：若 `Coverage Status = measured` 且 `Statements`、`Branches`、`Functions`、`Lines` 四項皆為 `0%`，設定 `Execution Gate = passed` 不成立，並將 `Status = FAILED`（不是 `BLOCKED`）；同時在 `testing-artifact/handoff/CoverageSummary.md` 與 `testing-artifact/handoff/ExecutionSummary.md` 記錄 root cause 與 next action
16. 執行 Per-file Coverage Gate（機器可判定）：對每個 in-scope 業務 JS，若 `Statements = 0%` 且 `Branches = 0%`，判定為未覆蓋，必須寫入 `testing-artifact/handoff/CoverageSummary.md` 的 `Uncovered Business Files`；若存在任一未覆蓋檔案，`Status = FAILED`
17. 自動修復導向續跑（Auto Repair Loop）：
   - 觸發條件：`Status = FAILED`，且 `Auto Repair Enabled = true`，且 `Auto Repair Attempt < Auto Repair Max Attempts`
   - 只處理可內部修復失敗：`assertion_failure`、`coverage_zero`、`coverage_gap`（由 `ExecutionSummary.md` 與 `CoverageSummary.md` 判定）
   - 執行動作：`Auto Repair Attempt += 1`，在 `RunReport.md` 的 `備註` 記錄本輪修復目標，將 `Current Step` 回退至 Step 6（缺案例/覆蓋）或 Step 7（腳本斷言/映射問題），並清場受影響 gate（至少 `Planning Gate Status`、`Script Generation Gate`、`Execution Gate`、`Verification DoD Status`）後自動續跑
   - 不可自動修復情境：外部阻塞（環境、依賴、權限、網路）或已達最大嘗試次數；此時保留 `FAILED`/`BLOCKED` 並停止自動續跑
18. 若 Coverage Zero Gate 與 Per-file Coverage Gate 均通過且執行完成，設定 `Execution Gate = passed`，並將 `Status = IN_PROGRESS`
19. 刷新 `Last Updated`
20. 成功完成時，勾選 Step 8 檢查清單並將 `Current Step` 更新為下一個合法步驟；若前置條件不成立且阻塞處理已完成（`ExecutionSummary.md` 與 `CoverageSummary.md` 均已產出），亦勾選 Step 8 檢查清單並將 `Current Step` 更新為 Step 9（此為治理例外：Step 8 的任務包含「記錄阻塞狀態並產出阻塞產物」，完成此任務即視為 Step 8 執行完畢；詳見 `governance.md` Section 3（RunReport 維護規則）中 Step 8 阻塞產物的例外說明）；若因必要 HTML 報告無法產出而阻塞，`Current Step` 維持在 Step 8；若命中 Coverage Zero Gate 或 Per-file Coverage Gate 失敗且不觸發/無法觸發自動修復，`Current Step` 維持在 Step 8
21. 更新 `testing-artifact/handoff/RunReport.md`

## Exit criteria
- 若前置條件成立：
  - 已有可追溯的原始執行證據，且 `ExecutionRaw.log` 路徑已可追蹤
  - 已有可追溯的測試結果 HTML 報告，且 `test-report-html/index.html` 路徑已可追蹤
  - 已有可追溯的 coverage HTML 報告，且 `coverage-html/index.html` 路徑已可追蹤
  - 已整理通過、失敗、阻塞結果
  - coverage 結果已彙整
  - 若 `Coverage Status = measured`，不得出現四項 coverage 全為 `0%` 且仍標記成功
- 若前置條件不成立：
  - 結果已正確標記為 `BLOCKED` 且未執行測試
  - `ExecutionSummary.md` 已記錄 blocker
  - `CoverageSummary.md` 已記錄 `not_applicable`
  - `Execution Raw Status = not_applicable`
  - `Test Result HTML Report Status = not_applicable`
  - `Coverage HTML Report Status = not_applicable`
- 若前置條件成立但任一必要 HTML 報告無法產出：
  - `Execution Gate = blocked`
  - `Status = BLOCKED`
  - `阻塞問題` 已記錄缺失的 reporter、轉換機制或輸出正規化原因
- 若前置條件成立且 coverage 四項全 `0%`：
  - `Status = FAILED`
  - `Execution Gate` 不得標記為 `passed`
  - `CoverageSummary.md` 已記錄 `Coverage Zero Check = fail`、`Root Cause Category`、`Next Fix Action`
- 若前置條件成立但存在 in-scope 業務 JS 未覆蓋（`Statements = 0%` 且 `Branches = 0%`）：
  - `Status = FAILED`
  - `CoverageSummary.md` 已記錄 `Uncovered Business Files`
- 若 `Execution Gate = blocked`（因 `Test Env Status ≠ passed`）：需依 `<skill_root>/TROUBLESHOOTING.md` Section 12 修復環境，回到 Step 1 重跑後方可重新執行 Step 8；亦可參考 `governance.md` Section 10 的環境自動初始化規則

## Skill-local resources
- Templates: `<skill_root>/templates/{ExecutionSummary,CoverageSummary}.template.md`
- Rules: `<skill_root>/governance.md`
