# Step 7 - 產出測試腳本與測試資產

## Scope
只處理 Step 7。

## Path convention
- 本文件提及的檔名皆指 `testing-artifact/` 目錄樹下的標準路徑（例如 `testing-artifact/deliverables/TestAssetManifest.md`、`testing-artifact/handoff/GenerationReview.md`、`testing-artifact/scripts/`）。

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
   - 單元測試腳本必須以 `import`/`require` 載入被測模組；不得以 `eval` 或讀檔字串執行被測程式
4. 盤點測試資產並以表格格式（Script Path / Case IDs / Covered Functions / Status）寫入 `testing-artifact/deliverables/TestAssetManifest.md`，Case IDs 須可追溯至 `testing-artifact/deliverables/TestCases.md`
5. 針對 Step 6 的覆蓋配額與函式覆蓋盤點，逐一確認：
   - 每個 in-scope 業務 JS 至少對應 1 筆可執行測試
   - 每個新增/修改 function 已由至少 1 筆可執行測試覆蓋
   - 若為 `justified-exception`，必須在 `testing-artifact/handoff/GenerationReview.md` 記錄理由與替代覆蓋證據
6. 執行 Case-to-Function-to-Script 映射檢核：每個 `Case ID` 必須能對應至少 1 個目標 function 的實際觸發（import/呼叫）與 assertion；若缺少映射，視為函式覆蓋未完成
7. 執行 File-to-Case-to-Script 映射檢核：每個 in-scope 業務 JS 必須至少出現在 1 列 `TestAssetManifest`，且該列 `Case IDs` 非空
8. 執行生成品質檢核並寫入 `testing-artifact/handoff/GenerationReview.md`
9. 若存在「新增/修改 function 無對應測試且無合法例外」、「Case-to-Function-to-Script 映射不完整」、「File-to-Case-to-Script 映射不完整」，或使用 `eval`/字串執行模式，設定 `Script Generation Gate = failed`
10. 於 `testing-artifact/handoff/RunReport.md` 記錄 `Generation Review Status = generated`
11. 若腳本品質、函式覆蓋檢核、Case-to-Function-to-Script 映射檢核與 File-to-Case-to-Script 映射檢核皆通過，設定 `Script Generation Gate = passed`
12. 若腳本品質、函式覆蓋檢核或映射檢核未通過，設定 `Script Generation Gate = failed`，並將 `Status = IN_PROGRESS`，同時在 `備註` 記錄待修正的生成問題
13. 若因外部原因（如腳本依賴套件安裝失敗、執行環境限制）導致腳本無法繼續生成，設定 `Script Generation Gate = blocked`，並將 `Status = BLOCKED`，同時在 `阻塞問題` 記錄外部阻塞原因
14. 刷新 `Last Updated`
15. 若 `Script Generation Gate = passed`，勾選 Step 7 檢查清單並將 `Current Step` 更新為下一個合法步驟，且 `Status = IN_PROGRESS`；若 `Script Generation Gate = failed`，`Current Step` 維持在 Step 7 且 `Status = IN_PROGRESS`；若 `Script Generation Gate = blocked`，`Current Step` 維持在 Step 7 且 `Status = BLOCKED`
16. 更新 `testing-artifact/handoff/RunReport.md`

## Exit criteria
- 測試資產盤點完整（至少對已生成或已嘗試生成的資產有明確紀錄）
- 若 `Script Generation Gate = passed`，主要腳本已生成、函式覆蓋檢核通過，且可進入 Step 8
- 若 `Script Generation Gate = passed`，Case-to-Function-to-Script 映射檢核通過
- 若 `Script Generation Gate = passed`，File-to-Case-to-Script 映射檢核通過（每個 in-scope 業務 JS 皆有可執行測試資產）
- 若 `Script Generation Gate = failed`，主要腳本已生成，品質檢核已記錄，且不得進 Step 8
- 若 `Script Generation Gate = blocked`，`Status = BLOCKED`，`阻塞問題` 已記錄阻塞原因，且不得進 Step 8

## Skill-local resources
- Templates: `<skill_root>/templates/{TestAssetManifest,GenerationReview}.template.md`
- Reference: `<skill_root>/references/output-contract.md`
