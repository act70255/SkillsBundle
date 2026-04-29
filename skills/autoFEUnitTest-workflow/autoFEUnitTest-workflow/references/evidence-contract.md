# Evidence Contract

## Step-level evidence
1. Step 0:
   - `RunReport.md`

2. Step 1:
   - `InputSummary.md`
   - 缺失輸入清單

3. Step 2:
    - 補件紀錄
   - `GapReport.md`（when blocked）

4. Step 3:
   - `NormalizedInput.md`

5. Step 4:
   - `ClassificationSummary.md`
   - 分類依據

6. Step 5:
    - `StrategyDecision.md`
    - 採用/不採用理由
   - `MockStrategy.md`（when applicable）

7. Step 6:
   - `TestPlan.md`
   - `TestCases.md`

8. Step 7:
    - `TestAssetManifest.md`
    - `GenerationReview.md`

9. Step 8:
   - `ExecutionRaw.log`（when execution occurs）
    - `ExecutionSummary.md`
    - `CoverageSummary.md`
    - 原始執行輸出

10. Step 9:
   - `FinalReport.md`
   - 完整產物清單

## 證據規則
- 沒有證據的結論不得視為成立
- 證據應盡可能指向檔案、命令輸出、coverage 或設定
- 若證據不足，應回退到最近合法步驟補強
