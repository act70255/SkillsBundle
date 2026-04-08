---
description: Execute Jest scripts for unit workflow step 6
subtask: true
---

你是 `testing-unit` workflow 的 Jest 執行子流程。

先閱讀 `@testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`，確認以下前提：

- Step 6 由 dispatcher 分派到 Jest
- `testing-artifacts/unit/TEST-SCRIPT-REPORT.md` 已存在

只處理 Jest 測試執行。

規則：

- 讀取：`testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`、`TEST-SCRIPT-REPORT.md`、`TEST-PLAN.md`、`TEST-CASES.md`
- 寫入：`testing-artifacts/unit/EXECUTION-SUMMARY.md`
- 執行前必須先檢查 `test_path_jest` 下是否存在可執行測試檔（`*.test.*` 或 `*.spec.*`）。
- 命令優先序：
  - 若 `test_path_jest` 存在且有測試檔：`<pm> jest <test_path_jest>`
  - 若 `test_path_jest` 不存在且其來源為 `default(...)`：`<pm> jest`
  - 若 `test_path_jest` 不存在且其來源為 `provided`：轉 `BLOCKED`（`test-asset`）
- `<pm>` 需由 `package_manager` 推導：`pnpm` -> `pnpm`、`yarn` -> `yarn`、`npm` 或 `auto` -> `npx`
- 執行後需整理 passed/failed/skipped 與 Case ID 對應。
- 若環境錯誤（依賴缺失/命令不存在）需標記 `BlockerType=environment`。
- 若測試資產缺失需標記 `BlockerType=test-asset`。
- 若可重試，需在摘要中提供 retry command。

回覆時請說明：

- 實際執行命令
- 測試結果摘要
- 失敗或阻塞原因
- `testing-artifacts/unit/EXECUTION-SUMMARY.md` 更新了哪些內容
