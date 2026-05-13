# Input Schema

## 輸入欄位
- `source_code`
- `project_config`
- `framework_type`
- `test_targets`
- `exclude_globs`
- `behavior_spec`
- `test_env`
- `external_dependencies`
- `acceptance_rules`
- `site_reference`
- `screenshots_or_recordings`
- `known_risks`
- `existing_tests`

## 欄位狀態值
- `provided` = 使用者直接提供，值可直接使用
- `derived` = 從其他輸入欄位或 `source_code` / `project_config` 推導得出（有可追溯的推導依據）
- `defaulted` = 使用 workflow 預設值（無使用者輸入也無可信推導，依預設策略填入）
- `not_applicable` = 不適用於此專案（有明確理由說明此欄位無需填入）
- `missing_blocking` = 必填欄位缺失，且無法從任何來源推導或 default；流程必須停在 BLOCKED 直到補件

## 必要性規則
- `source_code`: Required
- `project_config`: Required
- `test_targets`: Required
- `exclude_globs`: Governed Required（預設排除第三方與壓縮檔，可由使用者覆寫）
- `behavior_spec`: Required unless derivable（可由既有證據推導時可不阻塞）
- `framework_type`: Governed Required
- `acceptance_rules`: Governed Required
- `test_env`: Governed Required（由 Step 1 自動偵測與初始化；若自動初始化失敗才升為 `missing_blocking`）
- `external_dependencies`: Conditional
- 其餘為 Optional

## 輸入責任模型
- `user_required`：`source_code`、`project_config`、`test_targets`
- `user_required_unless_derivable`：`behavior_spec`
- `governed_derived`：`framework_type`、`acceptance_rules`、`exclude_globs`
- `governed_auto_repairable`：`test_env`

補充規則：
- `user_required` 由使用者或外部文件直接提供；若缺失，Step 2 採一問一答補件
- `user_required_unless_derivable` 欄位（`behavior_spec`）應先嘗試推導；僅在推導失敗且無可信證據時，才進入 Step 2 一問一答補件
- `governed_derived` 由 workflow 依既有證據推導；若推導來源不足，可在 Step 2 要求使用者補充更直接的依據
- `governed_auto_repairable` 由 Step 1 自動偵測與嘗試修復；不得因其他 required inputs 缺失而延後執行
- 路徑預設規則：若未提供 `target-path` / scope，workflow 以 workspace root 作為 `source_code` 預設值（`defaulted`），不得在 Step 0 詢問工作區路徑
- `project_config` 若未直接提供，Step 1 應先在 workspace root 自動掃描常見設定檔並標記為 `derived`；僅在掃描失敗時才列入補件
- `test_targets` 預設規則：若未提供，Step 1 須自動設定為 `src/static/js/**/*.js` 並標記為 `defaulted`
- `exclude_globs` 預設規則：若未提供，Step 1 須自動設定為 `**/*.min.js`、`**/*polyfill*.js`、`**/jquery*.js`、`**/moment*.js`、`**/konva*.js`，並標記為 `defaulted`

## 推導來源白名單（behavior_spec / acceptance_rules）
- `source_code`（函式責任、模組註解、型別契約、驗證邏輯、錯誤處理）
- `existing_tests`（既有測試案例、斷言、測試命名）
- `known_risks`（已知風險、邊界條件）
- bug records / issue tickets
- docs / comments / ADR / README

推導規則：
- 推導結果必須可追溯到上述來源之一，並在 `InputSummary.md` 記錄證據路徑
- 若推導來源存在衝突，Step 1 應標記為 `missing_blocking`，交由 Step 2 補件釐清
- 若無可用來源或來源不足，Step 1 應標記為 `missing_blocking`

## Governed Required 解析規則
- `framework_type` 可由 `source_code`、`project_config` 或既有測試工具推導，但必須在 Step 4 結束前確定；若 Step 4 仍無法確認，流程必須停在 `BLOCKED`
- `acceptance_rules` 可由 `behavior_spec`、`known_risks`、既有測試、bug 記錄或明示驗收條件推導，但必須在 Step 5 結束前確定；若 Step 5 仍無法確認，Step 6 不得開始
- `test_env` 由 Step 1 自動偵測並嘗試初始化（`npm init` + `npm install` + 建立最小設定）；此流程必須在 Step 1 期間先執行，不得因 `project_config`、`test_targets`、`behavior_spec` 或其他 required inputs 缺失而延後；自動初始化成功時記錄 `Test Env Status = passed`，不需使用者介入；僅在自動初始化失敗時標記為 `missing_blocking`
- `test_env` 若進入 `missing_blocking`，其缺口類型屬於 `env_blocker`；Step 2 只記錄修復路徑與補件摘要，不直接把 `test_env` 當成一般補件欄位
- 若 `Governed Required` 欄位既沒有直接輸入，也沒有可信的推導來源，Step 1 必須將其標記為 `missing_blocking`

## NormalizedInput.md 衍生欄位
- `NormalizedInput.md` 的 `Acceptance Rules Derivation Status` 合法值為 `confirmed / inferred / missing`
  - `confirmed` = 有直接輸入或明確依據，可直接使用
  - `inferred` = 從 `behavior_spec`、`known_risks` 或既有測試推導，Step 5 應升格為 `confirmed` 或阻塞流程
  - `missing` = 連推導來源都不足，Step 3 產出後 Step 5 將阻塞流程，設定 `Strategy Gate Status = blocked`

## 正規化輸出目標
正規化後至少要有：
- project
- inputs
- runtime
- acceptance
