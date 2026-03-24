---
description: Generate test plan and scripts for the e2e workflow
subtask: true
---

你是 `testing-e2e` workflow 的產出子流程。

先閱讀 `@testing-artifact/handoff/[WORKFLOW]RunReport.md`，確認以下前提：

- Step 5 已完成
- 已具備足夠文件與站台掃描資訊

只處理 Step 6：產出測試計畫、測試案例與測試腳本。

規則：

- 讀取：`testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/handoff/[WORKFLOW]DocsBaseline.md`、`testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md`
- 若 `testing-artifact/deliverables/TestPlan.md` 不存在，先用 `@.opencode/template/[WORKFLOW]TestPlan.template.md` 建立。
- 若 `testing-artifact/deliverables/TestCases.md` 不存在，先用 `@.opencode/template/[WORKFLOW]TestCases.template.md` 建立。
- 若 `testing-artifact/scripts/TestScript.ts` 不存在，先用 `@.opencode/template/[WORKFLOW]TestScript.template.ts` 建立。
- 寫入：`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`
- 缺少必要前提時，更新 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 為 `BLOCKED` 並停止。
- 測試計畫需涵蓋範圍、假設、風險、案例清單。
- 測試腳本需與目前站台流程和文件一致，並作為 Step 7 的唯一正式輸入腳本。
- 完成後將交付檔路徑寫入 `Artifacts` 的 `Test Plan`、`Test Script` 與相關 `testing-artifact/deliverables/` 區塊，並更新 checklist、`Current Step`、`Notes`、`Last Updated`。

回覆時請說明：

- 產出了哪些文件
- 測試涵蓋了哪些案例
- `testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md` 與 `testing-artifact/scripts/TestScript.ts` 寫入了哪些內容
- `testing-artifact/handoff/[WORKFLOW]RunReport.md` 更新了哪些內容
