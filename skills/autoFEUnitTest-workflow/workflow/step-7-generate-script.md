# Step 7 - 產出測試腳本與測試資產

## Scope
只處理 Step 7。

## Entry Gate
- 必須確認 `RunReport.md` 中 `Planning Gate Status = passed`，才可開始測試腳本產出
- 若 `Planning Gate Status = failed`，不得執行 Step 7；應回退到 Step 6 進行內部修正，並在 `RunReport.md` 更新待修正原因
- 若 `Planning Gate Status = blocked`，不得執行 Step 7；`RunReport.md` 的 `Status` 應為 `BLOCKED`；解除路徑依阻塞原因決定：
  - 若缺口為 `acceptance_rules` 或策略依據不足，且缺口屬於 Step 5 內部推導問題（`behavior_spec`、`known_risks` 等外部輸入已存在，但 Step 5 的推導過程不完整），回退到 Step 5 補齊依據後重跑 Step 5 → Step 6；此路徑須清場：`Strategy Gate Status`（由補件流程在重新進入 Step 5 前清場）、`Planning Gate Status`（由補件流程在重新進入 Step 6 前清場）
  - 若缺口需要補齊外部輸入（如 `behavior_spec`、`known_risks` 為空，或 `acceptance_rules` 缺失是因為原始輸入欄位未提供），回退到 Step 2 補件後依 Step 1 → Step 3 → Step 4 → Step 5 → Step 6 重跑（判斷原則：優先確認外部輸入欄位是否已存在；若 `behavior_spec` 或 `known_risks` 本身為空，屬外部輸入問題；若已存在但 Step 5 無法推導出合法 `acceptance_rules`，屬 Step 5 內部問題）；此路徑下須重設受影響的 gate 欄位為 `not_checked`：`Input Validation Status`（Step 2 負責）、`Normalization Status`（若 `Normalization Status` 已為 `not_checked`（如 Step 4 阻塞時已重設），補件流程無需重複清場；若 `Normalization Status` 為 `passed`（Step 3 曾順利完成），補件流程須在重新進入 Step 3 前清場）、`Classification Status`（由補件流程在重新進入 Step 4 前清場）、`Strategy Gate Status`（由補件流程在重新進入 Step 5 前清場）、`Planning Gate Status`（由補件流程在重新進入 Step 6 前清場）
  - 共通要求（無論哪條路徑）：`Planning Gate Status` 在重跑 Step 6 前均須重設為 `not_checked`（已分別列於上方各路徑清場說明中，此為統一強調）

## Process
1. 讀取 `TestPlan.md`、`TestCases.md` 與 `RunReport.md`
2. 確認 `Planning Gate Status = passed`
3. 依策略產出測試腳本、setup、mock、fixture
4. 盤點測試資產並以表格格式（Script Path / Case IDs / Status）寫入 `TestAssetManifest.md`，Case IDs 須可追溯至 `TestCases.md`
5. 執行生成品質檢核並寫入 `GenerationReview.md`
6. 於 `RunReport.md` 記錄 `Generation Review Status = generated`
7. 若腳本品質通過，設定 `Script Generation Gate = passed`
8. 若腳本品質未通過，設定 `Script Generation Gate = failed`，並將 `Status = IN_PROGRESS`，同時在 `備註` 記錄待修正的生成問題
9. 若因外部原因（如腳本依賴套件安裝失敗、執行環境限制）導致腳本無法繼續生成，設定 `Script Generation Gate = blocked`，並將 `Status = BLOCKED`，同時在 `阻塞問題` 記錄外部阻塞原因
10. 刷新 `Last Updated`
11. 若 `Script Generation Gate = passed`，勾選 Step 7 檢查清單並將 `Current Step` 更新為下一個合法步驟，且 `Status = IN_PROGRESS`；若 `Script Generation Gate = failed`，`Current Step` 維持在 Step 7 且 `Status = IN_PROGRESS`；若 `Script Generation Gate = blocked`，`Current Step` 維持在 Step 7 且 `Status = BLOCKED`
12. 更新 `RunReport.md`

## Exit criteria
- 測試資產盤點完整（至少對已生成或已嘗試生成的資產有明確紀錄）
- 若 `Script Generation Gate = passed`，主要腳本已生成，且可進入 Step 8
- 若 `Script Generation Gate = failed`，主要腳本已生成，品質檢核已記錄，且不得進 Step 8
- 若 `Script Generation Gate = blocked`，`Status = BLOCKED`，`阻塞問題` 已記錄阻塞原因，且不得進 Step 8

## Skill-local resources
- Templates: `<skill_root>/templates/{TestAssetManifest,GenerationReview}.template.md`
- Reference: `<skill_root>/references/output-contract.md`
