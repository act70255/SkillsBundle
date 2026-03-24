---
description: E2E 子流程：使用 Playwright 黑箱分析目標站台
---

目標：

- 以 `site-url` 進行黑箱探索，建立可觀測行為基線。
- 由可觀測行為判定是否需要 secrets（例如遇到登入牆、受保護路由、2xx 前置登入導頁）。
- 優先使用 Playwright MCP 進行探測；若 MCP 不可用，需記錄原因並改用等效黑箱方式。

路徑規則唯一來源：`testing-e2e/commands/rule-testing-e2e-path.md`

讀取輸入：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
   - 使用 `scanDepth`、`maxRoutes`、`scanTimeoutSec` 作為探測上限

寫出檔案（內部交接）：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]SITE-BASELINE.md`

規範：

1. 觀測重點：主要路由、導頁（route/hyperlink/redirect）、關鍵互動、可見元素
2. 記錄每條路由/流程的成功訊號與失敗訊號
3. 若站台不可達，立即輸出環境阻塞並停止後續流程
4. 不得依賴內部實作狀態作為結論
5. 本子流程僅黑箱觀測；`src-path` 補強由 `subworkflow-testing-e2e-analyze-src-supplement` 處理
6. 需輸出 `authSignals`（例如 redirect to `/login`、401/403、登入表單可見）
7. 需輸出 `requiresSecrets`（`true|false|unknown`）與 `requiredSecretKeys`（僅鍵名）
8. 若 `requiresSecrets=true` 且 `--secrets-file` 不存在，需標記環境風險並要求後續產出 `.env` 樣板
9. 若 `requiresSecrets=unknown`，需在 `risks` 明確標記 `input-missing` 並列出待補證據，不得直接視為 `false`
10. 需在輸出中記錄 `mcpUsed`（`true|false`）與 `mcpFallbackReason`（`mcpUsed=false` 時必填）
11. 探測必須遵守 `scanDepth`、`maxRoutes`、`scanTimeoutSec` 上限，禁止無限制探索
12. 若因達到任一上限而提前停止，需在 `risks` 標記 `scan-partial` 並說明命中哪個上限

輸出：

- 必須寫入 `--artifact-dir/workflow-handoff/[WORKFLOW]SITE-BASELINE.md`
- 檔案需符合 `rule-testing-e2e-path.md` 的最小欄位契約
- 若 `reachable=false`，主流程應中止並標記環境阻塞
- `requiresSecrets` 與 `requiredSecretKeys` 必須可由 `authSignals` 回推
- 若未使用 MCP，需可由 `mcpFallbackReason` 追溯替代探測依據
