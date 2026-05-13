# Step 3 - 輸入正規化

## Scope
只處理 Step 3。

## Path convention
- 本文件提及的檔名皆指 `testing-artifact/` 目錄樹下的標準路徑（例如 `testing-artifact/handoff/NormalizedInput.md`）。

## Entry Gate
- 必須確認 `Input Validation Status = passed` 且 `Missing Required Inputs` 已清空，才可開始正規化
- 若 `Input Validation Status = blocked`，不得執行 Step 3：
  - 若 Step 2 尚未執行，回退至 Step 2 補件；補件完成後將 `Input Validation Status` 重設為 `not_checked`，再回 Step 1 重跑驗證
  - 若 Step 2 已執行補件但 Step 1 重跑後仍 `blocked`，維持在 Step 2 繼續補件，不得跳過 Step 1 直接進入 Step 3
- 若 `Input Validation Status = not_checked`，表示 Step 1 尚未完成，不得進入 Step 3；`Current Step` 應為 Step 1，需先完成 Step 1 輸入驗證後才可進入 Step 3

## Process
1. 讀取 `InputSummary.md` 與 `RunReport.md`
2. 確認 `Input Validation Status = passed`，且 `Missing Required Inputs` 已清空
3. 將輸入整理成統一資料模型
4. 解析專案結構、入口點、可測目標、env、外部依賴
5. 若 `framework_type` 或 `acceptance_rules` 尚未定案，至少整理其推導證據，供 Step 4 / Step 5 完成解析
6. 產出 `NormalizedInput.md`
7. 設定 `Normalization Status = passed`
8. 刷新 `Last Updated`
9. 勾選 Step 3 檢查清單並將 `Current Step` 更新為下一個合法步驟
10. 更新 `RunReport.md`

## Exit criteria
- 已建立可供後續分類與策略使用的正規化資料
- `NormalizedInput.md` 已列出 project、inputs、runtime、acceptance 四個面向
- `Governed Required` 欄位的推導證據已被整理到可供 Step 4 / Step 5 判定的程度
- `Normalization Status` 已在 `RunReport.md` 中設定為 `passed`

## Skill-local resources
- Template: `<skill_root>/templates/NormalizedInput.template.md`
- Reference: `<skill_root>/references/input-schema.md`
