# Step 5 - 策略決策

## Scope
只處理 Step 5。

## Entry Gate
- 必須確認 `RunReport.md` 中 `Classification Status = passed`，才可開始策略決策
- 若 `Classification Status = blocked`，不得執行 Step 5；`RunReport.md` 的 `Status` 維持 `BLOCKED`，`Current Step` 維持在 Step 4

## Process
1. 讀取 `ClassificationSummary.md`、`NormalizedInput.md` 與 `RunReport.md`
2. 決定 test runner、DOM 環境、測試工具、mock 策略、coverage 規則，並在此步完成 `acceptance_rules` 的最終確認
3. 若 `env` 或外部依賴屬於複雜情境，獨立產出 `MockStrategy.md`
4. 記錄採用原因與未採用原因
5. 於 `RunReport.md` 記錄 `Mock Strategy Status = generated` 或 `not_applicable`
6. 產出 `StrategyDecision.md`
7. 若策略可定案且 `acceptance_rules` 已明確，設定 `Strategy Gate Status = passed`
8. 若因資訊不足無法定案，或 `acceptance_rules` 仍無法確認，設定 `Strategy Gate Status = blocked`，並將 `Status = BLOCKED`，同時在 `阻塞問題` 記錄缺少的策略依據、契約、env 資訊或驗收依據（阻塞後的補件路徑（如 Step 6 Entry Gate 偵測阻塞後發起的 Step 2 補件流程，或直接補齊 Step 5 缺口的修正路徑）在重新進入 Step 5 前，應將 `Strategy Gate Status` 清場為 `not_checked`；Step 5 本身不負責自行清場；「清場」定義見 `governance.md` Section 9）
9. 刷新 `Last Updated`
10. 成功完成時，勾選 Step 5 檢查清單並將 `Current Step` 更新為下一個合法步驟，且 `Status = IN_PROGRESS`；若阻塞，`Current Step` 維持在 Step 5
11. 更新 `RunReport.md`

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
- `acceptance_rules` 已被最終確認，足以支撐 Step 6 規畫
- 不存在沒有依據的策略決策
- 若符合條件，`MockStrategy.md` 已建立，且 `RunReport.md` 的 `Mock Strategy Status` 已設定為 `generated` 或 `not_applicable`

## Skill-local resources
- Template: `<skill_root>/templates/StrategyDecision.template.md`
- Template: `<skill_root>/templates/MockStrategy.template.md`
- Reference: `<skill_root>/references/strategy-matrix.md`
