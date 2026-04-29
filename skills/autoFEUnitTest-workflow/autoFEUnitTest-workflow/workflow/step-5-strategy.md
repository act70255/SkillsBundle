# Step 5 - 策略決策

## Scope
只處理 Step 5。

## Process
1. 讀取 `ClassificationSummary.md`
2. 決定 test runner、DOM 環境、測試工具、mock 策略、coverage 規則
3. 若 `env` 或外部依賴屬於複雜情境，獨立產出 `MockStrategy.md`
4. 記錄採用原因與未採用原因
5. 於 `RunReport.md` 記錄 `Mock Strategy Status = generated` 或 `not_applicable`
6. 產出 `StrategyDecision.md`
7. 若策略可定案，設定 `Strategy Gate Status = passed`
8. 若因資訊不足無法定案，設定 `Strategy Gate Status = blocked`，並將 `Status = BLOCKED`，同時在 `阻塞問題` 記錄缺少的策略依據、契約或 env 資訊
9. 刷新 `Last Updated`
10. 成功完成時，勾選 Step 5 檢查清單並將 `Current Step` 更新為下一個合法步驟，且 `Status = IN_PROGRESS`；若阻塞，`Current Step` 維持在 Step 5
11. 更新 `RunReport.md`

## MockStrategy trigger
符合以下任一條件時，必須獨立產出 `MockStrategy.md`：
- 多個 API / network dependency 需要 mock
- 需要 mock 第三方 SDK、plugin 或跨模組 side effects
- 需要 stub/mimic 多個 browser APIs
- `test_env` 為必要且會影響測試執行行為
- mock 複雜度高到不適合只用 `StrategyDecision.md` 簡述

## Exit criteria
- 工具選型完整
- 風險控制策略完整
- 不存在沒有依據的策略決策
- 若符合條件，`MockStrategy.md` 已建立並在 `RunReport.md` 記錄

## Skill-local resources
- Template: `<skill_root>/templates/StrategyDecision.template.md`
- Template: `<skill_root>/templates/MockStrategy.template.md`
- Reference: `<skill_root>/references/strategy-matrix.md`
