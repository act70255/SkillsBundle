# Changelog

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
