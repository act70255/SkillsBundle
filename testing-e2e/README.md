# testing-e2e

此目錄提供一套以 OpenCode custom commands 為核心的固定式 e2e workflow，目標是把「測試規劃」與「Playwright 測試執行」拆成可續跑、可阻塞、可追蹤的流程。

注意：此目錄目前只以 `testing-e2e/commands/` 作為 workflow 規格與調整目標；但 command 內的檔案路徑一律以 runtime 結構為準。

## 目標

- 以固定步驟推進，不依賴臨場發揮。
- 以 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 作為 runtime 唯一狀態來源。
- 缺少必要資訊時，先互動補齊；仍不足則標記 `BLOCKED` 並停止。
- 若 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 不存在，視為新工作並從頭初始化。
- 若 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 存在，優先接續未完成進度。

## 目錄角色

- `testing-e2e/commands/`: workflow command 規格與唯一調整目標。
- `.opencode/template/[WORKFLOW]RunReport.template.md`: runtime 初始化模板；source 規格檔位於 `testing-e2e/template/[WORKFLOW]RunReport.template.md`。
- `.opencode/template/[WORKFLOW]InputSummary.template.md`: Step 1-2 輸入整理模板。
- `.opencode/template/[WORKFLOW]DocsBaseline.template.md`: Step 3 文件基線模板。
- `.opencode/template/[WORKFLOW]SiteScanSummary.template.md`: Step 5 站台掃描基線模板。
- `.opencode/template/[WORKFLOW]ExecutionSummary.template.md`: Step 7 執行摘要模板。
- `.opencode/template/[WORKFLOW]TestScript.template.ts`: Step 6 Playwright 測試腳本模板。
- `.opencode/template/[WORKFLOW]TestPlan.template.md`: Step 6 測試計畫模板。
- `.opencode/template/[WORKFLOW]TestCases.template.md`: Step 6 測試案例模板。
- `.opencode/template/[WORKFLOW]TestReport.template.md`: Step 8 測試報告模板。
- `.opencode/template/.env.playwright.template`: 目標站台需要登入時，用來產出本次 workflow Playwright 環境檔的模板。
- `testing-artifact/handoff/[WORKFLOW]RunReport.md`: runtime workflow 狀態檔與交接主檔。
- `testing-artifact/scripts/`: Playwright 測試腳本集中放置目錄。
- `testing-artifact/deliverables/`: 最終交付給人類閱讀的成果目錄。

## 固定流程

| Step | 目的 | 核心輸出 |
| --- | --- | --- |
| 0 | 檢查 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 狀態 | `testing-artifact/handoff/[WORKFLOW]RunReport.md` |
| 1 | 檢查輸入資訊 | 輸入缺漏清單 |
| 2 | 與使用者問答補充輸入資訊 | `testing-artifact/handoff/[WORKFLOW]InputSummary.md` |
| 3 | 閱讀開發文件 | `testing-artifact/handoff/[WORKFLOW]DocsBaseline.md` |
| 4 | 依文件與輕量 Playwright 探測判定是否需要登入，必要時再向使用者確認 | 登入需求判定 / `testing-artifact/deliverables/.env.playwright` |
| 5 | 使用 Playwright 依文件掃描站台頁面 | `testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md` |
| 6 | 產出測試計畫與測試腳本 | `testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts` |
| 7 | 執行測試腳本 | `testing-artifact/handoff/[WORKFLOW]ExecutionSummary.md` |
| 8 | 產出測試報告 | `testing-artifact/deliverables/TestReport.md` |

流程順序摘要：

0. 檢查 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 狀態
1. 檢查輸入資訊
2. 與使用者問答補充輸入資訊
3. 閱讀開發文件
4. 依文件與輕量 Playwright 探測判定是否需要登入，必要時再向使用者確認
5. 使用 Playwright 依文件掃描站台頁面
6. 產出測試計畫與測試腳本
7. 執行測試腳本
8. 產出測試報告

## Step 0 規則

- workflow 每次啟動時都必須先檢查 `testing-artifact/handoff/[WORKFLOW]RunReport.md`。
- 若檔案不存在，視為新工作，先確認並建立 `testing-artifact/handoff/` 與 `testing-artifact/deliverables/`，再以 `.opencode/template/[WORKFLOW]RunReport.template.md` 建立 `testing-artifact/handoff/[WORKFLOW]RunReport.md`，最後從 Step 1 開始。
- 若檔案存在，先讀取 `Status`、`Current Step`、`Checklist`、`Blocking Issues`。
- 僅允許從第一個未完成步驟續跑，不得任意跳步或重置已完成步驟。
- 若 `Status=DONE`，預設不續跑，除非使用者明確要求開新工作或重啟 workflow。

## 必填與選填輸入

### 必填

- `target_url`: 測試目標網址
- `dev_docs_path`: 開發文件路徑

### 選填

- `source_code_path`: 原始碼路徑
- `playwright_scan_options`: Playwright 掃描參數

## 狀態規則

- `NEW`: 新工作，尚未開始。
- `IN_PROGRESS`: 已開始，仍有未完成步驟。
- `BLOCKED`: 缺少必要資訊或外部條件未滿足，必須中止等待使用者處理。
- `DONE`: 全部完成。
- `FAILED`: 執行中發生錯誤且未能完成。

## BLOCK 條件

任一步驟若缺少必要項目，workflow 必須：

1. 更新 `testing-artifact/handoff/[WORKFLOW]RunReport.md`
2. 將 `Status` 設為 `BLOCKED`
3. 寫明 `Blocking Issues`
4. 寫明 `Next Action`
5. 停止後續步驟

若第 4 步判定網站需要登入，流程必須：

1. 由 `.opencode/template/.env.playwright.template` 產出 `testing-artifact/deliverables/.env.playwright`
2. 提示使用者填寫 `testing-artifact/deliverables/.env.playwright`
3. 將狀態設為 `BLOCKED`
4. 停止後續步驟

## Step 4 規則

- Step 4 的登入需求判定順序固定為：先看開發文件，再做輕量 Playwright 探測，最後才向使用者確認。
- 文件判讀需優先確認是否存在登入需求、角色限制、受保護頁面、SSO 或其他授權流程。
- 輕量 Playwright 探測只用於判定登入需求，不等同 Step 5 的完整掃站。
- 輕量 Playwright 探測至少要檢查以下訊號：
  - 是否被自動導向登入頁或授權頁
  - 是否出現登入表單、登入按鈕或明確登入提示
  - 是否出現 `401`、`403`、`unauthorized`、`forbidden` 等未授權訊號
  - 是否因未登入而無法看到主要內容或關鍵流程入口
- 只有在文件與頁面訊號仍無法明確判定，或兩者互相矛盾時，才向使用者確認。
- 若已確認需要登入但尚未取得可用憑證，必須建立 `testing-artifact/deliverables/.env.playwright`、更新 `Blocking Issues` 與 `Next Action`，並將 workflow 設為 `BLOCKED`。

## 憑證與 `.env.playwright` 規則

- `testing-artifact/deliverables/.env.playwright` 只作為 Playwright 執行時的憑證來源。
- agent 可以知道憑證檔位置，但不得讀取、展開、轉述或摘要 `.env.playwright` 的實際內容。
- 若 Step 5 或後續測試需要登入，必須由 Playwright 在執行時自行載入 `.env.playwright` 中的環境變數完成登入。
- agent 只可根據 Playwright 執行結果記錄「登入成功 / 失敗 / 缺少必要變數」，不得在任何 handoff 或 deliverable 中寫出 secret 值。

## RunReport 結構

建議由 workflow 維護以下內容：

```md
# Workflow Run Report

## Meta
- Workflow: workflow-e2e
- Status: NEW
- Current Step: Step 0
- Last Updated: 2026-03-23 00:00

## Input
- Target URL:
- Dev Docs Path:
- Source Code Path:
- Playwright Scan Options:

## Auth
- Requires Login: unknown
- Credential Source: testing-artifact/deliverables/.env.playwright

## Blocking Issues
- None

## Artifacts
- Handoff Root: testing-artifact/handoff/
- Deliverables Root: testing-artifact/deliverables/
- Test Plan: testing-artifact/deliverables/TestPlan.md
- Test Script: testing-artifact/scripts/TestScript.ts
- Test Report: testing-artifact/deliverables/TestReport.md

## Checklist
- [ ] Step 0 - Check RunReport status
- [ ] Step 1 - Check input information
- [ ] Step 2 - Ask user to complete missing information
- [ ] Step 3 - Read development documents
- [ ] Step 4 - Determine whether login is required
- [ ] Step 5 - Scan pages with Playwright
- [ ] Step 6 - Generate test plan and test scripts
- [ ] Step 7 - Execute test scripts
- [ ] Step 8 - Generate test report

## Notes
-

## Next Action
-
```

## Handoff 樣板

- `testing-artifact/handoff/[WORKFLOW]InputSummary.md`: 整理 target url、文件路徑、原始碼路徑、掃描參數與缺漏項，作為後續步驟輸入基線
- `testing-artifact/handoff/[WORKFLOW]DocsBaseline.md`: 整理開發文件中的功能範圍、頁面流程、角色與限制，作為文件基線
- `testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md`: 整理 Playwright 實際掃描站台得到的頁面、流程與關鍵互動，作為站台基線
- `testing-artifact/handoff/[WORKFLOW]ExecutionSummary.md`: 整理測試執行結果、失敗摘要與重現線索，作為最終報告輸入

## Deliverables 樣板

- `testing-artifact/deliverables/TestPlan.md`: 測試範圍、假設、風險與執行策略
- `testing-artifact/deliverables/TestCases.md`: 測試案例清單與追蹤資訊
- `testing-artifact/scripts/TestScript.ts`: Playwright 測試腳本
- `testing-artifact/deliverables/TestReport.md`: 最終測試報告

## 各步驟檔案規則

| Step | 讀取 | 建立/寫入 | 模板 | 備註 |
| --- | --- | --- | --- | --- |
| 0 | `testing-artifact/handoff/[WORKFLOW]RunReport.md` | `testing-artifact/handoff/`、`testing-artifact/deliverables/`、`testing-artifact/scripts/`、`testing-artifact/handoff/[WORKFLOW]RunReport.md` | `.opencode/template/[WORKFLOW]RunReport.template.md` | 初始化或續跑入口 |
| 1-2 | `testing-artifact/handoff/[WORKFLOW]RunReport.md` | `testing-artifact/handoff/[WORKFLOW]InputSummary.md` | `.opencode/template/[WORKFLOW]InputSummary.template.md` | 補齊 `target_url`、`dev_docs_path` |
| 3 | `testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/handoff/[WORKFLOW]InputSummary.md` | `testing-artifact/handoff/[WORKFLOW]DocsBaseline.md` | `.opencode/template/[WORKFLOW]DocsBaseline.template.md` | 完成文件整理後，必須立刻勾選 Step 3 checklist，更新 `Current Step`、`Last Updated` 與 `Notes` |
| 4 | `testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/handoff/[WORKFLOW]InputSummary.md`、`testing-artifact/handoff/[WORKFLOW]DocsBaseline.md` | `testing-artifact/deliverables/.env.playwright`（僅在需要登入且尚未存在時） | `.opencode/template/.env.playwright.template` | 可執行：對 `target_url` 做輕量 Playwright 探測以判定登入需求；若因登入憑證缺失而 `BLOCKED`，恢復執行時必須直接從 Step 4 接續，不得重置已完成的 Step 3 |
| 5 | `testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/handoff/[WORKFLOW]DocsBaseline.md` | `testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md` | `.opencode/template/[WORKFLOW]SiteScanSummary.template.md` | 若需要登入：由 Playwright 在執行時載入 `testing-artifact/deliverables/.env.playwright`，agent 不得讀取其內容 |
| 6 | `testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/handoff/[WORKFLOW]DocsBaseline.md`、`testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md` | `testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts` | `.opencode/template/[WORKFLOW]TestPlan.template.md`、`.opencode/template/[WORKFLOW]TestCases.template.md`、`.opencode/template/[WORKFLOW]TestScript.template.ts` | Step 7 的固定輸入來源 |
| 7 | `testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts` | `testing-artifact/handoff/[WORKFLOW]ExecutionSummary.md` | `.opencode/template/[WORKFLOW]ExecutionSummary.template.md` | 若需要登入：由 Playwright 在執行時載入 `testing-artifact/deliverables/.env.playwright`，agent 不得讀取其內容 |
| 8 | `testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/handoff/[WORKFLOW]ExecutionSummary.md`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md` | `testing-artifact/deliverables/TestReport.md` | `.opencode/template/[WORKFLOW]TestReport.template.md` | 最終產出報告 |

## 指令設計

| 指令 | 範圍 | 用途 |
| --- | --- | --- |
| `/workflow-e2e` | Step 0-8 | 唯一主控入口；先檢查 `testing-artifact/handoff/[WORKFLOW]RunReport.md`，不存在則用 template 初始化，存在則續跑 |
| `/subworkflow-e2e-input` | Step 1-2 | 輸入檢查、補齊缺漏 |
| `/subworkflow-e2e-docs` | Step 3-4 | 文件整理與登入需求判定 |
| `/subworkflow-e2e-scan` | Step 5 | 站台掃描 |
| `/subworkflow-e2e-generate` | Step 6 | 產出測試計畫、測試案例、測試腳本 |
| `/subworkflow-e2e-run` | Step 7 | 執行測試腳本 |
| `/subworkflow-e2e-report` | Step 8 | 產出測試報告 |

子流程主要用途是局部補跑、除錯與人工介入；正式使用時仍以 `/workflow-e2e` 為主。

## 建議使用方式

1. 執行 `/workflow-e2e`
2. 若 workflow 提示 `BLOCKED`，先處理 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 指出的缺失
3. 如為登入需求，先填寫 `testing-artifact/deliverables/.env.playwright`
4. 補齊後再次執行 `/workflow-e2e`

## 規格驗證

- 開發規格驗證：`node testing-e2e/scripts/verify-workflow-dev.mjs`
- runtime 版本驗證：`node testing-e2e/scripts/verify-workflow.mjs`
- 開發規格驗證內容包含：流程步驟、狀態值、必要 sections、`testing-e2e/commands/workflow-e2e.md` 是否符合 runtime 路徑規格
- 樣板來源檔放在 `testing-e2e/template/`，內容對應 runtime `.opencode/template/` 結構

## 設計原則

- `README.md` 負責說明規則與架構。
- `commands/*.md` 負責固定 prompt 流程。
- `testing-artifact/handoff/[WORKFLOW]RunReport.md` 負責 runtime 狀態持久化與步驟交接。
- `testing-artifact/deliverables/` 負責最終交付成果。
- workflow 每次執行都必須先讀取現況，再決定下一步。
