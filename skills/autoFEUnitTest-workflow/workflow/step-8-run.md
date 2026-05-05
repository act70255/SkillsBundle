# Step 8 - 執行測試

## Scope
只處理 Step 8。

## Entry Gate
- 必須確認 `RunReport.md` 中 `Script Generation Gate = passed`，才可執行測試
- 若 `Script Generation Gate ≠ passed`，不得執行 Step 8；應回退到 Step 7 修正腳本
- 若 `Script Generation Gate = failed`，`Current Step` 應停留在 Step 7，不得進入 Step 8

## Process
1. 確認 `RunReport.md` 中 `Script Generation Gate = passed`
2. 確認前置條件（以下全部需成立）：
   - `Test Env Status = passed`（package.json、test runner、node_modules 已就緒；由 Step 1 自動偵測與初始化）
   - `Script Generation Gate = passed`
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
15. 若執行完成，設定 `Execution Gate = passed`，並將 `Status = IN_PROGRESS`
16. 刷新 `Last Updated`
17. 成功完成時，勾選 Step 8 檢查清單並將 `Current Step` 更新為下一個合法步驟；若前置條件不成立且阻塞處理已完成（`ExecutionSummary.md` 與 `CoverageSummary.md` 均已產出），亦勾選 Step 8 檢查清單並將 `Current Step` 更新為 Step 9（此為治理例外：Step 8 的任務包含「記錄阻塞狀態並產出阻塞產物」，完成此任務即視為 Step 8 執行完畢；詳見 `governance.md` Section 3（RunReport 維護規則）中 Step 8 阻塞產物的例外說明）；若因必要 HTML 報告無法產出而阻塞，`Current Step` 維持在 Step 8
18. 更新 `RunReport.md`

## Exit criteria
- 若前置條件成立：
  - 已有可追溯的原始執行證據，且 `ExecutionRaw.log` 路徑已可追蹤
  - 已有可追溯的測試結果 HTML 報告，且 `test-report-html/index.html` 路徑已可追蹤
  - 已有可追溯的 coverage HTML 報告，且 `coverage-html/index.html` 路徑已可追蹤
  - 已整理通過、失敗、阻塞結果
  - coverage 結果已彙整
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
- 若 `Execution Gate = blocked`（因 `Test Env Status ≠ passed`）：需依 `<skill_root>/TROUBLESHOOTING.md` Section 12 修復環境，回到 Step 1 重跑後方可重新執行 Step 8；亦可參考 `governance.md` Section 10 的環境自動初始化規則

## Skill-local resources
- Templates: `<skill_root>/templates/{ExecutionSummary,CoverageSummary}.template.md`
- Rules: `<skill_root>/governance.md`
