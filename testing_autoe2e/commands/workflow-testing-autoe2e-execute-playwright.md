---
description: 執行 workflow-scripts 的 Playwright 測試並回報結果
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, e2e-testing, playwright-skill, verification-before-completion`

維護驗證（文件/規則調整時強制）：

- 執行 `node .opencode/scripts/verify-autoe2e-rules.mjs`
- 驗證失敗時，不得宣稱 execute workflow 規則已完成收斂

目標：

- 承接規劃階段已產出的 Playwright 腳本並執行測試。
- 先做連線與環境 Gate，再做正式批次執行。
- 輸出可追溯的測試報告與阻塞資訊。

補件互動規範（強制，一問一答）：

1. execute 階段僅在缺件或衝突時啟動一問一答
2. 每次只詢問一個欄位，先必要項（`site-url`）再非必要項
3. 每題需提供預設值與格式限制，並在回覆後做單欄位確認
4. 若 `workflow-scripts/` 無腳本，需以單題確認是否回到規劃流程產生腳本
5. 所有補件完成後，需回顯本次執行快照並做一次總確認再執行
6. 若輸入非法（URL/路徑空字串），需在同一欄位持續追問直到合法
7. 若存在 `[WORKFLOW]RUN-REPORT.md.InputSnapshotCache` 且與本次執行一致，可跳過重複確認，僅補問缺漏/衝突欄位

必要項：

1. `site-url`

非必要項（需提供預設並確認）：

- `artifact-dir`（預設：`testing-autoe2e-artifacts/playwright`）
- `scripts-dir`（預設：`<artifact-dir>/workflow-scripts`）
- `secrets-file`（預設：`.env.playwright`）
- `grep`（預設：`(none)`）

路徑與命名規則（強制）：

1. 交接檔只寫入 `workflow-handoff/` 且檔名以 `[WORKFLOW]` 開頭
2. 交付檔只寫入 `workflow-deliverables/`
3. 測試腳本只讀取 `workflow-scripts/`（或 `--scripts-dir`）
4. 是否可執行與是否屬於續跑，必須以 `workflow-handoff/[WORKFLOW]RUN-REPORT.md` 現況判定，不使用額外模式參數
5. execute 必須先讀取 `InputSnapshotCache` 與 `ReusePolicy` 判定是否可沿用既有確認結果

前置 Gate（未通過不得執行）：

1. 輸入檢查
   - 缺少 `site-url` 時，透過對話補齊後才可繼續
   - 若 `workflow-scripts/` 無腳本，需先告知並請使用者確認是否回到規劃流程產生腳本
2. 站台可達性檢查
   - 必須先用 `curl` 驗證目標站台可連入（記錄命令與結果）
   - 失敗時標記 `BLOCKED(environment)`，不得直接執行測試
3. 執行環境檢查
   - Node.js、npm、Playwright 依賴、browser binaries
   - 缺依賴可嘗試 `npm ci`（或必要時 `npm install`）
   - 缺 browser binaries 可嘗試 `npm exec playwright install`
4. secrets readiness（條件式）
   - 若案例需要 secrets，檢查 `--secrets-file` 與必要鍵是否已填值
   - 不得在任何報告輸出 secrets 真值

執行規範：

1. 正式命令一律使用 `npm exec playwright test`
2. 指令樣式：
   - `npm exec playwright test <scripts-dir>`
   - 若有 `--grep`，附加 `--grep <pattern>`
3. 正式失敗後，可做一次有新證據的定向重現（例如 `--grep` 子集合）
4. 禁止無新資訊的等價重跑

輸出檔案：

1. `workflow-deliverables/TEST-REPORT.md`
2. `workflow-deliverables/[TEST]BLOCKERS.md`（條件式：阻塞或關鍵失敗）
3. `workflow-handoff/[WORKFLOW]RUN-REPORT.md`（更新 execute 階段狀態）

`TEST-REPORT.md` 最小內容：

- Gate 結果（Pass/Fail/Blocked）
- 執行基線：`siteUrl`、`scriptsDir`、`grep`、`projectRoot`
- `curl` 可達性檢查證據（命令與摘要結果）
- 環境 readiness（Node/npm/dependencies/browser）
- 測試摘要（total/pass/fail/skip）
- 失敗分類（`spec | implementation | environment | test-asset`）
- 失敗案例追溯（`CaseID/TestTitle`）
- Playwright report/artifacts 路徑
- 若有重現：記錄重現命令、證據與結論

`[WORKFLOW]RUN-REPORT.md` execute 回寫欄位：

- `StageResults.execute.status`: `Pass | Fail | Blocked`
- `StageResults.execute.artifacts`: `TEST-REPORT.md`、`[TEST]BLOCKERS.md`（條件式）
- `StageResults.execute.keyNotes`: `gateResult`、`curlReadiness`、`environmentReadiness`、`testSummary`、`failureClassification`、`rerunCommand`
- `CurrentState`: `EXECUTED | BLOCKED`
- `FinalStatus`: `Pass | Fail | Blocked`
- `ReusePolicy.reuseAllowed/reuseReason/invalidatedBy`（若本次有重用或失效判定，需更新）

阻塞處理規範：

1. `input-missing`：缺少必要輸入或無法判定執行目標
2. `environment`：站台不可達、依賴/環境不可用
3. `test-asset`：腳本缺漏、腳本不可執行、CaseID 對應失敗
4. `spec` / `implementation`：由失敗證據可明確歸類時使用

完成回覆（強制）：

1. Gate 與總結論（Pass/Fail/Blocked）
2. `TEST-REPORT.md` 路徑
3. Playwright report/artifacts 路徑與查看方式
4. 若阻塞：`[TEST]BLOCKERS.md` 路徑與 `NextAction`
