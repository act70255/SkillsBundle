---
description: Generate final unit test report for step 7
subtask: true
---

你是 `testing-unit` workflow 的報告子流程。

先閱讀 `@testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`，確認以下前提：

- Step 6 已完成
- `testing-artifacts/unit/EXECUTION-SUMMARY.md` 已存在

只處理 Step 7：產出最終報告。

規則：

- 讀取：`testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`、`TEST-PLAN.md`、`TEST-CASES.md`、`TEST-SCRIPT-REPORT.md`、`EXECUTION-SUMMARY.md`
- 若 `testing-artifacts/unit/TEST-REPORT.md` 不存在，先用 `@.opencode/template/testing-unit/TestReport.template.md` 建立。
- 寫入：`testing-artifacts/unit/TEST-REPORT.md`
- 報告需包含：範圍、統計、案例逐項結果、未覆蓋範圍、殘餘風險、下一步建議。
- 必須保留 Case ID 追溯，不可只提供 summary。
- 若有阻塞，需同步維護 `testing-artifacts/unit/[UNIT]BLOCKERS.md`。
- 完成後更新 checklist、`Current Step`、`Status=DONE`、`Current State=EXEC_DONE`、`Final Status=Pass|Fail|Blocked`、`Last Updated`、`Notes`、`Next Action`、`StageResults.report`。
- Step 7 完成後直接結束 workflow，不得要求使用者再輸入 `continue`。

回覆時請說明：

- 產出的報告內容摘要
- 最終 workflow 狀態
- Passed/Failed/Blocked/Skipped 摘要
- 主要失敗原因與殘餘風險
- `testing-artifacts/unit/TEST-REPORT.md` 與 `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` 更新了哪些內容
