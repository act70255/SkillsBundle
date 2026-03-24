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
- 測試計畫需涵蓋測試目標、範圍、排除範圍、假設、風險、資料策略、環境依賴、覆蓋重點、執行順序與完成定義。
- 測試案例必須逐筆具備來源追溯，至少能對應到文件章節、頁面或流程節點、風險來源之一，並標示是 happy path、negative、boundary 或 permission 類型。
- 每個 critical flow 至少要有 1 筆正向案例；若文件或站台顯示驗證規則、權限限制、條件分支或邊界條件，必須補上對應負向或邊界案例。
- 測試腳本需與目前站台流程和文件一致，並作為 Step 7 的唯一正式輸入腳本。
- 測試腳本必須對應 case ID、使用 `test.describe(...)` 組織案例、抽出必要的共用前置步驟，並包含明確 assertion，不可只保留 `goto` 或 URL smoke check。
- 完成後將交付檔路徑寫入 `Artifacts` 的 `Test Plan`、`Test Script` 與相關 `testing-artifact/deliverables/` 區塊，並更新 checklist、`Current Step`、`Notes`、`Last Updated`。

回覆時請說明：

- 產出了哪些文件
- 測試涵蓋了哪些案例
- 案例如何追溯到文件與站台掃描結果
- `testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md` 與 `testing-artifact/scripts/TestScript.ts` 寫入了哪些內容
- `testing-artifact/handoff/[WORKFLOW]RunReport.md` 更新了哪些內容
