# Step 1 - 輸入驗證

## Scope
只處理 Step 1。

## Path convention
- 本文件提及的檔名皆指 `testing-artifact/` 目錄樹下的標準路徑（例如 `testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/InputSummary.md`）。

## Entry Gate
- 必須確認 `RunReport.md` 已存在，才可開始輸入驗證
- 若 `RunReport.md` 不存在，應先執行 Step 0 建立

## Required inputs
- `source_code`
- `project_config`
- `test_targets`
- `behavior_spec`（若可由既有證據可信推導，允許標記為 `derived`）

## Governed inputs
- `framework_type`
- `acceptance_rules`
- `exclude_globs`（第三方/壓縮檔排除規則，預設由 workflow 提供）
- `test_env`（環境就緒狀態，屬於 Step 1 的 auto-repairable 輸入；由 Step 1 自動偵測與初始化；若自動初始化失敗才轉為阻塞缺口）

## Process
1. 讀取 `RunReport.md`
2. 建立或更新 `InputSummary.md`
3. 檢查必要輸入是否存在
   - `source_code` 若未提供，預設為 workspace root 並標記為 `defaulted`
   - `project_config` 若未提供，先在 workspace root 自動掃描（如 `package.json`、`vite.config.*`、`vitest.config.*`、`jest.config.*`）；掃描成功標記為 `derived`
   - `test_targets` 若未提供，預設為 `src/static/js/**/*.js` 並標記為 `defaulted`
   - `exclude_globs` 若未提供，預設為 `**/*.min.js`、`**/*polyfill*.js`、`**/jquery*.js`、`**/moment*.js`、`**/konva*.js` 並標記為 `defaulted`
4. 依 `test_targets` 與 `exclude_globs` 建立業務 JS 盤點（Business JS Inventory）：
   - 先解析符合 `test_targets` 的檔案清單
   - 套用 `exclude_globs` 後得到 in-scope 業務 JS 清單
   - 若 in-scope 清單為空，標記 `missing_blocking` 並記錄原因（pattern 無匹配或排除過寬）
5. 無論第 3 步結果如何，先執行 `test_env` 偵測與自動初始化；不得因 `project_config`、`test_targets`、`behavior_spec` 或其他 required inputs 缺失而延後
6. 偵測測試執行環境是否就緒：
   - 確認 `source_code` 根目錄下是否存在 `package.json`
   - 確認是否已有 `vitest.config.*`、`jest.config.*` 或 `package.json` 中的 `scripts.test` 設定
   - 確認 `node_modules` 中是否已安裝 test runner（vitest 或 jest）
7. 若環境就緒，記錄 `Test Env Status = passed`，繼續後續欄位標記
8. 若環境不足，依 `framework_type`（若已可從 `project_config` 或 `source_code` 推導）或預設策略執行自動初始化：
   - **既有 runner 優先**：若已偵測到可用的 runner（vitest 或 jest），優先沿用，僅補缺失的環境依賴（如 `jsdom`）；不替換或重複安裝既有 runner
   - 若 `package.json` 不存在：執行 `npm init -y`
   - 依 `strategy-matrix.md` 的框架對應安裝 devDependencies（僅在無既有 runner 時執行）：
     - React：`npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom`
     - Vue：`npm install --save-dev vitest jsdom @vue/test-utils @testing-library/vue`
      - HTML+JS / jQuery：
        - 若已偵測到 Jest（`jest` 存在於 `node_modules` 或 `package.json` devDependencies）：`npm install --save-dev jest jest-environment-jsdom`
        - 否則預設安裝 Vitest：`npm install --save-dev vitest jsdom`
      - 框架未知時，使用最小集合：`npm install --save-dev vitest jsdom`
    - 若無 runner 設定檔，在 `package.json` 中新增對應的 `scripts.test` 指令，並補齊 jsdom 環境設定（依沿用或安裝的 runner 決定；Vitest 可建立 `vitest.config.js`，Jest 可補齊 `testEnvironment: "jsdom"` 至 jest.config）
    - 執行 `npx vitest --version` 或 `npx jest --version`（依安裝/沿用的 runner）驗證安裝
9. 若自動初始化成功，記錄 `Test Env Status = passed`，並在 `testing-artifact/handoff/RunReport.md` 的 `備註` 說明已自動初始化
10. 若自動初始化失敗，記錄 `Test Env Status = blocked`，將 `test_env` 標記為 `missing_blocking`，在 `testing-artifact/handoff/RunReport.md` 的 `阻塞問題` 記錄失敗原因
11. 對每個欄位標記狀態：`provided`、`derived`、`defaulted`、`not_applicable`、`missing_blocking`
12. 對 `behavior_spec`、`framework_type`、`acceptance_rules`，若非直接提供，必須先執行推導嘗試並記錄可追溯來源（白名單：`source_code`、`existing_tests`、`known_risks`、bug/issue、docs/comments）
13. `behavior_spec` 推導規則：
   - 若推導證據充分且無衝突，標記為 `derived`（不得標記為阻塞）
   - 若推導來源衝突、或無法形成可用行為規格，標記為 `missing_blocking`
14. `acceptance_rules` 推導規則：
   - 若可從 `behavior_spec`、`known_risks`、既有測試、bug 記錄推導，標記為 `derived`
   - 若無可信推導來源，標記為 `missing_blocking`
15. 將所有 `missing_blocking` 欄位同步寫入 `testing-artifact/handoff/RunReport.md` 的 `Missing Required Inputs`
16. 若無阻塞缺口，清空 `Missing Required Inputs`，設定 `Input Validation Status = passed`，並將 `Status = IN_PROGRESS`（若 `Status` 此前為 `BLOCKED`，表示前次存在阻塞缺口，此時缺口已解除（無論是透過 Step 2 補件還是外部修復，如環境修復後重跑），Step 1 驗證通過後均應更新為 `IN_PROGRESS`；詳見 `governance.md` Section 9）
17. 若存在阻塞缺口，設定 `Input Validation Status = blocked`，將 `Status = BLOCKED`，在 `Missing Required Inputs` 與 `阻塞問題` 同步記錄缺失欄位，並交由 Step 2 補件 / 路由（完整性約束見 Exit Criteria）
18. 刷新 `Last Updated`
19. 若無阻塞缺口，勾選 Step 1 檢查清單並將 `Current Step` 更新為下一個合法步驟
20. 若存在阻塞缺口，勾選 Step 1 檢查清單並將 `Current Step` 更新為 `Step 2`

## Exit criteria
- 所有輸入欄位都有明確狀態
- 必填輸入已補齊，或已明確標記阻塞原因
- `Test Env Status` 已記錄（`passed` 或 `blocked`）
- 若 `test_env` 起初不足，必須已完成一次自動初始化嘗試；不得因其他 required inputs 缺失而跳過
- `Missing Required Inputs` 與 `InputSummary.md` 的阻塞欄位一致
- `RunReport.md` 已更新輸入驗證結果
- `testing-artifact/handoff/InputSummary.md` 必須包含 Business JS Inventory（matched / excluded / in-scope）
- `test_targets` 與 `exclude_globs` 已完成解析，且 in-scope 業務 JS 清單不可為空
- 完整性約束：若 `Input Validation Status = blocked`，`Missing Required Inputs` 必須非空；若 Step 1 完成後出現 `blocked` + 空 `Missing Required Inputs` 的情況，視為 Step 1 執行異常；Step 2 偵測到此情況時，應在 `RunReport.md` 的 `阻塞問題` 記錄此異常，並將 `Current Step` 倒退至 Step 1，重跑 Step 1 修正（Step 2 的偵測責任見 `step-2-gap-check.md` Entry Gate；Step 2 倒退 `Current Step` 的授權見 `governance.md` Section 3）

## Skill-local resources
- Template: `<skill_root>/templates/InputSummary.template.md`
- Reference: `<skill_root>/references/input-schema.md`
- Reference: `<skill_root>/references/strategy-matrix.md`（框架對應安裝套件）
