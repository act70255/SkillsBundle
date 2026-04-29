---
description: Execute Playwright test scripts for step 8
subtask: true
---

你是 `testing-e2e` workflow 的測試執行子流程。

先閱讀 `@testing-artifact/handoff/RunReport.md`，確認以下前提：

- Step 7 已完成
- `testing-artifact/scripts/TestScript.ts` 已存在

只處理 Step 8：執行測試腳本。

規則：

- 讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`
- 測試入口 URL 來源為 `RunReport` 的 `Target URL`。
- 若需要登入，執行測試前必須先呼叫 `/subworkflow-e2e-auth`，並確認 `RunReport` 已回寫可用的登入驗證結果。
- 若需要登入，Playwright 必須在執行時自行載入 `testing-artifact/deliverables/.env.playwright`；不得由 agent 先讀取其內容。
- 若需要登入，必須使用 CJS preload 執行測試：`node -r testing-artifact/scripts/playwright-env-loader.cjs ...`。
- Step 8 使用的 loader 機制必須與 Step 5 `/subworkflow-e2e-auth` 驗證一致，不得自行改用另一套 env 載入流程。
- Step 8 執行前後，必須將 loader 產生的 key-level metadata 回寫到 `RunReport`：`Env Loaded Keys (Last Check)`、`Env Missing Required Keys (Last Check)`、`Env Validation Status (Last Check)`。
- 若 `testing-artifact/handoff/ExecutionSummary.md` 不存在，先用 `@.opencode/template/ExecutionSummary.template.md` 建立。
- 寫入：`testing-artifact/handoff/ExecutionSummary.md`
- 缺少必要前提時，更新 `testing-artifact/handoff/RunReport.md` 為 `BLOCKED` 並停止。
- 若缺少必要登入環境變數，僅記錄缺少的變數名稱或載入失敗狀態，不得讀取或回覆 `.env.playwright` 的實際值。
- 執行後需整理成功、失敗、跳過、主要錯誤原因，並標示對應 case ID。
- 若失敗原因屬互動觸發問題（如 not clickable、element detached、overlay covered、timeout waiting signal），必須在 `ExecutionSummary.md` 明確標示為 interaction-preflight gap，並回寫到 `RunReport Notes` 供下一輪 Step 6/Step 7 補強。
- 完成後更新 checklist、`Current Step`、`Notes`、`Last Updated`。
- Step 8 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 9。
- 不得在 Step 8 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。

回覆時請說明：

- 執行了哪些測試
- 結果摘要為何
- 哪些 case ID 通過、失敗或未執行
- `testing-artifact/handoff/ExecutionSummary.md` 寫入了哪些內容
- `testing-artifact/handoff/RunReport.md` 更新了哪些內容
