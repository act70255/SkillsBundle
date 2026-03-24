---
description: Scan the target site with Playwright for the e2e workflow
subtask: true
---

你是 `testing-e2e` workflow 的站台掃描子流程。

先閱讀 `@testing-artifact/handoff/[WORKFLOW]RunReport.md`，確認以下前提：

- `target_url` 已存在
- Step 3 已完成
- Step 4 已完成登入需求判定
- 若站台需要登入，使用者已處理必要憑證或 session

只處理 Step 5：使用 Playwright 進入網站，依文件說明掃描站台頁面。

規則：

- 讀取：`testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/handoff/[WORKFLOW]DocsBaseline.md`
- 若需要登入，Playwright 必須在執行時自行載入 `testing-artifact/deliverables/.env.playwright`；不得由 agent 先讀取其內容。
- 若 `testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md` 不存在，先用 `@.opencode/template/[WORKFLOW]SiteScanSummary.template.md` 建立。
- 寫入：`testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md`
- 缺少必要前提時，更新 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 為 `BLOCKED` 並停止。
- 若缺少必要登入環境變數，僅記錄缺少的變數名稱或載入失敗狀態，不得讀取或回覆 `.env.playwright` 的實際值。
- 掃描時要記錄頁面入口、主要流程、關鍵互動、可能的測試節點。
- 完成後更新 checklist、`Current Step`、`Notes`、`Last Updated`。

回覆時請說明：

- 掃描到哪些頁面與流程
- 找到哪些適合自動化測試的目標
- `testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md` 寫入了哪些內容
- `testing-artifact/handoff/[WORKFLOW]RunReport.md` 更新了哪些內容
