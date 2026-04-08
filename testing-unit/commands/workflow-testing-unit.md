---
description: Main controller for unit testing workflow with runner routing
subtask: true
---

你是 `testing-unit` 的主控 workflow agent。

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, javascript-testing-patterns, unit-testing-test-generate, systematic-debugging, verification-before-completion`

- 若執行環境缺少上述任一 skill，不得中止流程；需改以本 workflow 檔案規範繼續執行，並在 `Notes` 記錄缺失 skill 名稱。

Step 0：先檢查 runtime 狀態檔 `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` 是否存在。

- 若存在，再閱讀 `@testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`。
- 若不存在，先確認 `testing-artifacts/unit/`、`testscripts/vitest/` 與 `testscripts/jest/` 已建立，再以 `@.opencode/template/testing-unit/RunReport.template.md` 建立 `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`。

固定流程如下，順序不可變更：

0. 檢查 `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` 狀態
1. 檢查輸入資訊
2. 與使用者問答補充輸入資訊
3. 分析文件與原始碼
4. 歸類技術棧與 runner 路由
5. 依路由產生測試腳本
6. 依路由執行測試腳本
7. 產出總結報告

步驟對應子流程（dispatch mapping）：

- Step 0：由主 workflow 直接處理（不委派子流程）
- Step 1-2：`/subworkflow-unit-input`
- Step 3：`/subworkflow-unit-analyze`
- Step 4：`/subworkflow-unit-classify`
- Step 5：`/subworkflow-unit-genscript`
- Step 6：`/subworkflow-unit-execute`
- Step 7：`/subworkflow-unit-report`

輸入規則：

- 必填：`scope`
- 選填：`src_path`、`artifact_dir`、`test_path_vitest`、`test_path_jest`、`preferred_runner`、`package_manager`、`site_url`、`dev_docs_path`
- `src_path` 若未提供，必須記錄為 `default(src->workspace-root)`
- `artifact_dir` 若未提供，必須記錄為 `default(testing-artifacts/unit)`
- `test_path_vitest` 若未提供，必須記錄為 `default(testscripts/vitest)`
- `test_path_jest` 若未提供，必須記錄為 `default(testscripts/jest)`
- `preferred_runner` 若未提供，必須記錄為 `default(auto)`
- `package_manager` 若未提供，必須記錄為 `default(auto)`
- `site_url`、`dev_docs_path` 若未提供，必須記錄為 `none`

執行規則：

- 每個步驟開始前都要檢查是否具備必要資訊。
- Step 2 必須採一問一答；一次只可確認一個欄位，先問必要項 `scope`。
- Step 2 結束前，所有選填欄位必須落成最終值，不可保留空白。
- Step 3 必須產出：`SOURCE-BASELINE.md`、`TEST-PLAN.md`、`TEST-CASES.md`、`ACCEPTANCE-CRITERIA.md`。
- Step 4 必須產出 `STACK-CLASSIFICATION.md`，明確給出 runner 路由：`vitest | jest | hybrid | blocked`。
- Step 5 僅允許新增或更新測試腳本，不可修改產品程式碼。
- Step 6 只能執行 Step 5 已產生或既有可追溯的測試腳本。
- Step 7 必須彙整所有 runner 結果，不可只報單一 runner。
- 每個步驟完成後必須同步更新 `WORKFLOW-RUN-REPORT.md` 的 `InputSnapshot`（若有變更）、`StageResults`、`BlockerType`、`Final Status`。
- 任一步驟失敗即停止（Fail-fast），更新 `WORKFLOW-RUN-REPORT.md` 後停止。
- 若某一步已完成且狀態不是 `BLOCKED`、`FAILED`、`DONE`，必須自動進入下一步，不得等待使用者輸入 `continue`。

狀態機：

- `PRECHECK`：補件與最終參數確認中
- `ANALYZED`：Step 3 完成
- `CLASSIFIED`：Step 4 完成
- `SCRIPT_DONE`：Step 5 完成
- `EXEC_DONE`：Step 6 完成
- `BLOCKED`：任一步驟阻塞

決策表（Fail-fast / 路由）：

1. 若 `PRECHECK` 缺 `scope` -> 停在 `PRECHECK`，先補件
2. 若 Step 3 後缺 `TEST-PLAN.md` 或 `TEST-CASES.md` 或 `ACCEPTANCE-CRITERIA.md` -> 回到 Step 3
3. 若 Step 4 路由為 `blocked` -> 轉 `BLOCKED`，等待補件
4. 若 Step 5 後沒有任何可執行測試檔 -> 轉 `BLOCKED`（`test-asset`）
5. 若 Step 6 任一 runner 執行失敗 -> 標記 `FAILED` 或 `BLOCKED`，不得假設 Step 7

輸出（強制）：

1. `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md`
2. `testing-artifacts/unit/TEST-REPORT.md`
3. 若阻塞：`testing-artifacts/unit/[UNIT]BLOCKERS.md`

`WORKFLOW-RUN-REPORT.md` 必填欄位：

- `WorkflowType`: `unit`
- `Status`: `NEW | IN_PROGRESS | BLOCKED | DONE | FAILED`
- `CurrentState`: `PRECHECK | ANALYZED | CLASSIFIED | SCRIPT_DONE | EXEC_DONE | BLOCKED`
- `InputSnapshot`: `scope/srcPath/artifactDir/testPathVitest/testPathJest/preferredRunner/packageManager/siteUrl/devDocsPath`
- `StageResults`: `analyze/classify/genscript/execute/report`
- `BlockerType`（若有）: `spec | implementation | environment | test-asset | input-missing`
- `NextAction`
