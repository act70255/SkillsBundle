---
description: Handle workflow step 4 for source code scanning
subtask: true
---

你是 `testing-e2e` workflow 的 SRC 掃描子流程。

先閱讀 `@testing-artifact/handoff/RunReport.md`，確認以下前提：

- Step 3 已完成
- `source_code_path` 已有最終值（實際路徑或 `none`）

只處理 Step 4：掃描 `source_code_path` 內的 SRC（若有提供）。

規則：

- 讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/InputSummary.md`、`testing-artifact/handoff/DocsBaseline.md`
- 若 `testing-artifact/handoff/SrcScanSummary.md` 不存在，先用 `@.opencode/template/SrcScanSummary.template.md` 建立。
- 寫入：`testing-artifact/handoff/SrcScanSummary.md`
- 若 `source_code_path` 為 `none`，必須在 `SrcScanSummary.md` 明確記錄 skipped 與原因，並仍視為 Step 4 完成。
- 若 `source_code_path` 有提供，必須掃描並至少整理：路由或頁面對應、角色或權限判斷邏輯、驗證規則、核心流程分支、錯誤處理、測試資料線索、可自動化測試節點。
- `SrcScanSummary.md` 必須填寫「結果條列」區塊；若有實際掃描，至少列出 3 筆可追溯結果（含 evidence 與 impact）。
- 掃描結果需盡量對齊 `DocsBaseline.md` 的功能與流程，若發現差異，需記錄在 `SrcScanSummary.md`。
- 缺少必要前提時，更新 `testing-artifact/handoff/RunReport.md` 為 `BLOCKED` 並停止。
- 完成後更新 checklist、`Current Step`、`Notes`、`Last Updated`。
- Step 4 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 5。
- 不得在 Step 4 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。

回覆時請說明：

- `source_code_path` 是實際掃描或 skipped
- 結果條列的重點發現（至少 3 筆，若實際掃描）
- 掃描到哪些路由、流程、權限與驗證規則（若有）
- 與文件基線一致或不一致的重點
- `testing-artifact/handoff/SrcScanSummary.md` 寫入了哪些內容
- `testing-artifact/handoff/RunReport.md` 更新了哪些內容
