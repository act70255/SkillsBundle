# Workflow Architecture

## 設計目標
此 workflow 將前端單元測試工作拆成可治理的 10 個步驟，核心不是只生成測試，而是建立：

- 輸入治理
- 分類治理
- 策略治理
- 執行治理
- 證據治理

## 架構分層
1. `SKILL.md`
作為入口與導航。

2. `governance.md`
作為狀態與 gate 的唯一語意來源。

3. `workflow/*`
作為 step-by-step 執行規則。

4. `references/*`
作為輸入、分類、策略、證據與輸出規則來源。

5. `templates/*`
作為標準產物骨架。

## 產物流向
`RunReport -> InputSummary -> NormalizedInput -> ClassificationSummary -> StrategyDecision -> TestPlan/TestCases -> TestAssetManifest -> GenerationReview -> ExecutionRaw.log + test-report-html/index.html + coverage-html/index.html + ExecutionSummary/CoverageSummary -> FinalReport`

條件式產物（`MockStrategy.md`、`GapReport.md`）在對應步驟觸發時產生，不在主鏈流向中，但需在 `RunReport.md` 以 `generated` 或 `not_applicable` 記錄狀態。
