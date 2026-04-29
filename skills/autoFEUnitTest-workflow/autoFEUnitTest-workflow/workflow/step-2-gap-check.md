# Step 2 - 缺口補件

## Scope
只處理 Step 2。

## Process
1. 讀取 `InputSummary.md` 與 `RunReport.md`
2. 找出 `missing_blocking` 欄位
3. 採用一問一答方式補件
4. 補件後回寫 `InputSummary.md`
5. 若核心輸入仍缺失，產出 `GapReport.md`
6. 於 `RunReport.md` 記錄 `Gap Report Status = generated` 或 `not_applicable`
7. 若缺口已解除，設定 `Input Validation Status = passed`，並將 `Status = IN_PROGRESS`
8. 若核心輸入仍缺失，設定 `Input Validation Status = blocked`，並將 `RunReport` 狀態標記為 `BLOCKED`，同時在 `阻塞問題` 記錄缺口摘要與 `GapReport.md` 路徑
9. 刷新 `Last Updated`
10. 若補件完成，勾選 Step 2 檢查清單並將 `Current Step` 更新為下一個合法步驟；若仍阻塞，`Current Step` 維持在 Step 2

## GapReport trigger
符合以下條件時，必須獨立產出 `GapReport.md`：
- Step 2 補件後，仍存在 `missing_blocking` 欄位
- 缺口已明確阻塞 Step 3 之後的流程
- 缺口需要後續回合或使用者補件才能解除

## Exit criteria
- 所有阻塞欄位已補齊，或已明確停在 `BLOCKED`
- 補件紀錄已寫入 `InputSummary.md`
- `RunReport.md` 已更新下一步狀態
- 若仍為 `BLOCKED`，`GapReport.md` 已建立並記錄缺口與建議下一步

## Skill-local resources
- Template: `<skill_root>/templates/InputSummary.template.md`
- Template: `<skill_root>/templates/GapReport.template.md`
- Rules: `<skill_root>/governance.md`
