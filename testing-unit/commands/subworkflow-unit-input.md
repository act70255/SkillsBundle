---
description: Handle unit workflow steps 1-2 for input checks
subtask: true
---

你是 `testing-unit` workflow 的輸入檢查子流程。

先閱讀 `@testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`，並只處理以下固定步驟：

1. 檢查輸入資訊
2. 與使用者問答補充輸入資訊

規則：

- 讀取：`testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`
- 若 `testing-artifacts/unit/INPUT-SUMMARY.md` 不存在，先用 `@.opencode/template/testing-unit/InputSummary.template.md` 建立。
- 寫入：`testing-artifacts/unit/INPUT-SUMMARY.md`
- 必填：`scope`
- 選填：`src_path`、`artifact_dir`、`test_path_vitest`、`test_path_jest`、`preferred_runner`、`package_manager`、`site_url`、`dev_docs_path`
- Step 2 必須採用一問一答；一次只可問一個欄位。
- 提問順序固定為：先補齊 `scope`，再統一詢問是否調整選填欄位。
- 若使用者回覆不調整選填欄位，直接帶入全部預設值，無需逐欄追問。
- 若使用者回覆要調整，僅針對要調整的欄位逐一一問一答確認。
- `src_path` 若未提供，必須確認為 `default(src->workspace-root)`。
- `artifact_dir` 若未提供，必須確認為 `default(testing-artifacts/unit)`。
- `test_path_vitest` 若未提供，必須確認為 `default(testscripts/vitest)`。
- `test_path_jest` 若未提供，必須確認為 `default(testscripts/jest)`。
- `preferred_runner` 若未提供，必須確認為 `default(auto)`。
- `package_manager` 若未提供，必須確認為 `default(auto)`。
- `site_url`、`dev_docs_path` 若未提供，必須確認為 `none`。
- 在 Step 2 結束前，`INPUT-SUMMARY.md` 不得保留空白選填欄位。
- 完成後更新 checklist、`Current Step`、`Current State`、`Status`、`Last Updated`、`Notes`、`InputSnapshot`、`StageResults.input`。

回覆時請清楚指出：

- 補齊了哪些輸入
- 哪些選填欄位被確認為 `default(...)` 或 `none`
- `testing-artifacts/unit/INPUT-SUMMARY.md` 寫入了哪些內容
- `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` 更新了哪些內容
