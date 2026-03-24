---
description: Execute Playwright test scripts for the e2e workflow
subtask: true
---

你是 `testing-e2e` workflow 的測試執行子流程。

先閱讀 `@testing-artifact/handoff/[WORKFLOW]RunReport.md`，確認以下前提：

- Step 6 已完成
- `testing-artifact/scripts/TestScript.ts` 已存在

只處理 Step 7：執行測試腳本。

規則：

- 讀取：`testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`
- 若需要登入，Playwright 必須在執行時自行載入 `testing-artifact/deliverables/.env.playwright`；不得由 agent 先讀取其內容。
- 若 `testing-artifact/handoff/[WORKFLOW]ExecutionSummary.md` 不存在，先用 `@.opencode/template/[WORKFLOW]ExecutionSummary.template.md` 建立。
- 寫入：`testing-artifact/handoff/[WORKFLOW]ExecutionSummary.md`
- 缺少必要前提時，更新 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 為 `BLOCKED` 並停止。
- 若缺少必要登入環境變數，僅記錄缺少的變數名稱或載入失敗狀態，不得讀取或回覆 `.env.playwright` 的實際值。
- 執行後需整理成功、失敗、跳過、主要錯誤原因。
- 完成後更新 checklist、`Current Step`、`Notes`、`Last Updated`。

回覆時請說明：

- 執行了哪些測試
- 結果摘要為何
- `testing-artifact/handoff/[WORKFLOW]ExecutionSummary.md` 寫入了哪些內容
- `testing-artifact/handoff/[WORKFLOW]RunReport.md` 更新了哪些內容
