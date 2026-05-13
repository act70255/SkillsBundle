# Step 6 - 產出測試計畫

## Scope
只處理 Step 6。

## Path convention
- 本文件提及的檔名皆指 `testing-artifact/` 目錄樹下的標準路徑（例如 `testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`）。

## Entry Gate
- 必須確認 `RunReport.md` 中 `Strategy Gate Status = passed`，才可開始測試計畫產出
- 若 `Strategy Gate Status = blocked`，不得執行 Step 6；`Status` 應為 `BLOCKED`，需依阻塞原因決定補件路徑：
  - 若 `acceptance_rules` 缺口屬外部輸入（如 `behavior_spec` 未提供），回退 Step 2 補件後依 Step 1 → Step 3 → Step 4 → Step 5 重跑；此路徑須清場：`Input Validation Status`（Step 2 負責）、`Normalization Status`（若 `Normalization Status` 已為 `not_checked`（如 Step 4 阻塞時已重設），補件流程無需重複清場；若 `Normalization Status` 為 `passed`（Step 3 曾順利完成），補件流程須在重新進入 Step 3 前清場）、`Classification Status`（由補件流程在重新進入 Step 4 前清場）、`Strategy Gate Status`（由補件流程在重新進入 Step 5 前清場）、`Planning Gate Status`（由補件流程在重新進入 Step 6 前清場）
  - 若缺口屬 Step 5 內部推導不足，回退 Step 5 補齊依據後重跑 Step 5 → Step 6；此路徑須清場：`Strategy Gate Status`（由補件流程在重新進入 Step 5 前清場）、`Planning Gate Status`（由補件流程在重新進入 Step 6 前清場）
- 若 `Strategy Gate Status = not_checked`，表示 Step 5 尚未完成，不得進入 Step 6；應先執行 Step 5

## Process
1. 讀取 `StrategyDecision.md`、`NormalizedInput.md` 與 `RunReport.md`
2. 確認 `Strategy Gate Status = passed`，且 `acceptance_rules` 已解析完成
3. 產出 `TestPlan.md`
4. 產出 `TestCases.md`
5. 驗證每個案例都可追溯到規格、風險或 bug，且測試範圍與不測範圍清楚
6. 盤點 in-scope 業務 JS 清單（由 Step 1 Business JS Inventory 與 Step 5 defer 決策決定），並寫入 `testing-artifact/deliverables/TestPlan.md` 的 `File Coverage Matrix`
7. 盤點「本次新增/修改」的可測試 function 清單（來自 `source_code`、`changed_files`、`target_scope` 與已知變更證據），並寫入 `testing-artifact/deliverables/TestCases.md` 的函式覆蓋區塊
8. 驗證覆蓋配額：
   - 每個 in-scope 業務 JS 至少對應 1 筆 `Case ID`
   - 高風險檔案（由 `known_risks` 或 `acceptance_rules` 標記）至少對應 2 筆 `Case ID`
   - 每個新增/修改 function 至少對應 1 筆 `Case ID`；若無法直接對應，必須記錄 `justified-exception`（含理由與替代覆蓋證據）
9. 若策略依據、`acceptance_rules`、案例追溯依據不足，或覆蓋配額/函式覆蓋盤點證據不足，設定 `Planning Gate Status = blocked`，將 `Status = BLOCKED`，並在 `阻塞問題` 記錄缺口
10. 若規畫稿已建立但案例追溯、覆蓋配額、函式覆蓋對應、範圍界線或驗收對應仍需內部修正，設定 `Planning Gate Status = failed`，維持 `Status = IN_PROGRESS`（前提：`Status` 此前已為 `IN_PROGRESS` 而非 `BLOCKED`；若 `Status` 此前為 `BLOCKED`，必須先解除阻塞，再依 `failed + IN_PROGRESS` 路徑處理），並在 `備註` 記錄待修正項目
11. 若測試計畫與案例可合法定稿，且覆蓋配額與函式覆蓋規則通過，設定 `Planning Gate Status = passed`，並將 `Status = IN_PROGRESS`
12. 刷新 `Last Updated`
13. 若 `Planning Gate Status = passed`，勾選 Step 6 檢查清單並將 `Current Step` 更新為下一個合法步驟；若 `Planning Gate Status = blocked`，`Current Step` 維持在 Step 6 且 `Status = BLOCKED`；若 `Planning Gate Status = failed`，`Current Step` 維持在 Step 6 且 `Status = IN_PROGRESS`
14. 更新 `testing-artifact/handoff/RunReport.md`

## Exit criteria
- 測試範圍與不測範圍明確
- 案例矩陣完整
- 驗收條件與風險已反映在測試計畫中
- 每個 in-scope 業務 JS 至少 1 筆案例，高風險檔案至少 2 筆案例
- 新增/修改 function 皆有對應測試案例或已記錄 `justified-exception`
- `Planning Gate Status` 已有明確結果，且未通過時不得進入 Step 7

## Skill-local resources
- Templates: `<skill_root>/templates/{TestPlan,TestCases}.template.md`
- Reference: `<skill_root>/references/output-contract.md`
