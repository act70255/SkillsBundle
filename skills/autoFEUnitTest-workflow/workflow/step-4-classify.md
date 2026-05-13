# Step 4 - 分類

## Scope
只處理 Step 4。

## Path convention
- 本文件提及的檔名皆指 `testing-artifact/` 目錄樹下的標準路徑（例如 `testing-artifact/handoff/ClassificationSummary.md`）。

## Entry Gate
- 必須確認 `RunReport.md` 中 `Normalization Status = passed`，才可開始分類
- 若 `Normalization Status ≠ passed`，不得執行 Step 4；應回退到 Step 3 重跑正規化，並在 `RunReport.md` 更新阻塞原因

## Process
1. 讀取 `NormalizedInput.md` 與 `RunReport.md`
2. 分類技術棧、測試目標、執行環境、外部依賴、風險，並在此步完成 `framework_type` 的最終確認
3. 為每個分類項目記錄依據
4. 產出 `ClassificationSummary.md`
5. 若分類依據完整且 `framework_type` 已明確，設定 `Classification Status = passed`
6. 若分類依據不足，或 `framework_type` 仍無法確認，設定 `Classification Status = blocked`，並將 `Status = BLOCKED`，同時在 `阻塞問題` 記錄缺少的分類依據；解除路徑：依 Step 2 → Step 1 → Step 3 → Step 4 順序重跑，各欄位清場責任如下：
   - `Input Validation Status`：由 Step 2 補件完成時重設為 `not_checked`（Step 2 負責）
   - `Normalization Status`：由本步驟（Step 4）阻塞處理時重設為 `not_checked`，確保 Step 3 重跑時從 `not_checked` 開始
   - `Classification Status`：在重跑 Step 4 前由補件流程清場，設為 `not_checked`（進入 Step 4 前清場；與 governance.md Section 9 一致）
7. 刷新 `Last Updated`
8. 成功完成時，勾選 Step 4 檢查清單並將 `Current Step` 更新為下一個合法步驟，且 `Status = IN_PROGRESS`；若阻塞，`Current Step` 維持在 Step 4
9. 更新 `RunReport.md`

## Exit criteria
- 分類結果完整
- `framework_type` 已被最終確認
- 每個分類結果都有可追溯依據
- 未明確分類的項目已標註風險或待補件
- `ClassificationSummary.md` 的 `Framework Type Confirmed` 欄位為 `yes`，且 `RunReport.md` 的 `Classification Status` 已更新

## Skill-local resources
- Template: `<skill_root>/templates/ClassificationSummary.template.md`
- Reference: `<skill_root>/references/classification-rules.md`
