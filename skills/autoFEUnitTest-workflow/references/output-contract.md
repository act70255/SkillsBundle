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
- `test-report-html/index.html`
- `coverage-html/index.html`
- `ExecutionSummary.md`
- `CoverageSummary.md`
- `FinalReport.md`

## 條件式產物
- `MockStrategy.md`
- `EnvTemplate.example`
- `GapReport.md`

## 契約規則
- 主要產物在完整版 workflow 下都應存在，且在 `DONE` 前不得省略、合併或以摘要取代
- 條件式產物若不適用，必須在 `RunReport.md` 以 `not_applicable` 明確記錄
- 各產物至少要保留標題、摘要、依據、風險或狀態欄位
- `TestCases.md` 必須包含 `Function Coverage Mapping` 區塊；新增/修改 function 需能追溯到至少 1 筆 `Case ID`，未覆蓋者僅允許以 `justified-exception` 保留並附替代證據
- `TestPlan.md` 必須包含 `File Coverage Matrix` 區塊；每個 in-scope 業務 JS 至少 1 筆案例，高風險檔案至少 2 筆案例
- `InputSummary.md` 與 `StrategyDecision.md` 需保留 `behavior_spec` / `acceptance_rules` 的來源型態（provided/derived）與推導證據；僅在無法推導或推導衝突時可標記阻塞
- 所有產物必須落在 workspace 內的 `testing-artifact/` 底下；不得輸出到工作區外或其他平行目錄

## RunReport 狀態欄位規則
- `RunReport.md` 應記錄條件式產物與重要治理產物的狀態，例如 `generated`、`not_applicable`、`pending`
- 至少應覆蓋：`Mock Strategy`、`Gap Report`、`Generation Review`、`Execution Raw`、`Test Result HTML Report`、`Coverage HTML Report`
- 此外，所有治理 gate 欄位（`Input Validation Status`、`Test Env Status`、`Normalization Status`、`Classification Status`、`Strategy Gate Status`、`Planning Gate Status`、`Script Generation Gate`、`Execution Gate`、`Verification DoD Status`）亦須在 DONE gate 前保持最新狀態
- DONE gate 前，所有狀態值必須與實際產物一致

狀態值語意：
- `pending` = 尚未判定或尚未產生
- `generated` = 已依規則產生並可追蹤
- `not_applicable` = 經 workflow 判定後不適用

## 必要產物補充規則
- `GenerationReview.md` 為 Step 7 的必要治理產物，因為腳本生成品質 gate 需要留痕
- `ExecutionRaw.log` 為 Step 8 的必要執行證據，若沒有原始執行證據，不得進入 `DONE`
- `ExecutionRaw.log` 為標準產物名稱；若工具輸出其他檔名，必須正規化到此標準路徑
- `test-report-html/index.html` 為 Step 8 的必要 HTML 執行報告；成功執行 Step 8 時必須產出，且若工具輸出其他檔名或目錄，必須正規化到此標準路徑
- `coverage-html/index.html` 為 Step 8 的必要 HTML coverage 報告；成功執行 Step 8 時必須產出，且若工具輸出其他檔名或目錄，必須正規化到此標準路徑
- 若 Step 8 因前置條件阻塞而未實際執行測試，`ExecutionRaw.log`、`test-report-html/index.html`、`coverage-html/index.html` 可標記為 `not_applicable`，但 `ExecutionSummary.md` 與 `CoverageSummary.md` 仍需存在
- `ExecutionSummary.md` 應能記錄 `Execution Gate Status`、前置條件狀態與 blocker 原因（注意：`ExecutionSummary.md` 內部欄位名稱為 `Execution Gate Status:`，對應 `RunReport.md` 中的 `Execution Gate:` 欄位，語意相同；此命名差異為歷史原因，兩者均為合法欄位名稱，verify-doc-consistency 已對應此差異）
- `ExecutionSummary.md` 應能記錄 `Test Result HTML Report Path:`
- `CoverageSummary.md` 應能記錄 `Status = measured / not_applicable`
- `CoverageSummary.md` 應能記錄 `Coverage HTML Report Path:`
- `InputSummary.md`、`NormalizedInput.md`、`ClassificationSummary.md`、`TestAssetManifest.md` 同樣屬於 `DONE` 前不可缺少的必要治理產物
- `TestAssetManifest.md` 應以表格格式呈現，至少包含 Script Path、Case IDs（可追溯至 `TestCases.md`）、Covered Functions 與 Status 欄位（合法值：`generated` / `pending`）
- `TestAssetManifest.md` 的測試腳本表格應額外包含 `Covered Functions` 欄位，用於 Step 7/Step 8 的 Case-to-Function-to-Script 與 coverage 交叉檢核
- `CoverageSummary.md` 應包含 `Coverage Zero Gate`（`Coverage Zero Check`、`Root Cause Category`、`Next Fix Action`）；若 `Coverage Status = measured` 且四項 coverage 全為 `0%`，Step 8 最終狀態不得視為成功
- `CoverageSummary.md` 應包含 `Uncovered Business Files` 區塊；若任一 in-scope 業務 JS 為 `Statements = 0%` 且 `Branches = 0%`，Step 8 最終狀態應為 `FAILED`

## 條件式模板對應
- `templates/MockStrategy.template.md`
- `templates/EnvTemplate.example`
- `templates/GapReport.template.md`

## MockStrategy 補充規則
- 若 Step 5 判定 `env` 或外部依賴為複雜情境，必須獨立產出 `MockStrategy.md`
- 若 mock 策略簡單，可將摘要保留在 `StrategyDecision.md`，並在 `RunReport.md` 記錄 `Mock Strategy Status = not_applicable`

## GapReport 補充規則
- 若 Step 2 補件後仍存在 `missing_blocking` 欄位，必須獨立產出 `GapReport.md`
- `GapReport.md` 可記錄 `env_blocker` 類型，但不得把 `test_env` 描述成「尚未提問完成的普通補件欄位」
- 若缺口已解除，可不獨立產出，並在 `InputSummary.md` 與 `RunReport.md` 留下補件紀錄
- 若 `GapReport.md` 已產生（`Gap Report Status = generated`），且後續回合缺口已被補齊，應在 `GapReport.md` 中將 `Status` 更新為 `resolved`，並在 `RunReport.md` 的 `備註` 記錄解除說明；`GapReport.md` 本身保留作為歷史紀錄
