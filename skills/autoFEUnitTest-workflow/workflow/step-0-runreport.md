# Step 0 - RunReport 初始化與續跑檢查

## Scope
只處理 Step 0。

## Entry Gate
- 每次叫用 workflow 時，必須先執行 Step 0
- 若 `RunReport.md` 不存在，建立新檔（新執行）
- 若 `RunReport.md` 已存在，讀取並確認 `Status` 與 `Current Step`，決定是否為續跑及從哪個步驟繼續

## Process
1. 確認 `RunReport.md` 是否存在
2. 若不存在，依模板建立新檔
3. 若存在，檢查 `Status`、`Current Step`、產物路徑、產物狀態欄位與檢查清單
4. 判斷本次為新執行、合法續跑，或需回退重跑的續跑
5. 若發現產物與證據不一致，回退到最近可重建證據的步驟，並清場下游欄位：
   - 判斷原則：回退目標應是「最早能合法重建該不一致證據鏈的步驟」，不得只修最終報告而跳過中間證據
   - `InputSummary.md`、`Missing Required Inputs`、`Input Validation Status` 不一致時，回退至 Step 1
   - `NormalizedInput.md` 缺失或與 `Normalization Status = passed` 不一致時，回退至 Step 3，並將 `Normalization Status` 及其後所有 gate 清場為 `not_checked`
   - `ClassificationSummary.md` 缺失或與 `Classification Status = passed` 不一致時，回退至 Step 4，並將 `Classification Status` 及其後所有 gate 清場為 `not_checked`
   - `StrategyDecision.md`、`MockStrategy.md` 或 `acceptance_rules` 證據鏈不一致時，回退至 Step 5，並將 `Strategy Gate Status` 及其後所有 gate 清場為 `not_checked`
   - `TestPlan.md`、`TestCases.md` 缺失或與 `Planning Gate Status` 不一致時，回退至 Step 6，並將 `Planning Gate Status`、`Script Generation Gate`、`Execution Gate`、`Verification DoD Status` 清場為 `not_checked`
   - `TestAssetManifest.md`、`GenerationReview.md` 缺失或與 `Script Generation Gate` 不一致時，回退至 Step 7，並將 `Script Generation Gate`、`Execution Gate`、`Verification DoD Status` 清場為 `not_checked`
   - `ExecutionRaw.log`、`test-report-html/index.html`、`coverage-html/index.html`、`ExecutionSummary.md`、`CoverageSummary.md` 缺失或與 `Execution Gate` 不一致時，回退至 Step 8，並將 `Execution Gate`、`Verification DoD Status` 清場為 `not_checked`
   - `FinalReport.md` 缺失，或 `Verification DoD Status` / 最終 `Status` 與實際產物不一致時，回退至 Step 9，並將 `Verification DoD Status` 清場為 `not_checked`
   - 若回退目標步驟之後存在獨立產物狀態欄位（如 `Mock Strategy Status`、`Gap Report Status`、`Generation Review Status`、`Execution Raw Status`、`Test Result HTML Report Status`、`Coverage HTML Report Status`），且其對應產物需重建，應一併重設為 `pending`
6. 將 `Status` 更新為 `IN_PROGRESS`（除非實際阻塞仍存在且本次僅完成續跑判定，不得強行覆寫為 `DONE` / `FAILED`）
7. 設定 `Current Step = Step 0`
8. 刷新 `Last Updated`
9. 完成 Step 0 後，勾選 Step 0 檢查清單並將 `Current Step` 更新為下一個合法步驟：若為新執行，下一步為 Step 1；若為合法續跑，依 `RunReport.md` 的現有 `Current Step` 與 gate 狀態決定續跑起點（`Input Validation Status = passed` 且後續 gate 有進度時，跳過已完成的步驟直接設定至最近未完成的步驟）；若為回退重跑，則設定為上方判定出的最近可重建證據步驟

## Exit criteria
- `RunReport.md` 已存在且結構完整
- 已記錄本次 workflow 狀態與目前步驟
- 條件式與必要產物狀態欄位存在且可追蹤
- 已決定續跑起點或回退重跑起點
- 若發生回退，受影響 gate 與產物狀態欄位已完成清場

## Skill-local resources
- Template: `<skill_root>/templates/RunReport.template.md`
- Rules: `<skill_root>/governance.md`
