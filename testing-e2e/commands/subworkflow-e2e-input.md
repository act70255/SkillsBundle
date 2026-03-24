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
- 選填：`source_code_path`、`playwright_scan_options`
- 若缺必要資訊，先向使用者提問。
- 若仍缺必要資訊，將狀態設為 `BLOCKED`，更新 `Blocking Issues` 與 `Next Action` 後停止。
- 若 1-2 步完成，更新 checklist、`Current Step`、`Notes`、`Last Updated`。

回覆時請清楚指出：

- 補齊了哪些輸入
- `testing-artifact/handoff/[WORKFLOW]InputSummary.md` 寫入了哪些內容
- `testing-artifact/handoff/[WORKFLOW]RunReport.md` 更新了哪些內容
