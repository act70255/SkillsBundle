# Step 5 - 策略決策

## Scope
只處理 Step 5。

## Path convention
- 本文件提及的檔名皆指 `testing-artifact/` 目錄樹下的標準路徑（例如 `testing-artifact/handoff/StrategyDecision.md`、`testing-artifact/handoff/MockStrategy.md`）。

## Entry Gate
- 必須確認 `RunReport.md` 中 `Classification Status = passed`，才可開始策略決策
- 若 `Classification Status = blocked`，不得執行 Step 5；`RunReport.md` 的 `Status` 維持 `BLOCKED`，`Current Step` 維持在 Step 4

## Process
1. 讀取 `ClassificationSummary.md`、`NormalizedInput.md` 與 `RunReport.md`
2. 決定 test runner、DOM 環境、測試工具、mock 策略、coverage 規則，並在此步完成 `acceptance_rules` 的最終確認
3. 驗證 `acceptance_rules` 可測性：至少包含 1 項 function-level 驗收訊號（例如回傳值、狀態變更、例外、side effect）
4. 若 `acceptance_rules` 來源為 `derived`，必須在 `StrategyDecision.md` 記錄 `Derivation Confidence`；`weak` 不得放行到 Step 6
5. 執行 Business JS Scope Completeness Gate：
   - 從 Step 1 的 Business JS Inventory 讀取 in-scope 業務 JS 清單
   - `Test Target Strategy` 必須覆蓋全部 in-scope 業務 JS；不得僅選擇局部高風險檔案而未記錄豁免
   - 允許 `defer`，但每個 defer 項目必須在 `StrategyDecision.md` 記錄理由、風險等級、補測時機與 owner
   - 若存在未覆蓋且未記錄 defer 的業務 JS，`Strategy Gate Status` 必須為 `blocked`
6. 若 `env` 或外部依賴屬於複雜情境，獨立產出 `testing-artifact/handoff/MockStrategy.md`
7. 記錄採用原因與未採用原因
8. 於 `testing-artifact/handoff/RunReport.md` 記錄 `Mock Strategy Status = generated` 或 `not_applicable`
9. 產出 `testing-artifact/handoff/StrategyDecision.md`
10. 若策略可定案且 `acceptance_rules` 已明確（包含 `provided` 或 `derived` 且證據充分），function-level 可測性檢核通過，且 Business JS Scope Completeness Gate 通過，設定 `Strategy Gate Status = passed`
11. 若 `acceptance_rules` 僅為弱推導（證據不足/互相衝突）、仍無法確認、function-level 可測性不足，或 Business JS Scope Completeness Gate 未通過，設定 `Strategy Gate Status = blocked`，並將 `Status = BLOCKED`，同時在 `阻塞問題` 記錄缺少的策略依據、契約、env 資訊、驗收依據或未覆蓋業務 JS 清單（阻塞後的補件路徑（如 Step 6 Entry Gate 偵測阻塞後發起的 Step 2 補件流程，或直接補齊 Step 5 缺口的修正路徑）在重新進入 Step 5 前，應將 `Strategy Gate Status` 清場為 `not_checked`；Step 5 本身不負責自行清場；「清場」定義見 `governance.md` Section 9）
12. 刷新 `Last Updated`
13. 成功完成時，勾選 Step 5 檢查清單並將 `Current Step` 更新為下一個合法步驟，且 `Status = IN_PROGRESS`；若阻塞，`Current Step` 維持在 Step 5
14. 更新 `testing-artifact/handoff/RunReport.md`

## MockStrategy trigger
符合以下任一條件時，必須獨立產出 `MockStrategy.md`：
- 兩個以上外部 API / network dependency 需要 mock
- 存在第三方 SDK、plugin 或 analytics side effect
- 需要 mock 兩個以上 browser APIs，例如 `localStorage`、`location`、`ResizeObserver`
- `test_env` 會影響測試行為或 mock 連線目標
- 需要 partial mock，且 mock 邊界不只單一函式或單一模組

## Exit criteria
- 工具選型完整
- 風險控制策略完整
- `acceptance_rules` 已被最終確認（`provided` 或證據充分的 `derived`），足以支撐 Step 6 規畫
- `acceptance_rules` 已通過 function-level 可測性檢核（至少 1 項可驗證訊號）
- 不存在沒有依據的策略決策
- in-scope 業務 JS 已完整覆蓋於策略範圍，或已逐項記錄 defer 理由
- 若符合條件，`MockStrategy.md` 已建立，且 `RunReport.md` 的 `Mock Strategy Status` 已設定為 `generated` 或 `not_applicable`

## Skill-local resources
- Template: `<skill_root>/templates/StrategyDecision.template.md`
- Template: `<skill_root>/templates/MockStrategy.template.md`
- Reference: `<skill_root>/references/strategy-matrix.md`
