---
description: 產出 Playwright 測試計畫、案例與腳本（含 secrets 補件與狀態交接）
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, e2e-testing, playwright-skill, verification-before-completion`

維護驗證（文件/規則調整時強制）：

- 執行 `node .opencode/scripts/verify-autoe2e-rules.mjs`
- 驗證失敗時，不得宣稱 workflow 規則已完成收斂

目標：

- 針對 `$ARGUMENTS` 產出可執行的 Playwright 測試資產（計畫/案例/腳本）。
- 使用「交接檔 + 交付檔 + 腳本目錄」分流管理產物。
- 若遇到 secrets 補件需求，必須可中斷並可由 `[WORKFLOW]RUN-REPORT.md` 續跑。

補件互動規範（強制，一問一答）：

1. preflight 階段必須採一問一答，每次只詢問一個欄位
2. 詢問順序：`scope` -> `site-url` -> `doc-path` -> 其餘非必要項
3. 每題需同時提供：欄位用途、預設值（若有）、格式限制
4. 使用者回覆後需立即回顯並確認（例如「你輸入的是 X，是否確認？」）
5. 全欄位收集後需輸出最終快照並做一次總確認；未確認不得進下一步
6. `run-mode=resume` 時僅補問缺漏/衝突欄位，不得重問已確認欄位
7. 若輸入非法（URL/正整數/空字串），需在同一欄位持續追問直到合法
8. 若存在 `[WORKFLOW]RUN-REPORT.md.InputSnapshotCache` 且關鍵欄位未變更，可沿用已確認欄位，不需重複詢問

輸入資訊重用規則（強制）：

1. preflight 完成並經使用者總確認後，必須回寫 `[WORKFLOW]RUN-REPORT.md.InputSnapshotCache`
2. `InputSnapshotCache` 最小欄位：`siteUrl`、`docPath`、`srcPath`、`artifactDir`、`scriptsDir`、`requiredSecretKeys`（僅鍵名）、`confirmedAt`、`snapshotHash`
3. 必須回寫 `[WORKFLOW]RUN-REPORT.md.ReusePolicy`：`reuseAllowed`、`reuseReason`、`invalidatedBy`
4. `run-mode=resume` 且 `snapshotHash` 未變時：可跳過已確認欄位，只補問缺漏或衝突欄位
5. 任一關鍵輸入變更（`site-url`、`doc-path`、`src-path`、`requiredSecretKeys` 契約）需標記 `invalidatedBy`，並重新做總確認
6. `run-mode=new` 一律不沿用舊快照，必須重新確認
7. `InputSnapshotCache` 與所有交接/交付文件不得記錄 secrets 真值

必要項（缺一不可）：

1. `scope`（測試範圍）
2. `site-url`
3. `doc-path`

非必要項（需提供預設值並逐項請使用者確認）：

- `src-path`（預設：`(none)`）
- `artifact-dir`（預設：`testing-autoe2e-artifacts/playwright`）
- `scripts-dir`（預設：`<artifact-dir>/workflow-scripts`）
- `secrets-file`（預設：`.env.playwright`）
- `scan-depth`（預設：`3`）
- `max-routes`（預設：`30`）
- `scan-timeout-sec`（預設：`300`）
- `run-mode`（預設：`new`）

目錄與命名規則（強制）：

1. `--artifact-dir` 只作根目錄，不可直接落檔
2. 交接檔：`--artifact-dir/workflow-handoff/`
3. 交付檔：`--artifact-dir/workflow-deliverables/`
4. 腳本：`--artifact-dir/workflow-scripts/`（或 `--scripts-dir`）
5. 交接檔檔名一律以 `[WORKFLOW]` 開頭

初始化規則：

1. 進入流程先建立 `workflow-handoff/`、`workflow-deliverables/`、`workflow-scripts/`
2. `run-mode=new` 時，清理上一輪由本流程產生的：
   - `workflow-handoff/[WORKFLOW]*`
   - `workflow-deliverables/TEST-PLAN.md`
   - `workflow-deliverables/TEST-CASES.md`
   - `workflow-deliverables/TEST-SCRIPT-REPORT.md`
   - `workflow-deliverables/INPUT-GAP.md`（若存在）
3. 不得刪除或覆寫 `--secrets-file`
4. 主流程必須先初始化 `workflow-handoff/[WORKFLOW]RUN-REPORT.md`
5. `run-mode=resume` 僅允許在 `[WORKFLOW]RUN-REPORT.md.CurrentState=BLOCKED` 時使用

執行步驟（強制）：

1. Input Preflight
   - 透過對話補齊必要項，直到 `scope/site-url/doc-path` 齊備
   - 非必要項提供預設並逐項確認
   - URL 僅接受 `http://` 或 `https://`
2. 站台掃描（Playwright MCP 優先）
   - 以 `site-url` 執行黑箱觀測（主要路由、導頁、關鍵互動）
   - 產出可觀測基線並判定 `requiresSecrets=true|false|unknown`
3. secrets 早期判定與補件（early gate）
   - 若可判定 `requiresSecrets=true` 且 secrets 未就緒：
     - 立即產生 `workflow-deliverables/.env.playwright.template`（只含鍵名/註解）
     - 立即更新 `workflow-handoff/[WORKFLOW]RUN-REPORT.md` 為 `BLOCKED`
     - `NextAction` 必須明確指向：填寫 `--secrets-file` 後以 `resume` 續跑
     - 本次流程在此停止，不得繼續規格解析或腳本產出
4. 規格解析（僅在 early gate 通過時）
   - 讀取 `doc-path` 內規格文件作為案例來源
   - 若有 `src-path`，僅作補充，不得覆蓋站台觀測事實
5. 產出文件與腳本
   - 產出 `TEST-PLAN.md`、`TEST-CASES.md`
   - 產出 Playwright scripts 至 `workflow-scripts/`
   - 產出 `TEST-SCRIPT-REPORT.md`（CaseID -> ScriptPath -> TestTitle）
6. 完成回寫與下一步
   - 更新 `[WORKFLOW]RUN-REPORT.md` 階段結果
   - 成功時提示下一步：`/workflow-testing-autoe2e-execute-playwright`

交接檔（workflow-handoff，最小欄位）：

1. `[WORKFLOW]INPUT-SNAPSHOT.md`
   - `scope`、`siteUrl`、`docPath`、`srcPath`、`artifactDir`、`scriptsDir`、`secretsFile`、`scanDepth`、`maxRoutes`、`scanTimeoutSec`、`confirmed`
2. `[WORKFLOW]SPEC-BASELINE.md`
   - `sourceFiles`、`acItems`、`taskItems`、`gaps`、`requiredSecretKeysHint`
3. `[WORKFLOW]SITE-BASELINE.md`
   - `siteUrl`、`reachable`、`observedRoutes`、`navigationFindings`、`authSignals`、`requiresSecrets`、`requiredSecretKeys`、`mcpUsed`、`mcpFallbackReason`、`risks`
4. `[WORKFLOW]RUN-REPORT.md`
   - `WorkflowType`、`CurrentState`、`FinalStatus`、`InputSnapshot`、`InputSnapshotCache`、`ReusePolicy`、`StageResults`、`BlockerType`、`NextAction`

交付檔（workflow-deliverables）：

1. `TEST-PLAN.md`
2. `TEST-CASES.md`
3. `TEST-SCRIPT-REPORT.md`
4. `.env.playwright.template`（條件式）
5. `INPUT-GAP.md`（條件式）

腳本輸出（workflow-scripts）：

- Playwright `.spec.ts` 腳本
- 每個測試標題需直接包含 `CaseID`
- 導頁案例需同時驗證 URL 與目標頁關鍵元素
- 涉及敏感資訊僅可使用 `process.env.*`，不得硬編碼

`[WORKFLOW]RUN-REPORT.md` 建議狀態：

- `CurrentState`: `PRECHECK | SITE_SCANNED | SPEC_ANALYZED | DOCS_DONE | SCRIPTS_DONE | VALIDATED | BLOCKED`
- `FinalStatus`: `Pass | Fail | Blocked`
- `BlockerType`: `input-missing | environment | spec | test-asset`

完成回覆（強制）：

1. 本次狀態（Pass/Fail/Blocked）
2. 產物路徑（handoff/deliverables/scripts）
3. 若阻塞：缺少項目、建議預設值、resume 指令
4. 若完成：下一步指令 `/workflow-testing-autoe2e-execute-playwright`
