# Step 9 - 最終報告與 DONE Gate

## Scope
只處理 Step 9。

## Path convention
- 本文件提及的檔名皆指 `testing-artifact/` 目錄樹下的標準路徑（例如 `testing-artifact/deliverables/FinalReport.md`、`testing-artifact/handoff/ExecutionSummary.md`、`testing-artifact/handoff/CoverageSummary.md`）。

## Entry Gate
- 必須確認 `RunReport.md` 中 `Execution Gate = passed`（前置條件成立且執行完成路徑），或 `Execution Gate = blocked` 且該阻塞屬於「Step 8 前置條件不成立但阻塞產物已完整產出」路徑，才可開始最終報告
- 若 `Status = FAILED` 且符合 Auto Repair Loop 觸發條件（`Auto Repair Enabled = true` 且 `Auto Repair Attempt < Auto Repair Max Attempts` 且失敗分類屬可內部修復），不得進入 Step 9，應優先回 Step 6/7 自動續跑
- 若 `Execution Gate = not_checked`，表示 Step 8 尚未完成，不得進入 Step 9；應先執行 Step 8
- 注意：`Execution Gate` 無 `failed` 合法值（合法值：`not_checked / passed / blocked`）；測試執行失敗的結果以 `Execution Gate = passed` + `ExecutionSummary.md` 中的失敗詳情表達，不以 `failed` 表達
- 補充：即使 `Status = BLOCKED`（因 Step 8 前置條件不成立所設定），只要 `Execution Gate = blocked` 且 Step 8 的阻塞產物（`ExecutionSummary.md`、`CoverageSummary.md`）已完整產出，且 `ExecutionRaw.log`、`test-report-html/index.html`、`coverage-html/index.html` 已正確標記為 `not_applicable`，仍可進入 Step 9 以完成最終報告；若 `Execution Gate = blocked` 的原因是必要 HTML 報告無法產出，則不得進入 Step 9，必須留在 Step 8 修正
- 若 `Verification DoD Status` 已為 `passed` 但 `Status ≠ DONE`（狀態損壞情境），視為未完成更新；應重新執行 Step 9 完整流程，確認所有必要產物齊全後更新最終 `Status = DONE`

## Process
1. 讀取所有必要產物
2. 彙整最終結果、風險、未覆蓋區域與建議
3. 產出業務 JS 覆蓋統計：`Covered Business Files / Total In-scope Business Files`
4. 列出未覆蓋業務 JS 清單與原因，並提供補測優先級（P0/P1/P2）
5. 產出 `testing-artifact/deliverables/FinalReport.md`
6. 驗證 `testing-artifact/handoff/RunReport.md` 中的產物狀態欄位與 gate 狀態欄位與實際產物一致
7. 若 DoD 與必要產物齊全，設定 `Verification DoD Status = passed`
8. 若因缺證據、缺產物或外部依賴導致無法完成，設定 `Verification DoD Status = blocked`，並在 `阻塞問題` 記錄未通過項目
9. 若可執行步驟已完成但結果不符合驗收規則，設定 `Verification DoD Status = failed`，並在 `備註` 記錄失敗原因與後續建議
10. 對使用者輸出中文總結，至少包含：整體結果、主要產物 / 證據、`Covered/Total` 業務 JS 覆蓋統計、未覆蓋清單與優先級、阻塞或失敗原因（若有）、以及建議下一步
11. 若 `test-report-html/index.html` 或 `coverage-html/index.html` 已合法產出，主動詢問使用者是否要用網頁檢視測試結果；若流程為 `BLOCKED`，或 HTML 報告路徑為 `not_applicable` / 缺失，則不得主動詢問網頁檢視
12. 刷新 `Last Updated`
13. 更新 `testing-artifact/handoff/RunReport.md` 的檢查清單與最終狀態
14. 驗證 `DONE Gate`
15. 依 DONE gate 結果設定最終 `Status`：
   - gate 通過 => `DONE`
   - gate 未通過且屬外部阻塞 => `BLOCKED`
   - gate 未通過且屬結果/驗收不符 => `FAILED`
   - gate 未通過但仍可內部持續整理 => `IN_PROGRESS`

## Final status mapping
- `DONE`: 必要產物齊全、證據鏈完整、DoD 通過
- `BLOCKED`: 缺必要輸入、缺證據、缺外部依賴或 blocker 未解除
- `FAILED`: 測試執行完成，但結果不符合驗收規則或品質要求
- `IN_PROGRESS`: 尚有整理或修正工作，但目前不屬於外部阻塞

## Exit criteria
- 必要產物齊全（具體清單請參考 `governance.md` Section 7；Step 9 Process 步驟 4 應逐一對照此清單驗證每個產物的路徑與狀態欄位；若 `Execution Gate = passed`，`ExecutionRaw.log`、`test-report-html/index.html`、`coverage-html/index.html` 必須均為可追蹤實體產物，不得為 `not_applicable`）
- 證據鏈完整
- `RunReport.md` 內的產物狀態、gate 狀態、路徑與最終結果一致
- 已先對使用者輸出中文總結；僅在 HTML 報告存在時才主動詢問是否要用網頁檢視
- 最終報告已包含業務 JS 覆蓋統計與未覆蓋優先級清單
- 若全部條件成立，狀態更新為 `DONE`

## Skill-local resources
- Template: `<skill_root>/templates/FinalReport.template.md`
- Rules: `<skill_root>/governance.md`
