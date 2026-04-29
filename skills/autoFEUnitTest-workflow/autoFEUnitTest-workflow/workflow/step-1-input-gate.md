# Step 1 - 輸入驗證

## Scope
只處理 Step 1。

## Required inputs
- `source_code`
- `project_config`
- `test_targets`
- `behavior_spec`

## Governed inputs
- `framework_type`
- `acceptance_rules`

## Process
1. 讀取 `RunReport.md`
2. 建立或更新 `InputSummary.md`
3. 檢查必要輸入是否存在
4. 對每個欄位標記狀態：`provided`、`derived`、`defaulted`、`not_applicable`、`missing_blocking`
5. 若無阻塞缺口，設定 `Input Validation Status = passed`，並將 `Status = IN_PROGRESS`
6. 若存在阻塞缺口，設定 `Input Validation Status = blocked`，將 `Status = BLOCKED`，在 `阻塞問題` 記錄缺失欄位，並交由 Step 2 補件
7. 刷新 `Last Updated`
8. 若無阻塞缺口，勾選 Step 1 檢查清單並將 `Current Step` 更新為下一個合法步驟
9. 若存在阻塞缺口，勾選 Step 1 檢查清單並將 `Current Step` 更新為 `Step 2`

## Exit criteria
- 所有輸入欄位都有明確狀態
- 必填輸入已補齊，或已明確標記阻塞原因
- `RunReport.md` 已更新輸入驗證結果

## Skill-local resources
- Template: `<skill_root>/templates/InputSummary.template.md`
- Reference: `<skill_root>/references/input-schema.md`
