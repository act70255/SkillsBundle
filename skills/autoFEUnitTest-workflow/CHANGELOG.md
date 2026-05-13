# Changelog

## 1.3.0

### Changed
- `workflow/step-1-input-gate.md`：明確化 `test_env` 為 Step 1 專責的 auto-repairable 輸入；要求即使其他 required inputs 缺失，仍必須先執行 runner 偵測與自動初始化嘗試
- `workflow/step-2-gap-check.md`：將 Step 2 重構為「補件與阻塞分流」；只對使用者補件型缺口進行一問一答，`test_env` 一律以 `env_blocker` 路徑處理
- `workflow/step-9-report.md`：新增結束後互動規則，要求先用中文總結，再於 HTML 報告存在時主動詢問是否要用網頁檢視測試結果
- `governance.md`、`references/input-schema.md`：新增 `governed_auto_repairable` / `test_env` 責任模型，寫死 Step 1 與 Step 2 的邊界
- `README.md`、`TROUBLESHOOTING.md`、`examples/invocation-examples.md`：同步更新 `test_env` 自動初始化、`env_blocker` 路徑與 Step 9 收尾互動說明
- `references/evidence-contract.md`、`references/output-contract.md`、`RELEASE-CHECKLIST.md`：同步更新證據、輸出與發版檢查條件
- `scripts/verify-doc-consistency.mjs`：補 `test_env` auto-repairable、Step 2 分流語意與 Step 9 收尾互動的一致性檢查

## 1.2.0

### Changed
- `workflow/step-1-input-gate.md`：Process 步驟 6 補「既有 runner 優先沿用」原則；jQuery/HTML+JS 分支補 Jest 偵測與沿用路徑（對齊 `strategy-matrix.md` 的 `Vitest or Jest`）；驗證命令補 Jest 支援（`npx jest --version`）
- `workflow/step-8-run.md`：修正步驟 3 編號重複（重複的 `3.` 更正為 `4.`，後續步驟順延）

### Added
- `TROUBLESHOOTING.md`：新增 Section 12（`Test Env Status = blocked` 解除路徑）
- `RELEASE-CHECKLIST.md`：補 `Test Env Status` 一致性確認條目（含 jQuery 分支與 strategy-matrix 一致性）
- `KNOWN-LIMITATIONS.md`：新增第 7 條（npm auto-setup 在受限環境可能失敗）
- `references/evidence-contract.md`：Step 1 補 `Test Env Status` evidence 說明
- `references/output-contract.md`：RunReport 治理 gate 欄位清單補 `Test Env Status`
- `workflow/step-2-gap-check.md`：新增「環境修復型缺口」段落，說明 `test_env` missing_blocking 的特殊處理路徑

### Notes
- 1.2.0 同時正式收錄 env 自動初始化系列改動（原 Round 9 後已實作但未記錄）：
  - `workflow/step-1-input-gate.md`：新增 `test_env` 為 Governed input；Process 步驟 4~8 加入 npm 環境偵測與自動初始化
  - `workflow/step-8-run.md`：前置條件補明 `Test Env Status = passed`
  - `templates/RunReport.template.md`：驗證區塊新增 `Test Env Status: not_checked`
  - `references/input-schema.md`：`test_env` 升為 Governed Required，補自動初始化解析規則
  - `governance.md`：新增 Section 10（測試執行環境自動初始化規則）
  - `scripts/verify-doc-consistency.mjs`：新增 4 個 check（RunReport 欄位、Step 1 偵測、Step 8 前置條件、governance Section 10）

## 1.1.0

### Changed
- `GenerationReview.template.md`：`Status` 欄位補 `blocked` 合法值
- `TestAssetManifest.template.md`：改為表格格式（Script Path / Case IDs / Covered Functions / Status）
- `RunReport.template.md`：所有 gate 欄位補合法值提示；四個產物狀態欄位（Mock Strategy / Gap Report / Generation Review / Execution Raw）補 `pending / generated / not_applicable` 合法值提示
- `InputSummary.template.md`：補「不使用 `failed`」說明
- `workflow/step-7-generate-script.md`：Process 第 4 步補 TestAssetManifest 表格格式指引
- `examples/output-example-mock-strategy.md`：補 `## 範圍` 段落
- `examples/output-example-gap-report.md`：補「缺口來源」區塊
- `examples/invocation-examples.md`：補「建議啟動格式」段落與基本叫用提示

### Added
- 四個技術棧輸出範例（react / vue / html-js / jquery）：補完整必要產物清單說明
- `references/output-contract.md`：補 TestAssetManifest 表格格式要求
- `references/evidence-contract.md`：Step 7 補 TestAssetManifest 表格描述
- `KNOWN-LIMITATIONS.md`：新增第 5 條（Step 3 無獨立 BLOCKED gate）、第 6 條（TestAssetManifest 表格格式無機器驗證保護）
- `RELEASE-CHECKLIST.md`：補 TestAssetManifest 表格格式手動確認條目
- `TROUBLESHOOTING.md`：新增 Section 11（RunReport 產物狀態欄位語意與 GapReport 解除路徑）
- `scripts/verify-doc-consistency.mjs`：新增多項 check（Step 9 Entry Gate、InputSummary 不使用 failed 等）

## 1.0.0

### Added
- 建立 `auto-fe-unit-test-workflow` 正式 skill 入口與導航
- 建立 `Step 0 ~ 9` workflow 文件
- 建立 `RunReport`、`InputSummary`、`NormalizedInput`、`ClassificationSummary`、`StrategyDecision`、`TestPlan`、`TestCases`、`TestAssetManifest`、`GenerationReview`、`ExecutionSummary`、`CoverageSummary`、`FinalReport` 模板
- 建立 `MockStrategy`、`GapReport`、`EnvTemplate.example` 條件式模板
- 建立 `React`、`Vue`、`HTML + JS`、`jQuery` 範例輸出文件
- 建立結構驗證、輸出契約驗證與跨文件一致性驗證腳本

### Changed
- 將 `GenerationReview.md` 收斂為必要治理產物
- 將 `ExecutionRaw.log` 收斂為必要執行證據與標準路徑
- 將 `MockStrategy.md` 與 `GapReport.md` 正式接入 workflow
- 為 `RunReport` 補上產物狀態欄位，強化續跑與 DONE gate 判定

### Notes
- 此版本定位為可對外發布的治理型前端單元測試 skill
