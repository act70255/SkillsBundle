---
description: 一次完成 Chrome DevTools 測試的 plan -> genscript -> execute 總流程
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, browser-automation, webapp-testing, systematic-debugging, verification-before-completion`

目標：

- 針對 $ARGUMENTS 串接執行 Chrome DevTools 三階段流程：
  1) `/workflow-testing-plan-chromedevtools`
  2) `/workflow-testing-genscript-chromedevtools`
  3) `/workflow-testing-execute-chromedevtools`
- 本指令為總控流程；使用者只需呼叫一次 `/workflow-testing-chromedevtools`，後續子流程由本流程依序調用

建議輸入格式：

- `<測試範圍> --site-url <url> [--src-path <path>] [--test-path <path>] [--artifact-dir <path>]`
- 無參數模式可直接執行 `/workflow-testing-chromedevtools`，但若缺 `--site-url`，需先向使用者確認目標站台 URL

執行前補件機制（必做）：

1. 先做 `Preflight Input Check`，彙整本次最小必要資訊：
   - `測試範圍`（目標模組/功能/流程）
   - `SITE URL`（`--site-url`）
   - `src-path`（可省略，預設 `src`，若不存在則用工作區根目錄）
   - `test-path`（可省略，預設 `testscripts/chrome-devtools`）
   - `artifact-dir`（可省略，預設 `testing-artifacts/chromedevtools`）
2. 若缺少必要資訊（至少包含 `測試範圍` 與 `SITE URL`），不得直接執行子流程；需先向使用者逐項確認與補齊
3. 補件完成後，先回報「最終參數快照」並取得使用者確認，再開始 `plan -> genscript -> execute`
4. 若使用者在補件階段變更路徑參數（`--src-path`/`--test-path`/`--artifact-dir`），後續三階段必須使用同一組最終值
5. 若使用者未確認最終參數，流程保持待命，不得進入 `plan`

詢問順序（互動規範）：

1. 必要項必須「依序逐項詢問」：
   - 先問 `測試範圍`
   - 再問 `SITE URL`
2. 可選項在必要項確認後，需先統一詢問「是否要指定」：
   - `--src-path`（未指定則用 `src`，若不存在則改用工作區根目錄）
   - `--test-path`（未指定則用 `testscripts/chrome-devtools`）
   - `--artifact-dir`（未指定則用 `testing-artifacts/chromedevtools`）
3. 若使用者回答不指定可選項，需明確回報將套用的預設值與略過項目

測試方式差異（Chrome DevTools，規劃必看）：

1. 規劃重點是瀏覽器可觀測行為（URL、DOM、可見文字、互動結果），不可依賴內部實作狀態
2. `execute` 前必須完成 SITE URL 確認與可達性預檢（DNS/連線/TLS/HTTP 狀態）
3. 若站台不可達或目標環境不明，先判定為環境阻塞，不推測產品內部行為

流程規範：

1. 必須嚴格依序執行 `plan -> genscript -> execute`，不可跳步
2. 參數需一致傳遞到三個子流程（同一批次不得混用不同 `--artifact-dir`）
3. `plan` 完成後，需確認下列最小輸入已存在，再進入 `genscript`：
   - `testing-artifacts/chromedevtools/TEST-PLAN.md`（或 `--artifact-dir/TEST-PLAN.md`）
   - `testing-artifacts/chromedevtools/TEST-CASES.md`（或 `--artifact-dir/TEST-CASES.md`）
   - `testing-artifacts/chromedevtools/ACCEPTANCE-CRITERIA.md`（或 `--artifact-dir/ACCEPTANCE-CRITERIA.md`）
4. `genscript` 完成後，需確認已產出：
   - Chrome DevTools 腳本（`testscripts/chrome-devtools/` 或 `--test-path`）
   - `testing-artifacts/chromedevtools/TEST-SCRIPT-REPORT.md`（或 `--artifact-dir/TEST-SCRIPT-REPORT.md`）
5. `execute` 階段需遵守 SITE URL 先確認原則：
   - 在執行 G1~G4 前，先回報並確認完整 SITE URL
   - 若 URL 不可達，立即停止並回報，不得進行品質閘
6. 任一階段失敗即停止（Fail-fast），不得假設後續結果
7. 本總流程預設不修改產品程式碼；若 `execute` 子流程判定需修復產品實作，應先回報風險與處置，再依子流程交接規範回交 `dev-*`
8. 若任一子流程回報「輸入不足/文件缺失」，需回到補件機制，完成補件後才可重試該階段

狀態機（執行狀態）：

- `PRECHECK`：補件與最終參數確認中（未確認不得進入下一階段）
- `PLAN_DONE`：`plan` 成功且已產出 `TEST-PLAN/TEST-CASES/ACCEPTANCE-CRITERIA`
- `SCRIPT_DONE`：`genscript` 成功且已產出腳本與 `TEST-SCRIPT-REPORT`
- `EXEC_DONE`：`execute` 成功且已產出 `TEST-REPORT`
- `BLOCKED`：任一階段阻塞（缺件/環境/規格/實作），停止並等待補件或交接

決策表（Fail-fast / 路由）：

1. 若 `PRECHECK` 缺 `測試範圍` 或 `SITE URL` -> 停在 `PRECHECK`，逐項補件
2. 若 `plan` 後缺 `TEST-PLAN.md` 或 `TEST-CASES.md` 或 `ACCEPTANCE-CRITERIA.md` -> 回到 `plan`
3. 若 `genscript` 後缺腳本或 `TEST-SCRIPT-REPORT.md` -> 回到 `genscript`
4. 若 `execute` 前 SITE URL 未確認或可達性預檢失敗 -> 轉 `BLOCKED`（環境阻塞）
5. 若 `execute` 失敗且可修復 -> 修復後只重跑 `execute`；不可修復 -> 轉 `BLOCKED`

輸出（強制）：

1. `testing-artifacts/chromedevtools/WORKFLOW-RUN-REPORT.md`（或 `--artifact-dir/WORKFLOW-RUN-REPORT.md`）
   - 本次輸入參數快照
   - 三階段執行結果（Pass/Fail/Blocked）
   - 各階段關鍵產物路徑
   - 若中斷，需記錄中斷階段、原因與下一步建議
2. 若 execute 有阻塞，沿用 `testing-artifacts/chromedevtools/[TEST]BLOCKERS.md`（或 `--artifact-dir/[TEST]BLOCKERS.md`）

`WORKFLOW-RUN-REPORT.md` 統一欄位（建議固定輸出）：

- `WorkflowType`: `chromedevtools`
- `CurrentState`: `PRECHECK | PLAN_DONE | SCRIPT_DONE | EXEC_DONE | BLOCKED`
- `FinalStatus`: `Pass | Fail | Blocked`
- `InputSnapshot`: `scope/siteUrl/srcPath/testPath/artifactDir`
- `StageResults`: `plan/genscript/execute` 各自的 `status/artifacts/keyNotes`
- `BlockerType`（若有）: `spec | implementation | environment | test-asset | input-missing`
- `NextAction`: 下一步命令或補件指示

命令呼叫範例（由使用者輸入；文件不會自動執行）：

```bash
/workflow-testing-chromedevtools src/pages/Dashboard --site-url https://staging.example.com --src-path src/pages/Dashboard --test-path testscripts/chrome-devtools --artifact-dir testing-artifacts/chromedevtools
```

路由規則（重要）：

- 需要補齊測試規劃或 AC 基線：回到 `/workflow-testing-plan-chromedevtools`
- 需要補齊或重生腳本：回到 `/workflow-testing-genscript-chromedevtools`
- 僅需重跑驗證：直接執行 `/workflow-testing-execute-chromedevtools`
