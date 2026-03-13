---
description: 執行 Vitest 測試、產出報告與阻塞交接
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, testing-qa, javascript-testing-patterns, systematic-debugging, test-fixing, verification-before-completion`

目標：

- 執行 $ARGUMENTS 的 Vitest 測試流程並完成結果歸檔。

參數規範：

- 建議格式：`<變更範圍> --test-path <path>`
- 無參數模式：可直接執行 `/workflow-testing-execute-vitest`；未提供任何參數時，依 `testing-artifacts/vitest/TEST-CASES.md` 與 Vitest 預設搜尋規則執行
- 預設：若未傳入 `--test-path`，優先執行 `testscripts/vitest/`，若該路徑不存在則退回專案既有 Vitest 預設搜尋規則
- 文件檔目錄：`--artifact-dir <path>`（預設 `testing-artifacts/vitest`）

執行規範：

1. 若 `testing-artifacts/vitest/TEST-PLAN.md` 或 `testing-artifacts/vitest/TEST-CASES.md` 缺失（或 `--artifact-dir` 對應檔案缺失），立即停止執行並提示先跑 `/workflow-testing-plan-vitest`
2. 若 `testing-artifacts/vitest/ACCEPTANCE-CRITERIA.md` 缺失（或 `--artifact-dir` 對應檔案缺失），立即停止執行並提示先跑 `/workflow-testing-plan-vitest` 補齊 AC 基線
3. 依 `testing-artifacts/vitest/TEST-PLAN.md` 與 `testing-artifacts/vitest/TEST-CASES.md`（或 `--artifact-dir` 對應檔案）執行，不得自行改動測試目標
4. 依序執行品質閘（G1 -> G2 -> G3 -> G4）
5. 品質閘執行重點：
   - G2（Unit/Integration）必須執行 Vitest：若提供 `--test-path` 則執行 `yarn vitest run <test-path> --environment jsdom`；未提供時先嘗試 `yarn vitest run testscripts/vitest --environment jsdom`，若路徑不存在則改用 `yarn vitest run --environment jsdom`
6. 先分類失敗原因（spec 問題 / 實作問題 / 環境問題）
7. 可修復者先修復並做回歸驗證，不可修復者標記阻塞

自動化腳本產出：

1. 本流程以執行既有 Vitest 腳本為主，不負責大量新腳本產生
2. 若腳本缺漏，先執行 `/workflow-testing-script-generate-vitest` 再回到本流程

請輸出（強制）：

1. `testing-artifacts/vitest/TEST-REPORT.md`（或 `--artifact-dir/TEST-REPORT.md`）
   - Gate 結果（Pass/Fail）
   - 測試執行摘要（總數、通過、失敗、跳過）
   - 已修復/未解決清單
   - 可回歸自動化覆蓋率說明

執行完成後回覆（強制）：

1. 測試結論摘要（Gate 與總體 Pass/Fail）
2. 「如何查看測試結果與報告」操作說明（至少包含）：
   - `TEST-REPORT.md` 實際路徑
   - Vitest 測試輸出位置（例如終端輸出、coverage 目錄；若有）
   - Vitest HTML 報告查看方式（例如 `.reports/vitest-report/index.html`，或使用 `npx vite preview --outDir .reports/vitest-report`）
   - 重跑命令（全量與本次使用的 `--test-path` 子集命令）

查看結果建議內容（可直接套用在回覆中）：

- 文字報告：
  - 開啟 `testing-artifacts/vitest/TEST-REPORT.md`
  - 若有阻塞，開啟 `testing-artifacts/vitest/[TEST]BLOCKERS.md`
- 終端輸出：
  - 直接檢視 Vitest 執行結束後的總結（總數、通過、失敗、跳過）
- HTML 報告（若有產生）：
  - 直接開啟 `.reports/vitest-report/index.html`
  - 或執行 `npx vite preview --outDir .reports/vitest-report` 後用瀏覽器檢視

條件式輸出：

- `testing-artifacts/vitest/[TEST]BLOCKERS.md`（僅阻塞時；或 `--artifact-dir/[TEST]BLOCKERS.md`）

阻塞交接規範：

1. 若為規格阻塞：更新 `[SPEC]CHANGE-REQUEST.md`，切換 `planning` 執行 `/workflow-spec-update`
2. 若為實作阻塞：回交 `dev-*` 執行 implement 修復

模板參考：

- `.opencode/templates/TEST-PLAN.template.md`
- `.opencode/templates/TEST-CASES.template.md`
- `.opencode/templates/ACCEPTANCE-CRITERIA.template.md`
- `.opencode/templates/TEST-REPORT.template.md`
- `.opencode/templates/INPUT-GAP.template.md`
