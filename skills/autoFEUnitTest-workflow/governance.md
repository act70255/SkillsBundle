# Auto FE Unit Test Governance

## 非協商規則
1. 狀態語意鎖定：
   - `NEW` = 尚未開始執行
   - `IN_PROGRESS` = 已開始但尚未完成
   - `BLOCKED` = 缺必要資訊、前置條件或證據不足
   - `DONE` = 必要產物齊全且證據鏈完整
   - `FAILED` = 已完成可執行步驟，但結果不符合驗收規則

2. Step gate 規則：
   - 每一步都要有 `entry gate` 與 `exit evidence`
   - 前一步未完成，不得進下一步
   - 缺資料時應回到補件，不得跳步猜測
   - 若流程要求回退到較早 step 重跑 gate，對應 gate 狀態必須先重設為 `not_checked`
   - 若 Step 0 判定 `RunReport.md`、產物與證據鏈不一致，必須回退到最近可重建該證據的步驟；回退後，該步驟之後的 gate 狀態必須清場為 `not_checked`，相依的產物狀態欄位必須重設為 `pending`，不得沿用舊證據假裝續跑

3. RunReport 維護規則：
   - 進入任一步驟時，`Current Step` 應反映目前正在執行的步驟
   - 步驟成功完成時，應勾選對應檢查清單並將 `Current Step` 更新為下一個合法步驟
   - 步驟若 `BLOCKED`、`FAILED` 或仍需處理，`Current Step` 應停留在目前步驟，並同步更新阻塞/失敗原因
   - 例外：若步驟的任務是「驗證並記錄輸入狀態」（Step 1、Step 2），即使驗證結果為 BLOCKED，仍應勾選該 step 的清單以表示「驗證任務已執行並記錄結果」，並將 `Current Step` 更新為下一個待處理步驟（Step 1 → Step 2，Step 2 → Step 1 重跑）
   - 例外：Step 8 的任務包含「記錄阻塞狀態並產出阻塞產物（`ExecutionSummary.md` 與 `CoverageSummary.md`）」；若前置條件不成立但阻塞產物均已完整產出，仍應勾選 Step 8 清單並將 `Current Step` 更新為 Step 9，以允許最終報告繼續進行
   - 若 Step 2 補件完成並要求回到 Step 1，必須將 `Input Validation Status` 重設為 `not_checked`；`Missing Required Inputs` 的清空由 Step 1 重跑驗證通過時執行（Step 1 是 `Missing Required Inputs` 的唯一寫入來源）
   - 若 Step 2 偵測到 Step 1 執行異常（`Input Validation Status = blocked` 但 `Missing Required Inputs` 為空），Step 2 有權將 `Current Step` 倒退至 Step 1（此為修正前步驟執行異常的特例，授權此類回退行為），並在 `RunReport.md` 的 `阻塞問題` 記錄此異常
   - Step 2 只負責補齊需要使用者提供的輸入缺口；若阻塞欄位包含 `test_env`，Step 2 只可記錄 `env_blocker`、引導人工修復並回到 Step 1 重跑，不得把 `test_env` 當作一般一問一答補件欄位
   - 條件式產物與治理產物狀態欄位必須與實際產物一致
   - 每次更新 `RunReport.md` 時，必須同步刷新 `Last Updated`
   - 若流程被阻塞，必須更新 `阻塞問題`
   - 若流程未阻塞但有失敗或待修正事項，必須更新 `備註`

4. Gate 欄位狀態值：
   - `not_checked` = 尚未檢查
   - `passed` = 已完成且通過 gate
   - `blocked` = 因外部條件、缺口或證據不足而無法通過
   - `failed` = 已執行檢查，但結果不符合 gate 要求
   - 例外：`Normalization Status` 僅接受 `not_checked / passed`；Step 3 沒有獨立的 `blocked` 或 `failed` 路徑（若 Step 3 Entry Gate 未通過，狀態維持 `not_checked`，BLOCKED 設定由 Step 1/2 負責）
   - 例外：`Execution Gate` 不使用 `failed`（合法值：`not_checked / passed / blocked`）；前置條件不成立時標記為 `blocked`；測試執行失敗的結果以 `Execution Gate = passed` + `ExecutionSummary.md` 中的失敗詳情表達，不以 `failed` 表達（典型使用場景包含 `Planning Gate Status`（計畫稿已建立但需內部修正）與 `Script Generation Gate`（腳本已生成但品質未通過）；注意 `Script Generation Gate` 亦支援 `blocked`（因外部原因無法繼續時使用），與 `failed` 分開使用）

5. 產物狀態欄位值：
   - `pending` = 尚未判定或尚未產生
   - `generated` = 已依規則產生並可追蹤
   - `not_applicable` = 經 workflow 判定後不適用

6. 證據優先規則：
   - 分類、策略、案例、執行結論都要有證據來源
   - 無證據只能列為假設，不得列為完成結果

7. 完成 gate 規則：
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
    以上必要產物齊全後，才可標記為 `DONE`

   補充：
    - 必要產物的完成判定以 `RunReport.md` 的 Step 檢查清單勾選狀態為主要依據；`MockStrategy.md`、`GapReport.md`、`GenerationReview.md`、`ExecutionRaw.log`、`test-report-html/index.html`、`coverage-html/index.html` 另有獨立 Status 欄位（注意：`GenerationReview.md` 是必要治理產物，非條件式產物；「條件式產物」僅指 `MockStrategy.md` 與 `GapReport.md`，兩者在特定條件下才觸發；`GenerationReview.md`、`ExecutionRaw.log`、`test-report-html/index.html`、`coverage-html/index.html` 為每次成功執行 Step 8 時必須產出的必要產物，但三者可因前置條件阻塞而標記為 `not_applicable`）；其餘必要產物（如 `TestPlan.md`、`TestCases.md`、`TestAssetManifest.md` 等）不設獨立 Status 欄位，以產物是否可追蹤路徑與對應 Step 是否勾選為判定依據
    - 若 Step 8 因前置條件阻塞而未實際執行測試，`ExecutionRaw.log`、`test-report-html/index.html`、`coverage-html/index.html` 可標記為 `not_applicable`
    - 但 `ExecutionSummary.md` 必須明確記錄 `BLOCKED` 原因，`CoverageSummary.md` 必須明確記錄 `not_applicable`

8. 最終狀態映射：
   - `DONE` = 必要產物齊全、證據鏈完整、DoD 通過
   - `BLOCKED` = 缺必要輸入、外部依賴、契約或證據，無法合法繼續
   - `FAILED` = 可執行步驟已完成，但測試結果或驗收規則不通過
   - `IN_PROGRESS` = 尚有後續修正或整理工作，但目前不屬於外部阻塞

9. Step-level Status 映射：
   - Step 0 成功完成後，`Status` 應為 `IN_PROGRESS`
   - Step 1 / 2 / 4 若因缺資料、缺依賴、缺契約或前置條件不成立而無法合法前進，`Status` 應為 `BLOCKED`；Step 1 若驗證通過（`Input Validation Status = passed`），且 `Status` 此前為 `BLOCKED`（因前次缺口阻塞所設定），應在 Step 1 成功完成時將 `Status` 更新為 `IN_PROGRESS`，表示缺口已解除可繼續執行；Step 5 本身若因 `acceptance_rules` 仍無法確認（非 Step 4 阻塞導致 Step 5 無法進入，而是 Step 5 執行中無法定案）才設定 `Strategy Gate Status = blocked` 並將 `Status = BLOCKED`；Step 5 Entry Gate 因 `Classification Status = blocked` 而擋住時，BLOCKED 狀態由 Step 4 負責設定，Step 5 不執行也不設定任何欄位
   - Step 3 若因 `Input Validation Status ≠ passed`（例如 Step 1 重跑後仍有 `missing_blocking`）而無法合法繼續，`Status` 應為 `BLOCKED`，`Current Step` 應停留在 Step 1 或 Step 2（視具體阻塞發生點）；Step 3 正常完成時，必須將 `Normalization Status` 設定為 `passed`
   - Step 4 若 `Classification Status = blocked`，補件路徑為 Step 2 → Step 1 → Step 3 → Step 4；重跑前，`Normalization Status` 應重設為 `not_checked`（由 Step 4 阻塞處理時重設，確保 Step 3 重跑時從 `not_checked` 開始），`Classification Status` 亦重設為 `not_checked`（在下次重新執行 Step 4 之前，由補件流程「清場」時重設，確保 Step 4 重跑時從 `not_checked` 開始；「清場」指補件流程在重新進入某步驟前，將該步驟對應的 gate 欄位重設為 `not_checked`，防止殘留舊值影響重跑結果）
   - Step 6 若 `acceptance_rules`、策略依據或案例追溯依據不足而無法合法定稿，`Planning Gate Status` 應為 `blocked`，且 `Status` 應為 `BLOCKED`
   - Step 6 若測試計畫已起草但案例追溯、範圍界線或驗收對應仍需內部修正，`Planning Gate Status` 應為 `failed`，且 `Status` 應維持 `IN_PROGRESS`（前提：`Status` 此前已為 `IN_PROGRESS` 而非 `BLOCKED`）
   - Step 7 的品質 gate 欄位為 `Script Generation Gate`（合法值：`not_checked` / `passed` / `failed` / `blocked`）；若腳本品質未通過（`Script Generation Gate = failed`）但可持續修正，`Status` 應維持 `IN_PROGRESS`；若因外部原因導致無法繼續，`Script Generation Gate = blocked`，`Status` 應為 `BLOCKED`
    - Step 8 正常完成（前置條件成立且執行完畢）時，`Execution Gate = passed`，`Status` 應為 `IN_PROGRESS`；前置條件不成立且阻塞處理完成時，`Execution Gate = blocked`，`Status` 應為 `BLOCKED`；若前置條件成立但必要 HTML 報告無法合法產出，`Execution Gate` 亦應為 `blocked`，`Status` 應為 `BLOCKED`，且 `Current Step` 應停留在 Step 8
   - Step 9 若 DoD 不通過且屬外部阻塞，`Status` 應為 `BLOCKED`
   - Step 9 若 DoD 不通過但問題屬於結果不符合驗收規則，`Status` 應為 `FAILED`
   - Step 9 若 DoD 未通過但尚有可內部整理工作且不屬於外部阻塞，`Status` 應為 `IN_PROGRESS`

10. 測試執行環境自動初始化規則：
    - `test_env` 屬於 governed auto-repairable 輸入，責任歸屬於 Step 1
    - Step 1 必須在輸入驗證期間自動偵測 `package.json`、test runner 設定與 `node_modules` 是否就緒
    - Step 1 不得因 `project_config`、`test_targets`、`behavior_spec` 或其他 required inputs 缺失而延後 `test_env` 偵測與自動初始化
    - 若環境不足，Step 1 依 `strategy-matrix.md` 的框架對應自動執行 `npm init -y` 與 `npm install --save-dev <packages>`
    - 若 `framework_type` 尚未確定，使用最小集合（`vitest jsdom`）並在 `RunReport.md` 備註
    - 自動初始化成功時，必須記錄 `Test Env Status = passed`；失敗時記錄 `Test Env Status = blocked` 並列入 `missing_blocking`
    - Step 2 不負責重新選擇 runner、安裝依賴或驗證 `test_env` 是否恢復；Step 2 只記錄修復路徑，實際驗證仍由 Step 1 重跑負責
    - 前置條件不成立（`Test Env Status ≠ passed`）時，Step 8 不得執行測試，`Execution Gate` 應標記為 `blocked`

## 必要報告原則
- 必須可追溯輸入來源
- 必須可追溯分類依據
- 必須可追溯策略決策
- 必須可追溯測試案例與執行結果
- 必須記錄阻塞項、風險與未覆蓋範圍

## 禁止反模式
- 因為想完成流程而把 `BLOCKED` 改寫成 `FAILED`
- 前置條件不成立時，不得將 `Execution Gate` 標記為 `failed`；應標記為 `blocked` 並記錄缺失的前置條件
- 沒有明確依據就判定框架、策略或覆蓋率足夠
- 缺 `RunReport` 或缺主要產物仍宣告完成
- 沒有保留原始執行證據卻輸出最終結論

## 標準化範圍
- 本治理規則為前端單元測試 workflow 的共用核心
- 專案設定可調整工具預設與目錄，但不得改變治理語意
