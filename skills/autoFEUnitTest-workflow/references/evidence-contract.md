# Evidence Contract

## Step-level evidence
1. Step 0:
   - `RunReport.md`

2. Step 1:
    - `InputSummary.md`
    - Business JS Inventory（matched / excluded / in-scope）
   - 缺失輸入清單
   - `Test Env Status`（環境偵測與初始化結果，記錄於 `RunReport.md`）
   - runner 偵測 / 自動初始化嘗試摘要（可寫入 `RunReport.md` 的 `備註` 或 `阻塞問題`）

3. Step 2:
   - 補件紀錄（寫入 `InputSummary.md` 的 `## 補件紀錄` 區塊）
   - 缺口分流紀錄（至少能區分使用者補件型與 `env_blocker`）
   - `GapReport.md`（when blocked）

4. Step 3:
   - `NormalizedInput.md`

5. Step 4:
   - `ClassificationSummary.md`
   - 分類依據

6. Step 5:
    - `StrategyDecision.md`
    - 採用/不採用理由
    - Business JS Scope Completeness Gate 結果（含 defer 清單）
    - `MockStrategy.md`（when applicable）

7. Step 6:
    - `TestPlan.md`
    - `TestCases.md`
    - `File Coverage Matrix`（位於 `TestPlan.md`）
    - `Function Coverage Mapping`（位於 `TestCases.md`，需覆蓋新增/修改 function，或記錄 `justified-exception`）

8. Step 7:
    - `TestAssetManifest.md`（以表格格式呈現 Script Path、Case IDs、Covered Functions、Status；Case IDs 須可追溯至 `TestCases.md`）
    - `GenerationReview.md`
    - `Function Coverage Gate` 檢核結果（記錄於 `GenerationReview.md`）
    - `Case-to-Function-to-Script Mapping` 檢核結果（記錄於 `GenerationReview.md`）
    - `File-to-Case-to-Script Mapping` 檢核結果（記錄於 `GenerationReview.md`）

9. Step 8:
   - `ExecutionRaw.log`（when execution occurs）
   - `test-report-html/index.html`（when execution occurs）
   - `coverage-html/index.html`（when execution occurs）
   - `ExecutionSummary.md`
   - `CoverageSummary.md`
   - 原始執行輸出
    - Coverage Zero Gate 判定結果（記錄於 `CoverageSummary.md` 與 `ExecutionSummary.md`）
    - Per-file Coverage Gate 判定結果與 `Uncovered Business Files` 清單（記錄於 `CoverageSummary.md`）

10. Step 9:
   - `FinalReport.md`
   - 完整產物清單

## 證據規則
- 沒有證據的結論不得視為成立
- 證據應盡可能指向檔案、命令輸出、coverage 或設定
- 若證據不足，應回退到最近合法步驟補強
- `behavior_spec`、`acceptance_rules` 允許以推導方式成立，但推導必須記錄來源與證據；若推導來源不足或衝突，應標記 `missing_blocking` 並進入補件
