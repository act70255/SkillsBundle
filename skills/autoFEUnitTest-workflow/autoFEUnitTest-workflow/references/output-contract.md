# Output Contract

## 必要產物
- `RunReport.md`
- `InputSummary.md`
- `NormalizedInput.md`
- `ClassificationSummary.md`
- `StrategyDecision.md`
- `TestPlan.md`
- `TestCases.md`
- `TestAssetManifest.md`
- `GenerationReview.md`
- `ExecutionRaw.log`
- `ExecutionSummary.md`
- `CoverageSummary.md`
- `FinalReport.md`

## 條件式產物
- `MockStrategy.md`
- `EnvTemplate.example`
- `GapReport.md`

## 契約規則
- 主要產物在完整版 workflow 下原則上都應存在
- 若產物不適用或被合併，必須在 `RunReport.md` 說明
- 各產物至少要保留標題、摘要、依據、風險或狀態欄位

## RunReport 狀態欄位規則
- `RunReport.md` 應記錄條件式產物與重要治理產物的狀態，例如 `generated`、`not_applicable`、`pending`
- 至少應覆蓋：`Mock Strategy`、`Gap Report`、`Generation Review`、`Execution Raw`
- DONE gate 前，這些狀態值必須與實際產物一致

狀態值語意：
- `pending` = 尚未判定或尚未產生
- `generated` = 已依規則產生並可追蹤
- `not_applicable` = 經 workflow 判定後不適用

## 必要產物補充規則
- `GenerationReview.md` 為 Step 7 的必要治理產物，因為腳本生成品質 gate 需要留痕
- `ExecutionRaw.log` 為 Step 8 的必要執行證據，若沒有原始執行證據，不得進入 `DONE`
- `ExecutionRaw.log` 為標準產物名稱；若工具輸出其他檔名，必須正規化到此標準路徑
- 若 Step 8 因前置條件阻塞而未實際執行測試，`ExecutionRaw.log` 可標記為 `not_applicable`，但 `ExecutionSummary.md` 與 `CoverageSummary.md` 仍需存在

## 條件式模板對應
- `templates/MockStrategy.template.md`
- `templates/EnvTemplate.example`
- `templates/GapReport.template.md`

## MockStrategy 補充規則
- 若 Step 5 判定 `env` 或外部依賴為複雜情境，必須獨立產出 `MockStrategy.md`
- 若 mock 策略簡單，可將摘要保留在 `StrategyDecision.md`，並在 `RunReport.md` 記錄 `MockStrategy.md = not_applicable`

## GapReport 補充規則
- 若 Step 2 補件後仍存在 `missing_blocking` 欄位，必須獨立產出 `GapReport.md`
- 若缺口已解除，可不獨立產出，並在 `InputSummary.md` 與 `RunReport.md` 留下補件紀錄
