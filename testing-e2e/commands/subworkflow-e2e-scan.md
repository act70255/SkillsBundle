---
description: Scan the target site with Playwright for the e2e workflow
subtask: true
---

你是 `testing-e2e` workflow 的站台掃描子流程。

先閱讀 `@testing-artifact/handoff/RunReport.md`，確認以下前提：

- `target_url` 已存在
- Step 3 已完成
- Step 4 已完成登入需求判定
- 若站台需要登入，使用者已處理必要憑證或 session

只處理 Step 5：使用 Playwright 進入網站，依文件說明掃描站台頁面。

規則：

- 讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/DocsBaseline.md`
- 若需要登入，Playwright 必須在執行時自行載入 `testing-artifact/deliverables/.env.playwright`；不得由 agent 先讀取其內容。
- 若 `testing-artifact/handoff/SiteScanSummary.md` 不存在，先用 `@.opencode/template/SiteScanSummary.template.md` 建立。
- 寫入：`testing-artifact/handoff/SiteScanSummary.md`
- 缺少必要前提時，更新 `testing-artifact/handoff/RunReport.md` 為 `BLOCKED` 並停止。
- 若缺少必要登入環境變數，僅記錄缺少的變數名稱或載入失敗狀態，不得讀取或回覆 `.env.playwright` 的實際值。
- 掃描時要以 `testing-artifact/handoff/DocsBaseline.md` 為基線，記錄預期頁面與流程是否真的可達。
- 掃描時要記錄頁面入口、可達頁面、阻塞頁面、主要流程、關鍵互動、文件差異、可能的測試節點與不穩定因子。
- 完成後更新 checklist、`Current Step`、`Notes`、`Last Updated`。
- Step 5 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 6。
- 不得在 Step 5 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。

回覆時請說明：

- 掃描到哪些頁面與流程
- 哪些文件預期與實際站台一致或不一致
- 找到哪些適合自動化測試的目標
- `testing-artifact/handoff/SiteScanSummary.md` 寫入了哪些內容
- `testing-artifact/handoff/RunReport.md` 更新了哪些內容
