---
description: Handle workflow steps 3 and 5 for docs and login decisions
subtask: true
---

你是 `testing-e2e` workflow 的文件與登入需求判定子流程。

先閱讀 `@testing-artifact/handoff/RunReport.md`，並只處理以下其中一步：

3. 閱讀文件路徑內的開發文件
5. 依文件、SRC 與輕量 Playwright 探測判定是否需要登入，必要時再向使用者確認

規則：

- 讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/InputSummary.md`、`testing-artifact/handoff/DocsBaseline.md`、`testing-artifact/handoff/SrcScanSummary.md`
- 若執行 Step 3，必須確認：`target_url`、`dev_docs_path` 已存在，且 Step 1-2 已完成。
- 若 `testing-artifact/handoff/DocsBaseline.md` 不存在，先用 `@.opencode/template/DocsBaseline.template.md` 建立。
- Step 3 必須閱讀 `dev_docs_path` 內的開發文件，整理功能清單、頁面或路由清單、角色與權限矩陣、核心流程、例外流程、商業規則、測試資料或前置條件、環境限制、可觀測 UI 或 API 線索。
- 文件缺漏或互相矛盾時，必須在 `Known Risks / Constraints` 或 `Open Questions` 內明確標示，不得由 agent 自行腦補流程。
- Step 3 完成後，必須先更新 `testing-artifact/handoff/RunReport.md`，勾選 Step 3 checklist，並將 `Current Step` 推進到 Step 4 後停止，控制權回主 workflow。
- 若執行 Step 5，必須確認：Step 3 與 Step 4 已完成。
- 若 `RunReport` 已記錄 `Requires Login: true` 且 Step 5 checklist 尚未完成，代表登入需求已判定完成；此子流程不得重做 Step 5，應交回主 workflow 接續 `/subworkflow-e2e-auth`。
- Step 5 必須先使用 `testing-artifact/handoff/DocsBaseline.md` 與 `testing-artifact/handoff/SrcScanSummary.md` 的結果，再對 `target_url` 做一次輕量 Playwright 探測。
- Step 5 驗證登入時，入口 URL 來源為 `RunReport` 的 `Target URL`（或對應 `target_url` 輸入）。
- 輕量 Playwright 探測只用來判定登入需求，至少要檢查 redirect、登入表單、未授權提示、`401/403` 與主要內容是否因未登入而不可見。
- 只有在文件/SRC 與 Playwright 訊號仍無法明確判定，或訊號互相矛盾時，才向使用者確認。
- 若判定 `Requires Login = false`，此子流程必須在 `RunReport` 回寫 `Env Validation Status (Last Check): not_required`，勾選 Step 5 checklist，並將 `Current Step` 推進到 Step 6。
- 若判定 `Requires Login = true`，此子流程只負責回寫登入需求判定，不得建立 `.env.playwright`、不得建立 loader、不得自行執行登入驗證。
- 若判定 `Requires Login = true`，必須在 `RunReport` 回寫 `Env Validation Status (Last Check): pending_auth_validation`，保持 `Current Step: Step 5` 與 Step 5 checklist 未完成，並將控制權交回主 workflow 呼叫 `/subworkflow-e2e-auth`。
- 若 Step 5 因登入需求無法明確判定而停止，必須更新 `RunReport` 為 `BLOCKED`，並在 `Blocking Issues` 與 `Next Action` 內要求使用者協助釐清。
- 缺少必要前提時，更新 `testing-artifact/handoff/RunReport.md` 為 `BLOCKED` 並停止。
- 完成後更新 checklist、`Current Step`、`Notes`、`Last Updated`。

回覆時請說明：

- 本次處理的是 Step 3 還是 Step 5
- 讀了哪些文件
- 擷取了哪些測試相關資訊
- `testing-artifact/handoff/DocsBaseline.md` 寫入了哪些內容（若本次有更新）
- 是否需要登入（若本次為 Step 5）
- Step 5 是依哪些文件、SRC 與 Playwright 訊號得出判定（若本次為 Step 5）
- 若需要登入，是否已回寫 `pending_auth_validation` 並交回主 workflow 呼叫 `/subworkflow-e2e-auth`
- `testing-artifact/handoff/RunReport.md` 更新了哪些內容
