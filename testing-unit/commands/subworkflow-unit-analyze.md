---
description: Handle unit workflow step 3 for docs and source analysis
subtask: true
---

你是 `testing-unit` workflow 的分析子流程。

先閱讀 `@testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`，確認以下前提：

- Step 1-2 已完成
- `scope` 已存在

只處理 Step 3：分析文件與原始碼，建立 unit 測試基線。

規則：

- 讀取：`testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`、`testing-artifacts/unit/INPUT-SUMMARY.md`
- 若 `testing-artifacts/unit/SOURCE-BASELINE.md` 不存在，先用 `@.opencode/template/testing-unit/SourceBaseline.template.md` 建立。
- 若 `testing-artifacts/unit/TEST-PLAN.md` 不存在，先用 `@.opencode/template/testing-unit/TestPlan.template.md` 建立。
- 若 `testing-artifacts/unit/TEST-CASES.md` 不存在，先用 `@.opencode/template/testing-unit/TestCases.template.md` 建立。
- 若 `testing-artifacts/unit/ACCEPTANCE-CRITERIA.md` 不存在，先用 `@.opencode/template/testing-unit/AcceptanceCriteria.template.md` 建立最小可用基線。
- 寫入：`SOURCE-BASELINE.md`、`TEST-PLAN.md`、`TEST-CASES.md`、`ACCEPTANCE-CRITERIA.md`
- 執行前必須先檢查 `src_path` 實體路徑：若 `src_path=default(src->workspace-root)`，先嘗試 `src/`，不存在則改用 workspace root 並寫入基線。
- 若 `src_path` 為使用者明確指定且路徑不存在，需標記 `BLOCKED`（`input-missing`）並停止。
- 若 `dev_docs_path` 有提供但路徑不存在，需標記 `BLOCKED`（`input-missing`）並停止。
- 分析內容至少包含：模組邏輯、邊界條件、錯誤處理、非同步副作用、外部依賴 Mock 需求。
- 測試案例必須標註 `AutomationTarget = vitest | jest | manual`。
- 測試案例需保留追溯：AC/TASK/SourceEvidence；若缺正式編號可使用 `INFERRED-*`。
- 本步驟只做規劃，不可修改產品程式碼。
- 若輸入不足或範圍過大無法合理分析，更新 `WORKFLOW-RUN-REPORT.md` 為 `BLOCKED` 並停止。
- 完成後更新 checklist、`Current Step`、`Current State=ANALYZED`、`Status=IN_PROGRESS`、`Last Updated`、`Notes`、`StageResults.analyze`。

回覆時請說明：

- 分析了哪些來源
- 建立了哪些測試規劃輸出
- 哪些案例可自動化，哪些保留 manual
- `testing-artifacts/unit/SOURCE-BASELINE.md`、`TEST-PLAN.md`、`TEST-CASES.md`、`ACCEPTANCE-CRITERIA.md` 寫入了哪些內容
- `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` 更新了哪些內容
