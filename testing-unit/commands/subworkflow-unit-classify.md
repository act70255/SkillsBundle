---
description: Handle unit workflow step 4 for stack classification and routing
subtask: true
---

你是 `testing-unit` workflow 的技術棧歸類子流程。

先閱讀 `@testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`，確認以下前提：

- Step 3 已完成
- `SOURCE-BASELINE.md`、`TEST-PLAN.md`、`TEST-CASES.md` 已存在

只處理 Step 4：歸類技術棧並決定 runner 路由。

規則：

- 讀取：`testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`、`testing-artifacts/unit/INPUT-SUMMARY.md`、`testing-artifacts/unit/SOURCE-BASELINE.md`
- 若 `testing-artifacts/unit/STACK-CLASSIFICATION.md` 不存在，先用 `@.opencode/template/testing-unit/StackClassification.template.md` 建立。
- 寫入：`testing-artifacts/unit/STACK-CLASSIFICATION.md`
- 必須至少檢查以下訊號：
  - `package.json` dependencies（`react`、`vue`、`@angular/*`、`jquery`、`vitest`、`jest`）
  - 測試設定檔（`vitest.config.*`、`jest.config.*`）
  - 檔案型態與語法特徵（`.vue`、`.tsx/.jsx`、`$(...)`）
  - 既有測試檔分布
- 必須輸出 `Runner Route`：`vitest | jest | hybrid | blocked`
- `preferred_runner` 若與檢測證據衝突，需在報告明確記錄衝突與 fallback。
- 若無法可靠判定，將狀態設為 `BLOCKED` 並在 `Need User Clarification` 指出最小補件。
- 若 `package.json` 不存在，必須以「設定檔 + 原始碼特徵 + 既有測試檔」做替代判定，並在報告標註 `Confidence=low`。
- 完成後更新 checklist、`Current Step`、`Current State=CLASSIFIED`、`Status`、`Last Updated`、`Notes`、`StageResults.classify`。

回覆時請說明：

- 判定出的技術棧與 runner 路由
- 採用哪些證據
- 是否有衝突或低信心判定
- `testing-artifacts/unit/STACK-CLASSIFICATION.md` 寫入了哪些內容
- `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` 更新了哪些內容
