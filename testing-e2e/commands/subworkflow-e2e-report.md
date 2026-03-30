---
description: Generate the final test report for step 9
subtask: true
---

你是 `testing-e2e` workflow 的報告子流程。

先閱讀 `@testing-artifact/handoff/RunReport.md`，確認以下前提：

- Step 8 已完成
- 已有足夠的執行結果可整理報告

只處理 Step 9：產出測試報告。

規則：

- 讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/ExecutionSummary.md`、`testing-artifact/handoff/ExecutionRaw.json`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`
- 若 `testing-artifact/deliverables/TestReport.md` 不存在，先用 `@.opencode/template/TestReport.template.md` 建立。
- 寫入：`testing-artifact/deliverables/TestReport.md`
- 缺少必要前提時，更新 `testing-artifact/handoff/RunReport.md` 為 `BLOCKED` 並停止。
- 報告需包含測試範圍、執行結果、失敗案例、未覆蓋範圍、殘餘風險與建議。
- 報告需回扣 `TestPlan`、`TestCases` 與 `ExecutionSummary`，保留案例追溯與文件差異造成的風險說明。
- `TestReport.md` 不可只提供 summary；必須新增「測試案例逐項結果」段落，逐筆列出每個 case 的 Case ID、名稱/目的、狀態（PASS/FAIL/BLOCKED/SKIPPED）、主要驗證點、失敗原因（若有）、對應證據（log / 截圖 / error 片段）。
- 若 `ExecutionSummary.md` 無法提供完整逐項細節，必須改以 `testing-artifact/handoff/ExecutionRaw.json` 補齊每個 case 的結果，再回填到 `TestReport.md`。
- 完成後將報告路徑寫入 `Artifacts` 的 `testing-artifact/deliverables/` 區塊，更新 checklist、`Current Step`、`Last Updated`，並將 `Status` 設為 `DONE`。
- Step 9 完成後應直接以 `DONE` 結束 workflow，不得再要求使用者輸入 `continue` 或其他批准訊號。
- Step 9 完成並進入 `DONE` 時，回覆必須直接提供測試總結結果，至少包含：整體結果、Passed / Failed / Blocked / Skipped 摘要、主要失敗原因、未覆蓋範圍、殘餘風險，以及 `testing-artifact/deliverables/TestReport.md` 與 `testing-artifact/handoff/ExecutionSummary.md` 路徑。

回覆時請說明：

- 產出的報告內容摘要
- 最終 workflow 狀態
- 對話中輸出的最終測試總結結果
- 已覆蓋、未覆蓋與阻塞範圍如何整理
- `testing-artifact/deliverables/TestReport.md` 寫入了哪些內容
- `testing-artifact/handoff/RunReport.md` 更新了哪些內容
