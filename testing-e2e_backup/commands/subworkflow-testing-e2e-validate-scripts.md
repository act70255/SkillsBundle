---
description: E2E 子流程：驗證腳本與文件/SITE 是否相符
---

目標：

- 驗證 Playwright 腳本與 `TEST-CASES.md`、站台可觀測行為是否一致。

路徑規則唯一來源：`testing-e2e/commands/rule-testing-e2e-path.md`

讀取輸入：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
2. `--artifact-dir/workflow-handoff/[WORKFLOW]SITE-BASELINE.md`
3. `--artifact-dir/workflow-handoff/[WORKFLOW]DOC-VALIDATION.md`
4. `--artifact-dir/workflow-deliverables/TEST-CASES.md`
5. `--artifact-dir/workflow-deliverables/TEST-SCRIPT-REPORT.md`
6. 測試腳本目錄（`testscripts/playwright/` 或 `--test-path`）
7. `--secrets-file`（條件式：`requiresSecrets=true` 時）
8. `--artifact-dir/workflow-deliverables/.env.playwright.template`（條件式）

寫出檔案（內部交接）：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]SCRIPT-VALIDATION.md`

檢查項：

1. `AutomationTarget=playwright` 案例是否均有腳本對應
2. 導頁案例是否同時驗證 URL 與目標頁關鍵元素
3. 腳本命名/註解是否可追溯到 CaseID
4. 腳本策略是否符合規範（locator policy、secrets policy）
5. 可執行性基本檢查（例如 `yarn playwright test --list` 或等效）
6. 若案例涉及登入/敏感資料：需驗證腳本僅透過 `process.env.*` 讀取，不得硬編碼帳密/token/api key
7. 若 `requiresSecrets=true`：需驗證 `TEST-SCRIPT-REPORT.md` 已標記 secrets readiness（含 `pending-user-input`）
8. 若 `requiresSecrets=true` 且必要鍵為空值，`result` 不得為 `Pass`，需標記 `environment-blocked`

輸出：

- 必須寫入 `--artifact-dir/workflow-handoff/[WORKFLOW]SCRIPT-VALIDATION.md`
- 驗證結果與覆蓋缺口必須落檔（`result` + 覆蓋欄位）
- `SCRIPT-VALIDATION.md` 必須輸出 `envUsageCheck` 與 `hardcodedSecretCheck`
