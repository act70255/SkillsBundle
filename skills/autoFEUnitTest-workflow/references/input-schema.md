# Input Schema

## 輸入欄位
- `source_code`
- `project_config`
- `framework_type`
- `test_targets`
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
- `behavior_spec`: Required
- `framework_type`: Governed Required
- `acceptance_rules`: Governed Required
- `test_env`: Governed Required（由 Step 1 自動偵測與初始化；若自動初始化失敗才升為 `missing_blocking`）
- `external_dependencies`: Conditional
- 其餘為 Optional

## 輸入責任模型
- `user_required`：`source_code`、`project_config`、`test_targets`、`behavior_spec`
- `governed_derived`：`framework_type`、`acceptance_rules`
- `governed_auto_repairable`：`test_env`

補充規則：
- `user_required` 由使用者或外部文件直接提供；若缺失，Step 2 採一問一答補件
- `governed_derived` 由 workflow 依既有證據推導；若推導來源不足，可在 Step 2 要求使用者補充更直接的依據
- `governed_auto_repairable` 由 Step 1 自動偵測與嘗試修復；不得因其他 required inputs 缺失而延後執行

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
