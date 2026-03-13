---
description: 針對 Playwright E2E 建立測試策略、測試案例與品質閘
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, e2e-testing, playwright-skill, code-review-checklist`

目標：

- 針對 $ARGUMENTS 建立 Playwright 可執行、可追溯的 E2E 測試規劃。

參數規範（可省略）：

- 建議格式：`<測試範圍> --site-url <url>`
- 無參數模式：可直接執行 `/workflow-testing-plan-playwright`；未提供 `<測試範圍>` 與 `--site-url` 時，需先向使用者確認可測試的目標站台 URL
- 輸出檔目錄：`--artifact-dir <path>`（預設 `testing-artifacts/playwright`）
- 可選輸入模板：`--input-file <path>`（建議使用 `../templates/PLAYWRIGHT-INPUT.template.md`）
- `--src-path <path>` 為可選補強參數（僅用於定位高風險區或疑難案例），非必要
- 路徑優先序：`--site-url` 為主；`--src-path` 僅在補強分析時使用
- 若站台探索範圍過廣（例如跨多模組或大量頁面），需先向使用者確認是否縮小範圍再執行

輸入檢查（容錯）：

1. 一律以目標 `SITE URL` 進行黑箱探索（頁面流程、主要互動、導頁與 API 可觀測行為），作為測試規劃基線
2. 讀取並對齊 `SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`TASKS.md`（若存在），用於需求追溯與優先級校正
3. 若文件與站台可觀測行為不一致，需在 `testing-artifacts/playwright/INPUT-GAP.md`（或 `--artifact-dir/INPUT-GAP.md`）標註差異、風險與建議修正方向
4. 若缺少追溯資訊（AC 或 TASK 對不上），先在文件中標註缺口，並以 `INFERRED-AC-*`、`INFERRED-TASK-*` 產生臨時追溯編號
5. 若 `ACCEPTANCE-CRITERIA.md` 不存在，需在本流程產出最小可用版本（以 `INFERRED-AC-*` 建立基線），供後續 genscript / execute 流程對齊
6. 僅在使用者提供 `--src-path` 時，才可進行 `src` 補強分析；不得將 `src` 作為黑箱流程前置必要條件
7. 若提供 `--input-file`，需優先使用其 `route_scope`、`p0_flows`、`assertion_targets` 作為案例規劃輸入

執行規範：

1. 僅做測試規劃，不可修改產品程式碼
2. 測試案例需標註 `AutomationTarget = playwright | manual`
3. 測試案例需可追溯到 AC 與 TASK 編號；若文件缺失，允許使用 `INFERRED-*` 編號
4. 本流程不產生測試腳本；若需產碼，改用 `/workflow-testing-genscript-playwright`
5. 測試案例需涵蓋導頁驗證，至少包含主要路由跳轉與頁面內超連結（Hyperlink）點擊後的導頁結果
6. 每個導頁相關案例需標註 `NavigationType = route | hyperlink | redirect`，並定義 URL 與目標頁關鍵元素兩類預期結果

請輸出（強制）：

1. `testing-artifacts/playwright/TEST-PLAN.md`（或 `--artifact-dir/TEST-PLAN.md`）
   - 測試範圍（integration/e2e）
   - 優先測試路徑與風險分級（P0/P1）
   - 品質閘條件（G1~G4）
   - 建議執行順序
2. `testing-artifacts/playwright/TEST-CASES.md`（或 `--artifact-dir/TEST-CASES.md`）
   - 測試案例清單（前置條件、步驟、預期結果）
   - 每個案例的 AC/TASK Trace
   - 每個案例的 AutomationTarget
   - 導頁相關案例需包含 `NavigationType` 與對應 URL/目標頁驗證點
3. `testing-artifacts/playwright/ACCEPTANCE-CRITERIA.md`（條件式，僅原檔缺失時；或 `--artifact-dir/ACCEPTANCE-CRITERIA.md`）
   - 以 `INFERRED-AC-*` 建立可追溯 AC 基線
   - 每條 AC 需對應到 `testing-artifacts/playwright/TEST-CASES.md`（或 `--artifact-dir/TEST-CASES.md`）的至少一個 Case
   - 標註 `Status: Inferred` 與待產品/規格確認項目
4. `testing-artifacts/playwright/INPUT-GAP.md`（條件式，文件缺失或與站台可觀測行為不一致時；或 `--artifact-dir/INPUT-GAP.md`）
   - 缺失文件清單
   - 以站台可觀測行為/路由推導出的假設與風險
   - 後續需補件項目（正式 AC/TASK/SPEC）

模板參考：

- `../templates/TEST-PLAN.template.md`
- `../templates/TEST-CASES.template.md`
- `../templates/ACCEPTANCE-CRITERIA.template.md`
- `../templates/INPUT-GAP.template.md`
- `../templates/PLAYWRIGHT-INPUT.template.md`
