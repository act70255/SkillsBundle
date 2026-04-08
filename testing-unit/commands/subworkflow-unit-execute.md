---
description: Dispatcher for unit workflow step 6 test execution
subtask: true
---

你是 `testing-unit` workflow 的測試執行分派子流程。

先閱讀 `@testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`，確認以下前提：

- Step 5 已完成
- `testing-artifacts/unit/STACK-CLASSIFICATION.md` 與 `TEST-SCRIPT-REPORT.md` 已存在

只處理 Step 6：根據 Runner Route 分派到對應 execute adapter。

分派規則：

- `Runner Route = vitest` -> 呼叫 `/subworkflow-unit-execute-vitest`
- `Runner Route = jest` -> 呼叫 `/subworkflow-unit-execute-jest`
- `Runner Route = hybrid` -> 依序呼叫 `/subworkflow-unit-execute-vitest` 再 `/subworkflow-unit-execute-jest`
- `Runner Route = blocked` -> 直接轉 `BLOCKED` 並停止

執行規則：

- 不可直接執行命令；此子流程只做路由與前置檢查。
- 若 `Runner Route` 不是 `vitest | jest | hybrid | blocked`，視為無效路由並轉 `BLOCKED`（`input-missing`）。
- 任一 adapter 失敗即停止（Fail-fast）。
- 所有 adapter 完成後，必須確認 `testing-artifacts/unit/EXECUTION-SUMMARY.md` 已產出。
- 若沒有可執行腳本，狀態轉 `BLOCKED`，`BlockerType=test-asset`。
- 完成後更新 checklist、`Current Step`、`Current State=EXEC_DONE`、`Status`、`Last Updated`、`Notes`、`StageResults.execute`。

回覆時請說明：

- 本次分派到哪些 execute adapter
- 哪個 adapter 成功或失敗
- `testing-artifacts/unit/EXECUTION-SUMMARY.md` 是否產出
- `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` 更新了哪些內容
