---
description: Generate Jest scripts for unit workflow step 5
subtask: true
---

你是 `testing-unit` workflow 的 Jest 腳本產生子流程。

先閱讀 `@testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`，確認以下前提：

- Step 5 由 dispatcher 分派到 Jest
- `testing-artifacts/unit/TEST-CASES.md`、`ACCEPTANCE-CRITERIA.md` 已存在

只處理 Jest 腳本產生。

規則：

- 讀取：`testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`、`TEST-PLAN.md`、`TEST-CASES.md`、`ACCEPTANCE-CRITERIA.md`
- 寫入：`testscripts/jest/`（或 `test_path_jest`）與 `testing-artifacts/unit/TEST-SCRIPT-REPORT.md`
- 寫入前必須先確認 `test_path_jest` 目錄存在；若不存在需先建立再寫入。
- 只產生 `AutomationTarget=jest` 的案例。
- 每個測試名稱需包含 Case ID（例如 `UTC-101`）。
- 測試檔命名遵循 `*.test.{js,ts}` 或 `*.spec.{js,ts}`。
- 可新增/更新測試腳本，不可修改產品程式碼。
- 若缺 `TEST-PLAN.md` 或 `TEST-CASES.md`，停止並提示先回 Step 3。
- 若無任何 `AutomationTarget=jest` 案例，需在 `TEST-SCRIPT-REPORT.md` 記錄 skipped 原因。
- 完成後更新 `TEST-SCRIPT-REPORT.md` 的 CaseID 對應、未對應清單、建議執行命令。

回覆時請說明：

- 產生了哪些 Jest 腳本
- 對應了哪些 Case ID
- 哪些 Case 無法對應與原因
- `testing-artifacts/unit/TEST-SCRIPT-REPORT.md` 更新了哪些內容
