# Step 9 - 最終報告

## Scope
只處理 Step 9。

## Process
1. 讀取所有必要產物
2. 彙整最終結果、風險、未覆蓋區域與建議
3. 產出 `FinalReport.md`
4. 驗證 `RunReport.md` 中的產物狀態欄位與實際產物一致
5. 若 DoD 與必要產物齊全，設定 `Verification DoD Status = passed`
6. 若因缺證據、缺產物或外部依賴導致無法完成，設定 `Verification DoD Status = blocked`，並在 `阻塞問題` 記錄未通過項目
7. 若可執行步驟已完成但結果不符合驗收規則，設定 `Verification DoD Status = failed`，並在 `備註` 記錄失敗原因與後續建議
8. 刷新 `Last Updated`
9. 更新 `RunReport.md` 的檢查清單與最終狀態
10. 驗證 `DONE Gate`
11. 依 DONE gate 結果設定最終 `Status`：
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
- 必要產物齊全
- 證據鏈完整
- `RunReport.md` 內的產物狀態、路徑與最終結果一致
- 若全部條件成立，狀態更新為 `DONE`

## Skill-local resources
- Template: `<skill_root>/templates/FinalReport.template.md`
- Rules: `<skill_root>/governance.md`
