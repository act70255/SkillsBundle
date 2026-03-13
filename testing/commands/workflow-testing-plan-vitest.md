---
description: 針對 Vitest 建立測試策略、測試案例與品質閘
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, javascript-testing-patterns, test-driven-development, code-review-checklist`

目標：

- 針對 $ARGUMENTS 建立 Vitest 可執行、可追溯的測試規劃。

參數規範（可省略）：

- 建議格式：`<變更範圍> --src-path <path>`
- 無參數模式：可直接執行 `/workflow-testing-plan-vitest`；未提供 `<變更範圍>` 與 `--src-path` 時，預設掃描 `src/`，若 `src/` 不存在則掃描工作區根目錄
- 輸出檔目錄：`--artifact-dir <path>`（預設 `testing-artifacts/vitest`）
- 路徑優先序：明確傳入 `--src-path` > `<變更範圍>` 可推導路徑 > 預設路徑
- 若推導後掃描範圍過廣（例如跨多模組或大量檔案），需先向使用者確認是否縮小範圍再執行

輸入檢查（容錯）：

1. 一律讀取目標 `src` 範圍進行靜態分析（頁面、元件、路由、API 呼叫、表單與事件），作為測試規劃基線；若未提供路徑則使用參數規範中的預設路徑
2. 讀取並對齊 `SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`TASKS.md`（若存在），用於需求追溯與優先級校正
3. 若文件與 `src` 行為不一致，需在 `testing-artifacts/vitest/INPUT-GAP.md`（或 `--artifact-dir/INPUT-GAP.md`）標註差異、風險與建議修正方向
4. 若缺少追溯資訊（AC 或 TASK 對不上），先在文件中標註缺口，並以 `INFERRED-AC-*`、`INFERRED-TASK-*` 產生臨時追溯編號
5. 若 `ACCEPTANCE-CRITERIA.md` 不存在，需在本流程產出最小可用版本（以 `INFERRED-AC-*` 建立基線），供後續 script-generate / execute 流程對齊

執行規範：

1. 僅做測試規劃，不可修改產品程式碼
2. 測試案例需標註 `AutomationTarget = vitest | manual`
3. 測試案例需可追溯到 AC 與 TASK 編號；若文件缺失，允許使用 `INFERRED-*` 編號
4. 本流程不產生測試腳本；若需產碼，改用 `/workflow-testing-genscript-vitest`

請輸出（強制）：

1. `testing-artifacts/vitest/TEST-PLAN.md`（或 `--artifact-dir/TEST-PLAN.md`）
   - 測試範圍（unit/integration）
   - 優先測試路徑與風險分級
   - 品質閘條件（G1~G4）
   - 建議執行順序
2. `testing-artifacts/vitest/TEST-CASES.md`（或 `--artifact-dir/TEST-CASES.md`）
   - 測試案例清單（前置條件、步驟、預期結果）
   - 每個案例的 AC/TASK Trace
   - 每個案例的 AutomationTarget
3. `testing-artifacts/vitest/ACCEPTANCE-CRITERIA.md`（條件式，僅原檔缺失時；或 `--artifact-dir/ACCEPTANCE-CRITERIA.md`）
   - 以 `INFERRED-AC-*` 建立可追溯 AC 基線
   - 每條 AC 需對應到 `testing-artifacts/vitest/TEST-CASES.md`（或 `--artifact-dir/TEST-CASES.md`）的至少一個 Case
   - 標註 `Status: Inferred` 與待產品/規格確認項目
4. `testing-artifacts/vitest/INPUT-GAP.md`（條件式，文件缺失或與 `src` 行為不一致時；或 `--artifact-dir/INPUT-GAP.md`）
   - 缺失文件清單
   - 以 `src` 推導出的假設與風險
   - 後續需補件項目（正式 AC/TASK/SPEC）

模板參考：

- `../templates/TEST-PLAN.template.md`
- `../templates/TEST-CASES.template.md`
- `../templates/ACCEPTANCE-CRITERIA.template.md`
- `../templates/INPUT-GAP.template.md`
