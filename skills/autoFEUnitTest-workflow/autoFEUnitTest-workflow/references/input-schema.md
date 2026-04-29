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
- `provided`
- `derived`
- `defaulted`
- `not_applicable`
- `missing_blocking`

## 必要性規則
- `source_code`: Required
- `project_config`: Required
- `test_targets`: Required
- `behavior_spec`: Required
- `framework_type`: Governed Required
- `acceptance_rules`: Governed Required
- `test_env`: Conditional
- `external_dependencies`: Conditional
- 其餘為 Optional

## 正規化輸出目標
正規化後至少要有：
- project
- inputs
- runtime
- acceptance
