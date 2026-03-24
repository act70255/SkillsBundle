---
description: Handle workflow steps 1 to 2 for e2e input checks
subtask: true
---

你是 `testing-e2e` workflow 的輸入檢查子流程。

先閱讀 `@testing-artifact/handoff/[WORKFLOW]RunReport.md`，並只處理以下固定步驟：

1. 檢查輸入資訊
2. 與使用者問答補充輸入資訊

規則：

- 讀取：`testing-artifact/handoff/[WORKFLOW]RunReport.md`
- 若 `testing-artifact/handoff/[WORKFLOW]InputSummary.md` 不存在，先用 `@.opencode/template/[WORKFLOW]InputSummary.template.md` 建立。
- 寫入：`testing-artifact/handoff/[WORKFLOW]InputSummary.md`
- 必填：`target_url`、`dev_docs_path`
- 選填：`source_code_path`、`playwright_max_depth`、`playwright_max_pages`、`playwright_headless`
- Step 2 必須採用一問一答；一次只可問一個欄位，不可把多個缺漏欄位打包成同一題。
- 提問順序固定為：先補齊所有必填欄位，再逐一確認選填欄位。
- `source_code_path` 若未提供，必須由使用者明確確認為 `none`。
- `playwright_max_depth` 若未提供，必須由使用者明確確認為 `default(3)`。
- `playwright_max_pages` 若未提供，必須由使用者明確確認為 `default(20)`。
- `playwright_headless` 若未提供，必須由使用者明確確認為 `default(true)`。
- 在 Step 2 結束前，`testing-artifact/handoff/[WORKFLOW]InputSummary.md` 內不得保留意義不明的空白選填欄位。
- 若缺必要資訊，先向使用者提問。
- 若仍缺必要資訊，將狀態設為 `BLOCKED`，更新 `Blocking Issues` 與 `Next Action` 後停止。
- 若 1-2 步完成，更新 checklist、`Current Step`、`Notes`、`Last Updated`。

回覆時請清楚指出：

- 補齊了哪些輸入
- 哪些選填欄位被確認為 `none` 或對應的 `default(...)`
- `testing-artifact/handoff/[WORKFLOW]InputSummary.md` 寫入了哪些內容
- `testing-artifact/handoff/[WORKFLOW]RunReport.md` 更新了哪些內容
