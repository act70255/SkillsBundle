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

3. RunReport 維護規則：
   - 進入任一步驟時，`Current Step` 應反映目前正在執行的步驟
   - 步驟成功完成時，應勾選對應檢查清單並將 `Current Step` 更新為下一個合法步驟
   - 步驟若 `BLOCKED`、`FAILED` 或仍需處理，`Current Step` 應停留在目前步驟，並同步更新阻塞/失敗原因
   - 條件式產物與治理產物狀態欄位必須與實際產物一致
   - 每次更新 `RunReport.md` 時，必須同步刷新 `Last Updated`
   - 若流程被阻塞，必須更新 `阻塞問題`
   - 若流程未阻塞但有失敗或待修正事項，必須更新 `備註`

4. Gate 欄位狀態值：
   - `not_checked` = 尚未檢查
   - `passed` = 已完成且通過 gate
   - `blocked` = 因外部條件、缺口或證據不足而無法通過
   - `failed` = 已執行檢查，但結果不符合 gate 要求

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
    - `ExecutionSummary.md`
    - `CoverageSummary.md`
    - `FinalReport.md`
    以上必要產物齊全後，才可標記為 `DONE`

   補充：
    - 若 Step 8 因前置條件阻塞而未實際執行測試，`ExecutionRaw.log` 可標記為 `not_applicable`
    - 但 `ExecutionSummary.md` 必須明確記錄 `BLOCKED` 原因，`CoverageSummary.md` 必須明確記錄 `not_applicable`

8. 最終狀態映射：
   - `DONE` = 必要產物齊全、證據鏈完整、DoD 通過
   - `BLOCKED` = 缺必要輸入、外部依賴、契約或證據，無法合法繼續
   - `FAILED` = 可執行步驟已完成，但測試結果或驗收規則不通過
   - `IN_PROGRESS` = 尚有後續修正或整理工作，但目前不屬於外部阻塞

9. Step-level Status 映射：
   - Step 1 / 2 / 4 / 5 / 8 若因缺資料、缺依賴、缺契約或前置條件不成立而無法合法前進，`Status` 應為 `BLOCKED`
   - Step 7 若腳本品質 gate 未通過但可持續修正，`Status` 應維持 `IN_PROGRESS`
   - Step 9 若 DoD 不通過且屬外部阻塞，`Status` 應為 `BLOCKED`
   - Step 9 若 DoD 不通過但問題屬於結果不符合驗收規則，`Status` 應為 `FAILED`

## 必要報告原則
- 必須可追溯輸入來源
- 必須可追溯分類依據
- 必須可追溯策略決策
- 必須可追溯測試案例與執行結果
- 必須記錄阻塞項、風險與未覆蓋範圍

## 禁止反模式
- 因為想完成流程而把 `BLOCKED` 改寫成 `FAILED`
- 沒有明確依據就判定框架、策略或覆蓋率足夠
- 缺 `RunReport` 或缺主要產物仍宣告完成
- 沒有保留原始執行證據卻輸出最終結論

## 標準化範圍
- 本治理規則為前端單元測試 workflow 的共用核心
- 專案設定可調整工具預設與目錄，但不得改變治理語意
