---
description: Generate the final test report for the e2e workflow
subtask: true
---

你是 `testing-e2e` workflow 的報告子流程。

先閱讀 `@testing-artifact/handoff/[WORKFLOW]RunReport.md`，確認以下前提：

- Step 7 已完成
- 已有足夠的執行結果可整理報告

只處理 Step 8：產出測試報告。

規則：

- 讀取：`testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/handoff/[WORKFLOW]ExecutionSummary.md`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`
- 若 `testing-artifact/deliverables/TestReport.md` 不存在，先用 `@.opencode/template/[WORKFLOW]TestReport.template.md` 建立。
- 寫入：`testing-artifact/deliverables/TestReport.md`
- 缺少必要前提時，更新 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 為 `BLOCKED` 並停止。
- 報告需包含測試範圍、執行結果、失敗案例、風險與建議。
- 完成後將報告路徑寫入 `Artifacts` 的 `testing-artifact/deliverables/` 區塊，更新 checklist、`Current Step`、`Last Updated`，並將 `Status` 設為 `DONE`。

回覆時請說明：

- 產出的報告內容摘要
- 最終 workflow 狀態
- `testing-artifact/deliverables/TestReport.md` 寫入了哪些內容
- `testing-artifact/handoff/[WORKFLOW]RunReport.md` 更新了哪些內容
