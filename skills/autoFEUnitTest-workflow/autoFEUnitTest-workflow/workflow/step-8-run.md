# Step 8 - 執行測試

## Scope
只處理 Step 8。

## Process
1. 確認 Step 7 品質 gate 通過
2. 若執行前置條件不成立，設定 `Execution Gate = blocked`，將 `Status = BLOCKED`，在 `阻塞問題` 記錄缺失前置條件
3. 若前置條件不成立，設定 `Execution Raw Status = not_applicable`
4. 若前置條件不成立，產出 `ExecutionSummary.md`，明確記錄 `BLOCKED` 原因
5. 若前置條件不成立，產出 `CoverageSummary.md`，明確記錄 `not_applicable`
6. 僅在前置條件成立時，執行測試腳本與 coverage
7. 僅在前置條件成立時，保存原始輸出證據為標準路徑 `ExecutionRaw.log`；若工具輸出其他檔名，需複製、重新命名或明確正規化到此路徑
8. 僅在前置條件成立時，於 `RunReport.md` 記錄 `Execution Raw Status = generated`
9. 僅在前置條件成立時，產出 `ExecutionSummary.md` 與 `CoverageSummary.md`
10. 若執行完成，設定 `Execution Gate = passed`，並將 `Status = IN_PROGRESS`
11. 刷新 `Last Updated`
12. 成功完成時，勾選 Step 8 檢查清單並將 `Current Step` 更新為下一個合法步驟；若阻塞，`Current Step` 維持在 Step 8
13. 更新 `RunReport.md`

## Exit criteria
- 若前置條件成立：
  - 已有可追溯的原始執行證據，且 `ExecutionRaw.log` 路徑已可追蹤
  - 已整理通過、失敗、阻塞結果
  - coverage 結果已彙整
- 若前置條件不成立：
  - 結果已正確標記為 `BLOCKED` 且未執行測試
  - `ExecutionSummary.md` 已記錄 blocker
  - `CoverageSummary.md` 已記錄 `not_applicable`
  - `Execution Raw Status = not_applicable`

## Skill-local resources
- Templates: `<skill_root>/templates/{ExecutionSummary,CoverageSummary}.template.md`
- Rules: `<skill_root>/governance.md`
