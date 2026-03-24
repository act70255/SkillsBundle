---
description: E2E 子流程：依測試案例產出 Playwright 腳本
---

目標：

- 依 `TEST-CASES.md` 產出 `AutomationTarget=playwright` 的腳本與對照報告。

路徑規則唯一來源：`testing-e2e/commands/rule-testing-e2e-path.md`

讀取輸入：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
2. `--artifact-dir/workflow-deliverables/TEST-PLAN.md`
3. `--artifact-dir/workflow-deliverables/TEST-CASES.md`
4. `--artifact-dir/workflow-deliverables/ACCEPTANCE-CRITERIA.md`（條件式）
5. `--artifact-dir/workflow-handoff/[WORKFLOW]SITE-BASELINE.md`
6. `--artifact-dir/workflow-handoff/[WORKFLOW]SPEC-BASELINE.md`

寫出檔案：

1. Playwright scripts（`testscripts/playwright/` 或 `--test-path`）
2. `--artifact-dir/workflow-deliverables/TEST-SCRIPT-REPORT.md`

規範：

1. 僅處理 `AutomationTarget=playwright`
2. 腳本需保留 CaseID 追溯（測試名稱或註解）
3. Locator 優先：`getByRole`、`getByLabel`、`getByTestId`；必要時 `getByText`
4. 禁止 `getByPlaceholder` 與脆弱 selector（如 `nth-child`）
5. 導頁案例需同時驗證 URL 與目標頁關鍵元素
6. 涉及登入/敏感資料時，僅可讀環境變數，不得明文
7. 涉及登入流程時，優先使用 `process.env.PLAYWRIGHT_BASE_URL`、`process.env.PW_LOGIN_EMAIL`、`process.env.PW_LOGIN_PASSWORD`
8. 若 `requiresSecrets=true` 且 `--secrets-file` 不存在，需沿用 `workflow-deliverables/.env.playwright.template` 作為補件依據並在報告標記 `environment-blocked`
9. 若 `ACCEPTANCE-CRITERIA.md` 缺失，需回退使用 `SPEC-BASELINE` 的 `inferredAcIds` 與 `TEST-CASES` trace 產生腳本，不得因 AC 缺失直接失敗

輸出：

- 必須寫入 `--artifact-dir/workflow-deliverables/TEST-SCRIPT-REPORT.md`
- CaseID -> ScriptPath 與未對應原因必須落檔，不得僅回覆摘要
- `TEST-SCRIPT-REPORT.md` 需包含 secrets 使用狀態（`required/not-required`、`template-created`、`pending-user-input`）
