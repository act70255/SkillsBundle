---
description: 依測試文件與程式碼產出 Playwright E2E 測試腳本
---

請先主動載入並使用以下 skills（依序）：
`testing-qa, e2e-testing, playwright-skill, browser-automation, code-review-checklist`

目標：

- 針對 $ARGUMENTS，依現有程式碼與測試文件產出可執行 Playwright 腳本。

參數規範：

- 建議格式：`<變更範圍> --src-path <path> --test-path <path>`
- 無參數模式：可直接執行 `/workflow-testing-script-generate-playwright`；未提供 `<變更範圍>`、`--src-path`、`--test-path` 時，使用預設值
- 預設值：`--src-path src（若不存在則使用工作區根目錄） --test-path testscripts/playwright`
- 文件檔目錄：`--artifact-dir <path>`（預設 `testing-artifacts/playwright`）
- 路徑優先序：明確傳入參數 > 專案慣例路徑 > 預設值
- 若推導後掃描範圍過廣（例如跨多模組或大量檔案），需先向使用者確認是否縮小範圍再執行

輸入來源（強制讀取）：

1. `--src-path` 指定路徑（預設 `src/`，產品程式碼）
2. `--test-path` 指定路徑（預設 `testscripts/playwright/`，測試腳本）
3. `testing-artifacts/playwright/TEST-PLAN.md`（或 `--artifact-dir/TEST-PLAN.md`）
4. `testing-artifacts/playwright/TEST-CASES.md`（或 `--artifact-dir/TEST-CASES.md`）
5. `testing-artifacts/playwright/ACCEPTANCE-CRITERIA.md`（或 `--artifact-dir/ACCEPTANCE-CRITERIA.md`）

執行規範：

1. 只可新增/更新測試腳本，不可修改產品程式碼
2. 必須以 `testing-artifacts/playwright/TEST-CASES.md`（或 `--artifact-dir/TEST-CASES.md`）為腳本主來源，僅產生 `AutomationTarget=playwright` 的案例
3. 每個自動化案例需在測試程式中保留可追溯的 CaseID（測試名稱或註解）
4. 腳本需對應 `testing-artifacts/playwright/TEST-CASES.md`（或 `--artifact-dir/TEST-CASES.md`）的 CaseID 與 AutomationTarget
5. 若 `testing-artifacts/playwright/TEST-PLAN.md` 或 `testing-artifacts/playwright/TEST-CASES.md` 缺失（或 `--artifact-dir` 對應檔案缺失），需停止產碼並明確提示先執行 `/workflow-testing-plan-playwright`
6. 若 `testing-artifacts/playwright/ACCEPTANCE-CRITERIA.md` 缺失（或 `--artifact-dir` 對應檔案缺失），需明確提示先回到 plan 流程補齊（或確認由 plan 產生 inferred AC）
7. 腳本需使用 Playwright E2E 語法（`page.goto`, `locator/getByRole`, 視覺與 URL 斷言）
8. 輸出路徑為 `testscripts/playwright/`（或 `--test-path`）
9. 產生完成後，需在 `testing-artifacts/playwright/TEST-SCRIPT-REPORT.md`（或 `--artifact-dir/TEST-SCRIPT-REPORT.md`）列出「已對應 CaseID」與「未對應 CaseID（含原因）」
10. 產生失敗時需保留可重跑資訊（命令、前置條件、測試資料）

請輸出（強制）：

1. 測試腳本檔案（Playwright）
2. `testing-artifacts/playwright/TEST-SCRIPT-REPORT.md`（或 `--artifact-dir/TEST-SCRIPT-REPORT.md`）
   - CaseID -> ScriptPath 對照
   - 已自動化 / 未自動化清單與原因
   - 建議執行命令與注意事項

模板參考：

- `.opencode/templates/TEST-PLAN.template.md`
- `.opencode/templates/TEST-CASES.template.md`
- `.opencode/templates/ACCEPTANCE-CRITERIA.template.md`
- `.opencode/templates/TEST-SCRIPT-REPORT.template.md`
