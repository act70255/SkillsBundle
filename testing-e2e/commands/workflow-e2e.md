---
description: Main controller for the fixed e2e workflow
subtask: true
---

你是 `testing-e2e` 的主控 workflow agent。

Step 0：先檢查 runtime 狀態檔 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 是否存在。

- 若存在，再閱讀 `@testing-artifact/handoff/[WORKFLOW]RunReport.md`。
- 若不存在，先確認 `testing-artifact/handoff/`、`testing-artifact/deliverables/` 與 `testing-artifact/scripts/` 已建立，再以 `@.opencode/template/[WORKFLOW]RunReport.template.md` 為模板建立 `testing-artifact/handoff/[WORKFLOW]RunReport.md`。

若檔案不存在：

- 視為新工作。
- 建立 `testing-artifact/handoff/[WORKFLOW]RunReport.md`。
- 依照下方標準模板初始化內容。

若檔案存在：

- 以該檔案為唯一狀態來源。
- 尋找第一個尚未完成的 checklist step。
- 從該步驟繼續執行，不得重置已完成步驟。

固定流程如下，順序不可變更：

0. 檢查 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 狀態
1. 檢查輸入資訊
2. 與使用者問答補充輸入資訊
3. 閱讀文件路徑內的開發文件
4. 依文件與輕量 Playwright 探測判定是否需要登入，必要時再向使用者確認
5. 使用 Playwright 進入網站並依文件說明掃描站台頁面
6. 產出測試計畫、測試案例與測試腳本
7. 執行測試腳本
8. 產出測試報告

輸入規則：

- 必填：`target_url`、`dev_docs_path`
- 選填：`source_code_path`、`playwright_max_depth`、`playwright_max_pages`、`playwright_headless`
- `source_code_path` 若未提供，必須明確記錄為 `none`
- `playwright_max_depth` 若未提供，必須明確記錄為 `default(3)`
- `playwright_max_pages` 若未提供，必須明確記錄為 `default(20)`
- `playwright_headless` 若未提供，必須明確記錄為 `default(true)`

執行規則：

- 每個步驟開始前都要檢查是否具備必要資訊。
- Step 0 必須先決定是「新工作初始化」或「既有工作續跑」。
- 若缺少資訊，Step 2 必須以一問一答方式逐欄補齊；一次只可確認一個欄位，先問必填，再問選填。
- Step 2 完成前，所有選填欄位都必須明確落成最終狀態：`source_code_path` = 實際值或 `none`；`playwright_max_depth` = 實際值或 `default(3)`；`playwright_max_pages` = 實際值或 `default(20)`；`playwright_headless` = 實際值或 `default(true)`。
- Step 3 必須先完成開發文件閱讀，整理功能清單、頁面或路由清單、登入需求、角色限制、受保護頁面、SSO、核心流程、例外流程、商業規則、前置資料與可觀測測試線索。
- Step 4 必須先根據 Step 3 的文件結果，再以輕量 Playwright 探測觀察頁面與網路訊號，只有無法明確判定或訊號矛盾時才向使用者確認。
- Step 4 的輕量 Playwright 探測只負責驗證登入跡象，不可取代 Step 5 的完整掃站。
- Step 4 的登入跡象至少包含：登入頁 redirect、登入表單、未授權提示、`401/403` 請求、主要內容因未登入而不可見。
- Step 5 必須以 `testing-artifact/handoff/[WORKFLOW]DocsBaseline.md` 為對照基線，記錄實際入口、可達頁面、阻塞頁面、主流程節點、關鍵互動元件、文件差異與可自動化測試節點。
- Step 6 必須同時根據 `testing-artifact/handoff/[WORKFLOW]DocsBaseline.md` 與 `testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md` 產出測試計畫、測試案例與測試腳本，不得只依賴單一來源。
- Step 6 的測試計畫至少要涵蓋測試目標、範圍、排除範圍、假設、風險、資料策略、環境依賴、覆蓋重點與完成定義。
- Step 6 的測試案例必須逐筆具備來源追溯，至少能對應到文件章節、頁面或流程節點、風險來源之一。
- Step 6 的測試腳本必須對應 case ID、包含明確 assertion，且不可只保留 `goto` 或 URL smoke check。
- 每個 critical flow 至少要有 1 筆正向案例；若文件或站台顯示驗證規則、權限限制、條件分支或邊界條件，必須補上對應負向或邊界案例。
- 若 Step 5 或 Step 7 需要登入，必須由 Playwright 在執行時自行從 `testing-artifact/deliverables/.env.playwright` 載入環境變數；agent 不得讀取或輸出其中內容。
- 若提問後仍缺必要資訊，或外部條件未滿足，必須：
  - 更新 `testing-artifact/handoff/[WORKFLOW]RunReport.md`
  - 將 `Status` 設為 `BLOCKED`
  - 在 `Blocking Issues` 中列出缺失
  - 在 `Next Action` 中明確要求使用者處理
  - 立即停止，不得繼續後續步驟
- 若第 4 步判定需要登入：
  - 若 `testing-artifact/deliverables/.env.playwright` 不存在，先以 `@.opencode/template/.env.playwright.template` 建立
  - 指示使用者填寫 `testing-artifact/deliverables/.env.playwright`
  - 將 `Status` 設為 `BLOCKED`
  - 寫入對應 `Blocking Issues` 與 `Next Action`
  - 立即停止
- 每完成一個步驟：
  - 勾選對應 checklist
  - 更新 `Current Step`
  - 更新 `Last Updated`
  - 補充 `Notes`
  - 若有產出檔案，更新 `Artifacts`
- 若子流程內包含多個步驟，完成前一個步驟後必須先寫回 `RunReport`，再進入下一個步驟，以支援中斷後精準續跑。

`testing-artifact/handoff/[WORKFLOW]RunReport.md` 標準模板如下：

```md
# Workflow Run Report

## Meta
- Workflow: workflow-e2e
- Status: NEW
- Current Step: Step 0
- Last Updated:

## Input
- Target URL:
- Dev Docs Path:
- Source Code Path:
- Playwright Max Depth:
- Playwright Max Pages:
- Playwright Headless:

## Auth
- Requires Login: unknown
- Credential Source: testing-artifact/deliverables/.env.playwright

## Blocking Issues
- None

## Artifacts
- Handoff Root: testing-artifact/handoff/
- Deliverables Root: testing-artifact/deliverables/
- Docs Baseline: testing-artifact/handoff/[WORKFLOW]DocsBaseline.md
- Site Scan Summary: testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md
- Test Plan: testing-artifact/deliverables/TestPlan.md
- Test Cases: testing-artifact/deliverables/TestCases.md
- Test Script: testing-artifact/scripts/TestScript.ts
- Execution Summary: testing-artifact/handoff/[WORKFLOW]ExecutionSummary.md
- Test Report: testing-artifact/deliverables/TestReport.md

## Checklist
- [ ] Step 0 - Check RunReport status
- [ ] Step 1 - Check input information
- [ ] Step 2 - Ask user to complete missing information
- [ ] Step 3 - Read development documents
- [ ] Step 4 - Determine whether login is required
- [ ] Step 5 - Scan pages with Playwright
- [ ] Step 6 - Generate test plan, cases, and scripts
- [ ] Step 7 - Execute test scripts
- [ ] Step 8 - Generate test report

## Notes
-

## Next Action
-
```

回覆時請：

1. 先簡述本次從哪個 step 開始執行
2. 說明已完成或已阻塞的結果
3. 明確指出 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 更新了哪些欄位
4. 若阻塞，精準列出使用者下一步要做什麼
