---
description: 執行 testing-e2e 已產出的 Playwright 腳本並完成結果歸檔
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, e2e-testing, playwright-skill, code-review-checklist, verification-before-completion`

路徑規則唯一來源：`testing-e2e/commands/rule-testing-e2e-path.md`

目標：

- 以 `workflow-testing-e2e` 產出的文件與腳本為唯一測試基線，執行 Playwright 並完成報告交接。
- 優先使用 Playwright MCP 進行執行前站台/流程可觀測檢查；正式批次執行以 Playwright CLI 為主。

建議輸入格式：

- `<測試範圍> --artifact-dir <path> [--test-path <path>] [--site-url <url>] [--secrets-file <path>] [--grep <pattern>]`
- 預設值：
  - `--artifact-dir testing-artifacts/playwright`
  - `--test-path testscripts/playwright`
  - `--secrets-file .env.playwright`

執行前必要輸入（全部需可讀）：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
2. `--artifact-dir/workflow-handoff/[WORKFLOW]SITE-BASELINE.md`
3. `--artifact-dir/workflow-handoff/[WORKFLOW]SCRIPT-VALIDATION.md`
4. `--artifact-dir/workflow-handoff/[WORKFLOW]RUN-REPORT.md`
5. `--artifact-dir/workflow-deliverables/TEST-PLAN.md`
6. `--artifact-dir/workflow-deliverables/TEST-CASES.md`
7. `--artifact-dir/workflow-deliverables/TEST-SCRIPT-REPORT.md`
8. 測試腳本目錄（`testscripts/playwright/` 或 `--test-path`）

Execution Readiness Gate（強制，未通過不得執行）：

1. 解析實際測試 URL（優先序：`--site-url` > `INPUT-SNAPSHOT.siteUrl`）
2. 回報即將測試的完整 URL 並取得使用者確認
3. 執行站台可達性預檢（可用 Playwright MCP 或等效方式）
4. 若 `SITE-BASELINE.requiresSecrets=true`：
   - 檢查 `--secrets-file` 是否存在
   - 檢查 `SITE-BASELINE.requiredSecretKeys` 對應鍵是否皆非空
   - 若檔案缺失且存在 `workflow-deliverables/.env.playwright.template`，提醒使用者依樣板填值
   - 任一鍵缺失/空值 -> `BLOCKED(environment)`
5. 若 `SITE-BASELINE.requiresSecrets=unknown` -> `BLOCKED(input-missing)`
6. 若 `SCRIPT-VALIDATION.result != Pass` -> `BLOCKED(test-asset)`
7. 若 `[WORKFLOW]RUN-REPORT.CurrentState` 不在 `VALIDATED | EXECUTED` -> `BLOCKED(test-asset)`

執行規範：

1. 僅執行既有腳本，不在本流程大量重生腳本
2. 執行命令：
   - 若提供 `--test-path`：`yarn playwright test <test-path>`
   - 若提供 `--grep`：附加 `--grep <pattern>`
   - 否則：`yarn playwright test`
3. 導頁類案例（route/hyperlink/redirect）需以 URL + 目標頁關鍵元素共同判定
4. 失敗分類：`spec | implementation | environment | test-asset`
5. 不得在 console/log/report/blocker 回顯敏感值，只可顯示鍵名與是否已設定
6. 可使用 Playwright MCP 做失敗重現與定位（例如確認導頁、可見文字、互動結果），但不可以內部實作狀態作為通過依據

寫出檔案：

1. `--artifact-dir/workflow-deliverables/TEST-REPORT.md`
2. `--artifact-dir/workflow-deliverables/[TEST]BLOCKERS.md`（條件式：僅阻塞時）
3. `--artifact-dir/workflow-handoff/[WORKFLOW]RUN-REPORT.md`（更新 `CurrentState/FinalStatus/StageResults/NextAction`）

`TEST-REPORT.md` 最小內容：

- Gate 結果（Pass/Fail/Blocked）
- 測試摘要（總數、通過、失敗、跳過）
- 失敗分類與風險（spec/implementation/environment/test-asset）
- 導頁覆蓋結果與缺口（Route/Hyperlink/Redirect）
- 重跑命令（全量與本次子集）

完成回覆（強制）：

1. Gate 與總體結論（Pass/Fail/Blocked）
2. `TEST-REPORT.md` 實際路徑
3. Playwright report/artifacts 路徑與開啟方式
4. 若阻塞，提供對應 `NextAction`（回補 secrets、回補腳本、或回交規格/實作）
