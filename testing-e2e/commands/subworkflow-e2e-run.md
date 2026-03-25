---
description: Execute Playwright test scripts for the e2e workflow
subtask: true
---

你是 `testing-e2e` workflow 的測試執行子流程。

先閱讀 `@testing-artifact/handoff/RunReport.md`，確認以下前提：

- Step 6 已完成
- `testing-artifact/scripts/TestScript.ts` 已存在

只處理 Step 7：執行測試腳本。

規則：

- 讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`
- 若需要登入，Playwright 必須在執行時自行載入 `testing-artifact/deliverables/.env.playwright`；不得由 agent 先讀取其內容。
- 若 `testing-artifact/handoff/ExecutionSummary.md` 不存在，先用 `@.opencode/template/ExecutionSummary.template.md` 建立。
- 寫入：`testing-artifact/handoff/ExecutionSummary.md`
- 缺少必要前提時，更新 `testing-artifact/handoff/RunReport.md` 為 `BLOCKED` 並停止。
- 若缺少必要登入環境變數，僅記錄缺少的變數名稱或載入失敗狀態，不得讀取或回覆 `.env.playwright` 的實際值。
- 執行後需整理成功、失敗、跳過、主要錯誤原因，並標示對應 case ID。
- 完成後更新 checklist、`Current Step`、`Notes`、`Last Updated`。
- Step 7 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 8。
- 不得在 Step 7 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。

回覆時請說明：

- 執行了哪些測試
- 結果摘要為何
- 哪些 case ID 通過、失敗或未執行
- `testing-artifact/handoff/ExecutionSummary.md` 寫入了哪些內容
- `testing-artifact/handoff/RunReport.md` 更新了哪些內容
