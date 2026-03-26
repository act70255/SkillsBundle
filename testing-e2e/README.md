# testing-e2e

此目錄提供一套以 OpenCode custom commands 為核心的固定式 e2e workflow，目標是把「測試規劃」與「Playwright 測試執行」拆成可續跑、可阻塞、可追蹤的流程。

注意：`testing-e2e/commands/`、`testing-e2e/template/` 與 `testing-e2e/scripts/` 是開發規格來源；runtime 版本對應到 `.opencode/commands/` 與 `.opencode/template/`。

## 目標

- 以固定步驟推進，不依賴臨場發揮。
- 以 `testing-artifact/handoff/RunReport.md` 作為 runtime 唯一狀態來源。
- 缺少必要資訊時，先互動補齊；仍不足則標記 `BLOCKED` 並停止。
- 若 `testing-artifact/handoff/RunReport.md` 不存在，視為新工作並從頭初始化。
- 若 `testing-artifact/handoff/RunReport.md` 存在，優先接續未完成進度。
- 將文件分析、站台掃描、測試案例、測試腳本與測試報告串成可追溯鏈條。

## 目錄角色

- `testing-e2e/commands/`: workflow command 規格與流程約束。
- `testing-e2e/template/`: handoff 與 deliverable 樣板來源。
- `testing-e2e/scripts/`: workflow 規格驗證腳本。
- `.opencode/template/RunReport.template.md`: runtime 初始化模板；source 規格檔位於 `testing-e2e/template/RunReport.template.md`。
- `.opencode/template/InputSummary.template.md`: Step 1-2 輸入整理模板。
- `.opencode/template/DocsBaseline.template.md`: Step 3 文件基線模板。
- `.opencode/template/SiteScanSummary.template.md`: Step 5 站台掃描基線模板。
- `.opencode/template/ExecutionSummary.template.md`: Step 7 執行摘要模板。
- `.opencode/template/TestScript.template.ts`: Step 6 Playwright 測試腳本模板。
- `.opencode/template/TestPlan.template.md`: Step 6 測試計畫模板。
- `.opencode/template/TestCases.template.md`: Step 6 測試案例模板。
- `.opencode/template/TestReport.template.md`: Step 8 測試報告模板。
- `.opencode/template/.env.playwright.template`: 目標站台需要登入時，用來產出本次 workflow Playwright 環境檔的模板。
- `testing-artifact/handoff/RunReport.md`: runtime workflow 狀態檔與交接主檔。
- `testing-artifact/scripts/`: Playwright 測試腳本集中放置目錄。
- `testing-artifact/deliverables/`: 最終交付給人類閱讀的成果目錄。

## 固定流程

| Step | 目的 | 核心輸出 |
| --- | --- | --- |
| 0 | 檢查 `testing-artifact/handoff/RunReport.md` 狀態 | `testing-artifact/handoff/RunReport.md` |
| 1 | 檢查輸入資訊 | 輸入缺漏清單 |
| 2 | 與使用者問答補充輸入資訊 | `testing-artifact/handoff/InputSummary.md` |
| 3 | 閱讀開發文件 | `testing-artifact/handoff/DocsBaseline.md` |
| 4 | 依文件與輕量 Playwright 探測判定是否需要登入，必要時再向使用者確認 | 登入需求判定 / `testing-artifact/deliverables/.env.playwright` |
| 5 | 使用 Playwright 依文件掃描站台頁面 | `testing-artifact/handoff/SiteScanSummary.md` |
| 6 | 產出測試計畫、測試案例與測試腳本 | `testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts` |
| 7 | 執行測試腳本 | `testing-artifact/handoff/ExecutionSummary.md` |
| 8 | 產出測試報告 | `testing-artifact/deliverables/TestReport.md` |

流程順序摘要：

0. 檢查 `testing-artifact/handoff/RunReport.md` 狀態
1. 檢查輸入資訊
2. 與使用者問答補充輸入資訊
3. 閱讀開發文件
4. 依文件與輕量 Playwright 探測判定是否需要登入，必要時再向使用者確認
5. 使用 Playwright 依文件掃描站台頁面
6. 產出測試計畫、測試案例與測試腳本
7. 執行測試腳本
8. 產出測試報告

## Step 0 規則

- workflow 每次啟動時都必須先檢查 `testing-artifact/handoff/RunReport.md`。
- 若檔案不存在，視為新工作，先確認並建立 `testing-artifact/handoff/` 與 `testing-artifact/deliverables/`，再以 `.opencode/template/RunReport.template.md` 建立 `testing-artifact/handoff/RunReport.md`，最後從 Step 1 開始。
- 若檔案存在，先讀取 `Status`、`Current Step`、`Checklist`、`Blocking Issues`。
- 僅允許從第一個未完成步驟續跑，不得任意跳步或重置已完成步驟。
- 若 `Status=DONE`，預設不續跑，除非使用者明確要求開新工作或重啟 workflow。

## 必填與選填輸入

### 必填

- `target_url`: 測試目標網址
- `dev_docs_path`: 開發文件路徑

### 選填

- `source_code_path`: 原始碼路徑
- `playwright_max_depth`: Playwright 掃描深度上限
- `playwright_max_pages`: Playwright 最多掃描頁數
- `playwright_headless`: Playwright 是否以 headless 執行

### 輸入確認規則

- Step 2 補齊輸入時必須採用一問一答；一次只問一個欄位。
- 提問順序固定為：先補齊必填欄位，再逐一確認選填欄位。
- `source_code_path` 若未提供，必須明確記錄為 `none`。
- `playwright_max_depth` 若未提供，必須明確記錄為 `default(3)`。
- `playwright_max_pages` 若未提供，必須明確記錄為 `default(20)`。
- `playwright_headless` 若未提供，必須明確記錄為 `default(true)`。
- 在 Step 2 完成前，`testing-artifact/handoff/InputSummary.md` 不可保留意義不明的空白選填欄位。

## 狀態規則

- `NEW`: 新工作，尚未開始。
- `IN_PROGRESS`: 已開始，仍有未完成步驟。
- `BLOCKED`: 缺少必要資訊或外部條件未滿足，必須中止等待使用者處理。
- `DONE`: 全部完成。
- `FAILED`: 執行中發生錯誤且未能完成。

## BLOCK 條件

任一步驟若缺少必要項目，workflow 必須：

1. 更新 `testing-artifact/handoff/RunReport.md`
2. 將 `Status` 設為 `BLOCKED`
3. 寫明 `Blocking Issues`
4. 寫明 `Next Action`
5. 停止後續步驟

若第 4 步判定網站需要登入，流程必須：

1. 由 `.opencode/template/.env.playwright.template` 產出 `testing-artifact/deliverables/.env.playwright`
2. 提示使用者填寫 `testing-artifact/deliverables/.env.playwright`
3. 將狀態設為 `BLOCKED`
4. 停止後續步驟

## 續跑與停點規則

- workflow 預設必須連續執行；若某一步完成且狀態不是 `BLOCKED`、`FAILED`、`DONE`，就必須自動接續下一步。
- 合法停點只允許發生在以下情況：Step 2 一問一答補輸入中、Step 4 登入需求無法明確判定、缺少登入憑證、任一步驟進入 `BLOCKED`、任一步驟進入 `FAILED`、或整體 workflow 已 `DONE`。
- 單純的進度回報不是合法停點；workflow 不得因為某一步完成就等待使用者輸入 `continue`、`確認是否繼續` 或其他批准訊號。
- Step 5 成功完成後必須直接進入 Step 6；Step 6 成功完成後必須直接進入 Step 7；Step 7 成功完成後必須直接進入 Step 8。
- Step 8 完成後應直接結束為 `DONE`，不再等待額外確認。

## Step 3 文件基線規則

- Step 3 的產物不是摘要筆記，而是 Step 4-8 的正式測試設計輸入。
- 文件判讀至少要整理：功能清單、頁面或路由清單、角色與權限矩陣、核心流程、例外流程、商業規則、測試資料或前置條件、環境限制。
- 文件判讀需保留可驗證線索，例如 UI 文案、明確入口、可觀測元件、API 或 network clue、受保護頁面、SSO 線索。
- 若文件之間互相矛盾，必須記錄在 `Known Risks / Constraints`，並在 Step 5 掃站時優先驗證。
- 若文件缺失導致無法判定流程邊界，必須在 `Open Questions` 或 `Known Risks / Constraints` 中標示，避免 Step 6 憑空補完。

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

## Step 5 掃站規則

- Step 5 必須拿 `testing-artifact/handoff/DocsBaseline.md` 當對照基線，不可脫離文件重新自由探索。
- 掃站至少要整理：實際入口、可達頁面、阻塞頁面、主流程節點、關鍵互動元件、與文件不一致之處、可自動化測試的候選目標。
- 若文件宣稱存在某功能或頁面，但掃站找不到，必須在 `Document Mismatches` 記錄，而不是默默忽略。
- 若掃站觀察到額外風險，例如 unstable selector、非同步載入、權限切換、資料相依，必須回寫給 Step 6 使用。

## Step 6 測試設計規則

- Step 6 必須同時使用 `DocsBaseline` 與 `SiteScanSummary`，不可只依賴其中一者。
- `TestPlan` 至少要定義：測試目標、範圍、排除範圍、假設、風險、資料策略、環境依賴、覆蓋重點、完成定義。
- `TestCases` 必須逐筆記錄來源追溯，至少能對應到文件章節、頁面或流程節點、風險來源之一。
- 每個 critical flow 至少要有 1 筆正向案例；若文件或站台顯示驗證規則、權限限制、條件分支或邊界條件，必須補上對應負向或邊界案例。
- `TestScript` 必須以 `TestCases` 為唯一正式來源，測試名稱需對應 case ID，並包含明確 assertion，不可只保留 `goto` 或 URL smoke check。
- 若文件與掃站結果互相矛盾，必須在 `TestPlan` 與 `TestReport` 中保留風險說明，不得在腳本中自行假設不存在的流程。

## Step 7-8 結果追溯規則

- Step 7 的執行摘要需標示已執行 case ID、成功與失敗案例、主要錯誤原因與重現線索，並保留可直接回填 Step 8 的案例逐項結果。
- Step 8 的最終報告需回扣 `TestPlan` 與 `TestCases`，明確區分已覆蓋、未覆蓋與受阻範圍，且不可只提供 summary，必須逐項列出每個 case 的結果與證據。
- 若有文件與站台不一致造成測試風險，必須在最終報告中保留殘餘風險與建議。
- workflow 進入 `DONE` 時，對話回覆也必須直接總結測試結果，至少包含整體結果、Passed / Failed / Blocked / Skipped 摘要、主要失敗原因、未覆蓋範圍、殘餘風險，以及 `testing-artifact/deliverables/TestReport.md` 與 `testing-artifact/handoff/ExecutionSummary.md` 路徑。

## 憑證與 `.env.playwright` 規則

- `testing-artifact/deliverables/.env.playwright` 只作為 Playwright 執行時的憑證來源。
- agent 可以知道憑證檔位置，但不得讀取、展開、轉述或摘要 `.env.playwright` 的實際內容。
- 若 Step 5 或後續測試需要登入，必須由 Playwright 在執行時自行載入 `.env.playwright` 中的環境變數完成登入。
- agent 只可根據 Playwright 執行結果記錄「登入成功 / 失敗 / 缺少必要變數」，不得在任何 handoff 或 deliverable 中寫出 secret 值。

## RunReport 結構

建議由 workflow 維護以下內容：

```md
# Workflow 執行報告

## 中繼資料
- Status: NEW
- Current Step: Step 0
- Last Updated: 2026-03-23 00:00

## 輸入
- Target URL:
- Dev Docs Path:
- Source Code Path:
- Playwright Max Depth:
- Playwright Max Pages:
- Playwright Headless:

## 驗證
- Requires Login: unknown
- Credential Source: testing-artifact/deliverables/.env.playwright

## 阻塞問題
- None

## 產物
- Handoff Root: testing-artifact/handoff/
- Deliverables Root: testing-artifact/deliverables/
- Docs Baseline: testing-artifact/handoff/DocsBaseline.md
- Site Scan Summary: testing-artifact/handoff/SiteScanSummary.md
- Test Plan: testing-artifact/deliverables/TestPlan.md
- Test Cases: testing-artifact/deliverables/TestCases.md
- Test Script: testing-artifact/scripts/TestScript.ts
- Execution Summary: testing-artifact/handoff/ExecutionSummary.md
- Test Report: testing-artifact/deliverables/TestReport.md

## 檢查清單
- [ ] Step 0 - Check RunReport status
- [ ] Step 1 - Check input information
- [ ] Step 2 - Ask user to complete missing information
- [ ] Step 3 - Read development documents
- [ ] Step 4 - Determine whether login is required
- [ ] Step 5 - Scan pages with Playwright
- [ ] Step 6 - Generate test plan, cases, and scripts
- [ ] Step 7 - Execute test scripts
- [ ] Step 8 - Generate test report

## 備註
-

## 下一步
-
```

## Handoff 樣板

- `testing-artifact/handoff/InputSummary.md`: 整理 target url、文件路徑、原始碼路徑、Playwright 掃描參數、必填缺漏與選填欄位最終狀態，作為後續步驟輸入基線。
- `testing-artifact/handoff/DocsBaseline.md`: 整理功能範圍、頁面路由、角色與權限、流程規則、例外流程、測試前置條件與可觀測線索，作為文件基線。
- `testing-artifact/handoff/SiteScanSummary.md`: 整理實際掃描到的頁面、流程、互動元件、文件差異與可自動化節點，作為站台基線。
- `testing-artifact/handoff/ExecutionSummary.md`: 整理案例執行結果、逐項明細、失敗摘要與重現線索，作為最終報告輸入。

## Deliverables 樣板

- `testing-artifact/deliverables/TestPlan.md`: 測試範圍、假設、風險、資料策略與執行策略。
- `testing-artifact/deliverables/TestCases.md`: 測試案例清單、分類、來源追溯與驗證點。
- `testing-artifact/scripts/TestScript.ts`: 對應 case ID 的 Playwright 測試腳本。
- `testing-artifact/deliverables/TestReport.md`: 最終測試報告、覆蓋情況、逐項案例結果、風險與建議。

## 各步驟檔案規則

| Step | 讀取 | 建立/寫入 | 模板 | 備註 |
| --- | --- | --- | --- | --- |
| 0 | `testing-artifact/handoff/RunReport.md` | `testing-artifact/handoff/`、`testing-artifact/deliverables/`、`testing-artifact/scripts/`、`testing-artifact/handoff/RunReport.md` | `.opencode/template/RunReport.template.md` | 初始化或續跑入口 |
| 1-2 | `testing-artifact/handoff/RunReport.md` | `testing-artifact/handoff/InputSummary.md` | `.opencode/template/InputSummary.template.md` | 以一問一答補齊必填欄位，並確認 `source_code_path = value/none`、`playwright_max_depth = value/default(3)`、`playwright_max_pages = value/default(20)`、`playwright_headless = value/default(true)` |
| 3 | `testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/InputSummary.md` | `testing-artifact/handoff/DocsBaseline.md` | `.opencode/template/DocsBaseline.template.md` | 必須整理功能、頁面、權限、流程、商業規則、前置條件與測試線索 |
| 4 | `testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/InputSummary.md`、`testing-artifact/handoff/DocsBaseline.md` | `testing-artifact/deliverables/.env.playwright`（僅在需要登入且尚未存在時） | `.opencode/template/.env.playwright.template` | 可執行：對 `target_url` 做輕量 Playwright 探測以判定登入需求；若因登入憑證缺失而 `BLOCKED`，恢復執行時必須直接從 Step 4 接續，不得重置已完成的 Step 3 |
| 5 | `testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/DocsBaseline.md` | `testing-artifact/handoff/SiteScanSummary.md` | `.opencode/template/SiteScanSummary.template.md` | 必須對照 DocsBaseline，記錄可達頁面、關鍵流程、差異與自動化候選節點 |
| 6 | `testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/DocsBaseline.md`、`testing-artifact/handoff/SiteScanSummary.md` | `testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts` | `.opencode/template/TestPlan.template.md`、`.opencode/template/TestCases.template.md`、`.opencode/template/TestScript.template.ts` | Step 7 的固定輸入來源；案例需有來源追溯，腳本需對應 case ID 與明確 assertion |
| 7 | `testing-artifact/handoff/RunReport.md`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts` | `testing-artifact/handoff/ExecutionSummary.md` | `.opencode/template/ExecutionSummary.template.md` | 若需要登入：由 Playwright 在執行時載入 `testing-artifact/deliverables/.env.playwright`，agent 不得讀取其內容；需整理 case ID 層級結果與逐項明細 |
| 8 | `testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/ExecutionSummary.md`、`testing-artifact/handoff/ExecutionRaw.json`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md` | `testing-artifact/deliverables/TestReport.md` | `.opencode/template/TestReport.template.md` | 最終產出報告，需說明已覆蓋、未覆蓋、阻塞範圍與殘餘風險，並逐項列出每筆案例結果 |

## 指令設計

| 指令 | 範圍 | 用途 |
| --- | --- | --- |
| `/workflow-e2e` | Step 0-8 | 唯一主控入口；先檢查 `testing-artifact/handoff/RunReport.md`，不存在則用 template 初始化，存在則續跑 |
| `/subworkflow-e2e-input` | Step 1-2 | 輸入檢查、補齊缺漏 |
| `/subworkflow-e2e-docs` | Step 3-4 | 文件整理與登入需求判定 |
| `/subworkflow-e2e-scan` | Step 5 | 站台掃描與文件差異整理 |
| `/subworkflow-e2e-generate` | Step 6 | 產出測試計畫、測試案例、測試腳本 |
| `/subworkflow-e2e-run` | Step 7 | 執行測試腳本並整理案例結果 |
| `/subworkflow-e2e-report` | Step 8 | 產出測試報告 |

子流程主要用途是局部補跑、除錯與人工介入；正式使用時仍以 `/workflow-e2e` 為主。

## 建議使用方式

1. 執行 `/workflow-e2e`
2. 若 workflow 提示 `BLOCKED`，先處理 `testing-artifact/handoff/RunReport.md` 指出的缺失
3. 如為登入需求，先填寫 `testing-artifact/deliverables/.env.playwright`
4. 補齊後再次執行 `/workflow-e2e`

## 規格驗證

- 開發規格驗證：`node testing-e2e/scripts/verify-workflow-dev.mjs`
- runtime 版本驗證：`node testing-e2e/scripts/verify-workflow.mjs`
- 開發期同步驗證：`node testing-e2e/scripts/verify-workflow-sync.mjs`
- 使用時機：
  - `verify-workflow-dev.mjs`: 編修 `testing-e2e/` 開發版規格後，用來確認 source 規格本身正確。
  - `verify-workflow.mjs`: 測試或交付 `.opencode/` 正式版前，用來確認 runtime 版本單獨存在時仍完整可執行。
  - `verify-workflow-sync.mjs`: 只在開發與測試 workflow 時使用，用來確認 `testing-e2e/` 與 `.opencode/` 目前逐檔完全一致。
- 開發規格驗證內容包含：流程步驟、狀態值、必要 sections、來源追溯欄位、`testing-e2e/commands/workflow-e2e.md` 是否符合 runtime 路徑規格
- runtime 驗證內容包含：`.opencode/commands/` 與 `.opencode/template/` 是否存在必要檔案與關鍵片段；不假設 `testing-e2e/` 與 `.opencode/` 會在正式執行時共存
- 開發期同步驗證內容包含：`testing-e2e/commands/` 與 `.opencode/commands/`、`testing-e2e/template/` 與 `.opencode/template/` 是否逐檔完全一致
- 樣板來源檔放在 `testing-e2e/template/`，內容對應 runtime `.opencode/template/` 結構

## 設計原則

- `README.md` 負責說明規則與架構。
- `commands/*.md` 負責固定 prompt 流程與最低品質門檻。
- `template/*.md` 與 `template/*.ts` 負責限制 handoff、deliverable 與測試腳本骨架的欄位完整度。
- `testing-artifact/handoff/RunReport.md` 負責 runtime 狀態持久化與步驟交接。
- `testing-artifact/deliverables/` 負責最終交付成果。
- workflow 每次執行都必須先讀取現況，再決定下一步。
