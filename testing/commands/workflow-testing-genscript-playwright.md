---
description: 依測試文件與程式碼產出 Playwright E2E 測試腳本
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, e2e-testing, playwright-skill, browser-automation, code-review-checklist`

目標：

- 針對 $ARGUMENTS，依現有程式碼與測試文件產出可執行 Playwright 腳本。

參數規範：

- 建議格式：`<測試範圍> --site-url <url> --test-path <path>`
- 無參數模式：可直接執行 `/workflow-testing-genscript-playwright`；未提供 `<測試範圍>`、`--site-url`、`--test-path` 時，需先向使用者確認可測試站台 URL
- 預設值：`--test-path testscripts/playwright`
- 文件檔目錄：`--artifact-dir <path>`（預設 `testing-artifacts/playwright`）
- 可選輸入模板：`--input-file <path>`（建議使用 `../templates/PLAYWRIGHT-INPUT.template.md`）
- `--src-path <path>` 為可選補強參數（僅用於疑難案例定位），非必要
- `--secrets-file <path>` 為可選（預設 `.env.playwright`），供登入/敏感資料以環境變數提供
- 路徑優先序：明確傳入參數 > 專案慣例路徑 > 預設值
- 若站台探索範圍過廣（例如跨多模組或大量頁面），需先向使用者確認是否縮小範圍再執行

輸入來源（強制讀取）：

1. `--site-url` 指定站台（或等效 `--base-url`），作為黑箱腳本的目標網址
2. `--test-path` 指定路徑（預設 `testscripts/playwright/`，測試腳本）
3. `testing-artifacts/playwright/TEST-PLAN.md`（或 `--artifact-dir/TEST-PLAN.md`）
4. `testing-artifacts/playwright/TEST-CASES.md`（或 `--artifact-dir/TEST-CASES.md`）
5. `testing-artifacts/playwright/ACCEPTANCE-CRITERIA.md`（或 `--artifact-dir/ACCEPTANCE-CRITERIA.md`）
6. `--src-path`（可選）：僅在黑箱定位不足時補強分析，不可作為流程前置必要條件
7. `--input-file`（可選）：若提供，需讀取 `route_scope`、`p0_flows`、`assertion_targets`，用於補強腳本案例對應與斷言設計

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
11. Locator 策略：優先使用 `getByRole`、`getByLabel`、`getByTestId`，必要時使用 `getByText`（regex/partial match）
12. 禁止使用 `getByPlaceholder`（不可作為主要或備援定位），因 i18n 容易造成定位不穩定；若無可行替代方案，需標記為「可測試性缺口」並回報需補語意標記（例如可存取名稱或 test id），且不得使用脆弱 selector（如 `nth-child`）
13. 若案例含 `NavigationType = route | hyperlink | redirect`，腳本必須同時驗證 URL 變化與目標頁關鍵元素可見
14. 本流程以黑箱測試為主，不得依賴產品內部實作細節（state、私有函式、內部變數）作為斷言基準
15. 若案例涉及登入或敏感資料，腳本必須只讀環境變數（例如 `process.env.PW_LOGIN_EMAIL`/`PW_LOGIN_PASSWORD`），禁止硬編碼明文
16. 若 `--secrets-file`（或預設 `.env.playwright`）不存在，需產生樣板檔並在 `TEST-SCRIPT-REPORT.md` 註記待使用者填值
17. `TEST-SCRIPT-REPORT.md` 只能記錄變數名稱與缺件狀態，禁止輸出敏感值

請輸出（強制）：

1. 測試腳本檔案（Playwright）
2. `testing-artifacts/playwright/TEST-SCRIPT-REPORT.md`（或 `--artifact-dir/TEST-SCRIPT-REPORT.md`）
   - CaseID -> ScriptPath 對照
   - 已自動化 / 未自動化清單與原因
   - 建議執行命令與注意事項

模板參考：

- `../templates/TEST-PLAN.template.md`
- `../templates/TEST-CASES.template.md`
- `../templates/ACCEPTANCE-CRITERIA.template.md`
- `../templates/TEST-SCRIPT-REPORT.template.md`
- `../templates/PLAYWRIGHT-INPUT.template.md`
- `../templates/PLAYWRIGHT-SECRETS.template.env`
