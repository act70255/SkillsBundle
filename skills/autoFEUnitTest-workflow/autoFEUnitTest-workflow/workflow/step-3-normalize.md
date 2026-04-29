# Step 3 - 輸入正規化

## Scope
只處理 Step 3。

## Process
1. 讀取 `InputSummary.md`
2. 將輸入整理成統一資料模型
3. 解析專案結構、入口點、可測目標、env、外部依賴
4. 產出 `NormalizedInput.md`
5. 刷新 `Last Updated`
6. 勾選 Step 3 檢查清單並將 `Current Step` 更新為下一個合法步驟
7. 更新 `RunReport.md`

## Exit criteria
- 已建立可供後續分類與策略使用的正規化資料
- `NormalizedInput.md` 已列出 project、inputs、runtime、acceptance 四個面向

## Skill-local resources
- Template: `<skill_root>/templates/NormalizedInput.template.md`
- Reference: `<skill_root>/references/input-schema.md`
