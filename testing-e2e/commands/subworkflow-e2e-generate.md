---
description: Generate test plan and scripts for step 7
subtask: true
---

你是 `testing-e2e` workflow 的產出子流程。

先閱讀 `@testing-artifact/handoff/RunReport.md`，確認以下前提：

- Step 6 已完成
- 已具備足夠文件與站台掃描資訊

只處理 Step 7：以 `7A -> 7B -> 7C -> 7D` 迭代完成測試計畫、測試案例與測試腳本。

規則：

- 讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/DocsBaseline.md`、`testing-artifact/handoff/SrcScanSummary.md`、`testing-artifact/handoff/SiteScanSummary.md`
- 若 `testing-artifact/deliverables/TestPlan.md` 不存在，先用 `@.opencode/template/TestPlan.template.md` 建立。
- 若 `testing-artifact/deliverables/TestCases.md` 不存在，先用 `@.opencode/template/TestCases.template.md` 建立。
- 若 `testing-artifact/scripts/TestScript.ts` 不存在，先用 `@.opencode/template/TestScript.template.ts` 建立。
- 若 `testing-artifact/handoff/GenerationReview.md` 不存在，先用 `@.opencode/template/GenerationReview.template.md` 建立。
- 寫入：`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`
- 寫入：`testing-artifact/handoff/GenerationReview.md`
- 缺少必要前提時，更新 `testing-artifact/handoff/RunReport.md` 為 `BLOCKED` 並停止。
- Step 7 必須先執行 `7A`（初稿產出），再執行 `7B`（品質門檻與覆蓋缺口審查）；若未通過，執行 `7C`（補強）後進入 `7D`（品質門檻與覆蓋缺口複審）。
- 若 `7D` 仍未通過，重複 `7C -> 7D`，直到通過；審查總輪次上限為 5（包含首次 `7B`）。
- 每一輪審查都必須在 `GenerationReview.md` 記錄：輪次、失敗原因/缺口、對應調整、調整後結果、通過與否；且缺口需使用可機器比對欄位（`Gap-ID`、`Severity`、`Category`、`Affected Artifact`、`Affected IDs`、`Rule Reference`、`Status`、`Evidence`）。
- 每一輪 `Gate Result` 必須依 `GenerationReview.md` 的「自動判定規則（機器判定）」決定，不可用主觀敘述取代。
- Step 7 的 `7B/7D` 審查與 `7C` 補強期間，不得請求使用者進行主觀品質判斷；僅在缺少必要輸入、外部條件不足、或第 5 輪仍未通過且需要使用者決策時，才可向使用者提問。
- 每一輪審查後都必須回寫 `RunReport`：`Step 7 Quality Gate`、`Step 7 Review Iterations Used`、`Notes`、`Last Updated`、`Artifacts`。
- 若當輪 `Gate Result = pass`，必須同步將 `RunReport` 的 `Step 7 Quality Gate` 更新為 `pass`；若 `fail`，更新為 `fail`。
- 若達 5 輪仍未通過，將 `RunReport` 設為 `BLOCKED`，在 `Blocking Issues` 列出未收斂缺口與需要使用者決策項，並停止。
- 測試計畫需涵蓋測試目標、範圍、排除範圍、假設、風險、資料策略、環境依賴、覆蓋重點、執行順序與完成定義。
- 測試案例必須逐筆具備來源追溯，至少能對應到文件章節、頁面或流程節點、風險來源之一，並標示是 happy path、negative、boundary 或 permission 類型。
- 每個 critical flow 至少要有 1 筆正向案例；若文件或站台顯示驗證規則、權限限制、條件分支或邊界條件，必須補上對應負向或邊界案例。
- 若已識別驗證規則、權限限制、條件分支或邊界條件，`negative + boundary + permission` 案例總數不得少於 `happy path` 案例總數。
- 若目前資訊未識別上述訊號，仍至少要有 1 筆 negative 或 boundary 案例，避免只留下純正向 smoke 測試。
- `testing-artifact/deliverables/TestCases.md` 必須填寫「覆蓋統計（必填）」段落，列出各 flow type 的案例數與 critical flow 對應覆蓋。
- 測試腳本需與目前站台流程、文件與 SRC 線索一致，並作為 Step 8 的唯一正式輸入腳本。
- 測試腳本必須對應 case ID、使用 `test.describe(...)` 組織案例、抽出必要的共用前置步驟，並包含明確 assertion，不可只保留 `goto` 或 URL smoke check。
- 測試腳本必須優先採用 Step 4/Step 6 已整理的 action contract 與 interaction preflight 結果：使用穩定 selector、必要等待訊號與前置 guard（例如 visible/enabled/no overlay）再觸發互動。
- 對於高風險互動（如動畫中按鈕、遮罩覆蓋、延遲綁定事件），必須在腳本內加入至少一種保護策略（wait for signal、fallback selector、重試一次或明確失敗訊息）。
- 通過品質門檻後，將交付檔路徑寫入 `Artifacts` 的 `Test Plan`、`Test Script`、`Generation Review` 與相關 `testing-artifact/deliverables/` 區塊，並更新 checklist、`Current Step`、`Notes`、`Last Updated`。
- Step 7 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 8。
- 不得在 Step 7 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。

回覆時請說明：

- 產出了哪些文件
- 測試涵蓋了哪些案例
- 案例如何追溯到文件、SRC 掃描與站台掃描結果
- `testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md` 與 `testing-artifact/scripts/TestScript.ts` 寫入了哪些內容
- `testing-artifact/handoff/RunReport.md` 更新了哪些內容
