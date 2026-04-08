---
description: Dispatcher for unit workflow step 5 script generation
subtask: true
---

你是 `testing-unit` workflow 的腳本產生分派子流程。

先閱讀 `@testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`，確認以下前提：

- Step 4 已完成
- `testing-artifacts/unit/STACK-CLASSIFICATION.md` 已存在
- `testing-artifacts/unit/TEST-PLAN.md`、`TEST-CASES.md`、`ACCEPTANCE-CRITERIA.md` 已存在

只處理 Step 5：根據 Runner Route 分派到對應 adapter。

分派規則：

- `Runner Route = vitest` -> 呼叫 `/subworkflow-unit-genscript-vitest`
- `Runner Route = jest` -> 呼叫 `/subworkflow-unit-genscript-jest`
- `Runner Route = hybrid` -> 依序呼叫 `/subworkflow-unit-genscript-vitest` 再 `/subworkflow-unit-genscript-jest`
- `Runner Route = blocked` -> 直接轉 `BLOCKED` 並停止

執行規則：

- 不可直接產生測試內容；此子流程只做路由與前置檢查。
- 任一 adapter 失敗即停止（Fail-fast）。
- 所有 adapter 完成後，必須確認 `testing-artifacts/unit/TEST-SCRIPT-REPORT.md` 已產出。
- 所有 adapter 完成後，必須確認對應 runner 至少有一個可執行測試檔（`*.test.*` 或 `*.spec.*`）。
- 若無可執行測試檔，狀態轉 `BLOCKED`，`BlockerType=test-asset`。
- 完成後更新 checklist、`Current Step`、`Current State=SCRIPT_DONE`、`Status`、`Last Updated`、`Notes`、`StageResults.genscript`。

回覆時請說明：

- 本次分派到哪些 adapter
- 哪個 adapter 成功或失敗
- `testing-artifacts/unit/TEST-SCRIPT-REPORT.md` 是否產出
- `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` 更新了哪些內容
