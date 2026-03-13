---
description: 執行 Chrome DevTools 測試、產出報告與阻塞交接
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, browser-automation, systematic-debugging, test-fixing, verification-before-completion`

目標：

- 執行 $ARGUMENTS 的 Chrome DevTools 測試流程並完成結果歸檔。

參數規範：

- 建議格式：`<變更範圍> --test-path <path>`
- 無參數模式：可直接執行 `/workflow-testing-execute-chromedevtools`；未提供任何參數時，預設執行 `testscripts/chrome-devtools/` 下腳本，並以 `testing-artifacts/chromedevtools/TEST-CASES.md` 作為案例基準
- 預設：若未傳入 `--test-path`，使用 `testscripts/chrome-devtools/`
- 網站目標：可用 `--site-url <url>` 明確指定本次測試站台
- 文件檔目錄：`--artifact-dir <path>`（預設 `testing-artifacts/chromedevtools`）

執行規範：

0. 執行前必做「SITE URL 確認」：
   - 先解析本次測試實際目標網址（優先序：`--site-url` > `CHROME_DEVTOOLS_BASE_URL` > 測試腳本/測試案例中可推導的預設網址）
   - 在執行任何品質閘前，必須先回報「即將測試的完整 SITE URL」並取得使用者確認
   - 取得確認後，先做站台可達性預檢（例如 `curl -I <SITE_URL>` 或等效方式）
   - 若預檢失敗（DNS 失敗、連線逾時、TLS/憑證錯誤、HTTP 5xx），立即停止並回報錯誤，要求使用者確認或提供可用 URL
   - 若解析結果為 `127.0.0.1` 或 `localhost`，不得直接開跑；需先明確詢問是否改用指定環境 SITE（例如 dev/staging URL）
   - 未取得確認前，禁止執行 G1~G4

1. 若 `testing-artifacts/chromedevtools/TEST-PLAN.md` 或 `testing-artifacts/chromedevtools/TEST-CASES.md` 缺失（或 `--artifact-dir` 對應檔案缺失），立即停止執行並提示先跑 `/workflow-testing-plan-chromedevtools`
2. 若 `testing-artifacts/chromedevtools/ACCEPTANCE-CRITERIA.md` 缺失（或 `--artifact-dir` 對應檔案缺失），立即停止執行並提示先跑 `/workflow-testing-plan-chromedevtools` 補齊 AC 基線
3. 依 `testing-artifacts/chromedevtools/TEST-PLAN.md` 與 `testing-artifacts/chromedevtools/TEST-CASES.md`（或 `--artifact-dir` 對應檔案）執行，不得自行改動測試目標
4. 依序執行品質閘（G1 -> G2 -> G3 -> G4）
5. 品質閘執行重點：
   - G3（E2E/流程驗證）以 Chrome DevTools 腳本為主，依 `testscripts/chrome-devtools/`（或 `--test-path`）執行
6. 先分類失敗原因（spec 問題 / 實作問題 / 環境問題）
7. 可修復者先修復並做回歸驗證，不可修復者標記阻塞

自動化腳本產出：

1. 本流程以執行既有腳本為主，不負責大量新腳本產生
2. 若腳本缺漏，先執行 `/workflow-testing-script-generate-chromedevtools` 再回到本流程

請輸出（強制）：

1. `testing-artifacts/chromedevtools/TEST-REPORT.md`（或 `--artifact-dir/TEST-REPORT.md`）
   - Gate 結果（Pass/Fail）
   - 測試執行摘要（總數、通過、失敗、跳過）
   - 已修復/未解決清單
   - 可回歸自動化覆蓋率說明

執行完成後回覆（強制）：

1. 測試結論摘要（Gate 與總體 Pass/Fail）
2. 「如何查看測試結果與報告」操作說明（至少包含）：
   - `TEST-REPORT.md` 實際路徑
   - Chrome DevTools 測試輸出/截圖/紀錄檔實際路徑（若有）
   - 若有可重跑命令，提供全量與子集重跑方式

條件式輸出：

- `testing-artifacts/chromedevtools/[TEST]BLOCKERS.md`（僅阻塞時；或 `--artifact-dir/[TEST]BLOCKERS.md`）

阻塞交接規範：

1. 若為規格阻塞：更新 `[SPEC]CHANGE-REQUEST.md`，切換 `planning` 執行 `/workflow-spec-update`
2. 若為實作阻塞：回交 `dev-*` 執行 implement 修復

模板參考：

- `.opencode/templates/TEST-PLAN.template.md`
- `.opencode/templates/TEST-CASES.template.md`
- `.opencode/templates/ACCEPTANCE-CRITERIA.template.md`
- `.opencode/templates/TEST-REPORT.template.md`
- `.opencode/templates/INPUT-GAP.template.md`
