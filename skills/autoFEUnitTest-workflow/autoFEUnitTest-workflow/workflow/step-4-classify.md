# Step 4 - 分類

## Scope
只處理 Step 4。

## Process
1. 讀取 `NormalizedInput.md`
2. 分類技術棧、測試目標、執行環境、外部依賴、風險
3. 為每個分類項目記錄依據
4. 產出 `ClassificationSummary.md`
5. 若分類依據完整，設定 `Classification Status = passed`
6. 若分類依據不足，設定 `Classification Status = blocked`，並將 `Status = BLOCKED`，同時在 `阻塞問題` 記錄缺少的分類依據
7. 刷新 `Last Updated`
8. 成功完成時，勾選 Step 4 檢查清單並將 `Current Step` 更新為下一個合法步驟，且 `Status = IN_PROGRESS`；若阻塞，`Current Step` 維持在 Step 4
9. 更新 `RunReport.md`

## Exit criteria
- 分類結果完整
- 每個分類結果都有可追溯依據
- 未明確分類的項目已標註風險或待補件

## Skill-local resources
- Template: `<skill_root>/templates/ClassificationSummary.template.md`
- Reference: `<skill_root>/references/classification-rules.md`
