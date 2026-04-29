---
name: auto-fe-unit-test-workflow
description: 前端單元測試治理型工作流，適用於 React、Vue、HTML+JS、jQuery。用於檢核輸入完整性、分類技術棧、決定測試策略、產出測試計畫與腳本、執行測試並彙整有證據的最終報告。
disable-model-invocation: true
argument-hint: [target-path or scope]
---

# Auto FE Unit Test Workflow

## Positioning
這是一套可治理、可續跑、可追溯的前端單元測試 workflow。

核心範圍：

- `Unit Test`
- `Component / DOM Test`
- `React`
- `Vue`
- `HTML + JS`
- `HTML + JS + jQuery`

不在核心範圍：

- `E2E`
- 跨頁流程驗證
- 正式環境登入治理

## Recommended startup instruction
建議使用以下啟動語句：

`請載入 auto-fe-unit-test-workflow，依序執行完整 Step 0~9。`

## Canonical step flow
- Step 0: RunReport 初始化/續跑檢查
- Step 1: 輸入驗證
- Step 2: 缺口補件
- Step 3: 輸入正規化
- Step 4: 技術與測試目標分類
- Step 5: 測試策略決策
- Step 6: 產出測試計畫
- Step 7: 產出測試腳本與測試資產
- Step 8: 執行測試
- Step 9: 最終報告與 DONE Gate

## Pipeline overview
- 先建立或讀取 `RunReport.md`
- 先驗證輸入與補件，再進入分類與策略決策
- 沒有充分證據時，不得直接產生腳本或宣告完成
- 所有重要結論都必須留有明確產物與證據路徑

## Pipeline gate policy
- Entry gate:
  - Step 0 必須先建立或確認 `RunReport.md`
- Input gate:
  - 必填輸入缺失時，流程狀態必須為 `BLOCKED`
- Strategy gate:
  - 分類依據不足時，不得進入 Step 5 之後
- Script gate:
  - 測試腳本未通過基本品質檢核時，不得進入執行
- Execution gate:
  - 前置條件不成立時，結果必須為 `BLOCKED`，不得標記為 `FAIL`
- Done gate:
  - 只有在必要產物齊全、狀態一致、證據鏈完整時，才能標記為 `DONE`
  - 若 DONE gate 未通過，最終狀態必須依治理規則落在 `BLOCKED`、`FAILED` 或 `IN_PROGRESS`

詳細治理規則請讀：[governance.md](governance.md)

## Evidence contract
- 每個分類結果都必須指向原始碼、設定或既有測試證據
- 每個策略決策都必須記錄採用原因與未採用原因
- 每個測試案例都必須可追溯到規格、風險、bug 或模組責任
- 每個執行結論都必須保留原始輸出、coverage 或等價證據

詳細證據契約請讀：[references/evidence-contract.md](references/evidence-contract.md)

## Resume rule
- 若存在 `RunReport.md`，從最後合法且未完成的 step 續跑
- 若發現產物與證據不一致，回退到最近可重建證據的步驟
- 不允許跳過中間 gate 直接執行後續步驟

## Dispatch mapping
- Step 0 -> [workflow/step-0-runreport.md](workflow/step-0-runreport.md)
- Step 1 -> [workflow/step-1-input-gate.md](workflow/step-1-input-gate.md)
- Step 2 -> [workflow/step-2-gap-check.md](workflow/step-2-gap-check.md)
- Step 3 -> [workflow/step-3-normalize.md](workflow/step-3-normalize.md)
- Step 4 -> [workflow/step-4-classify.md](workflow/step-4-classify.md)
- Step 5 -> [workflow/step-5-strategy.md](workflow/step-5-strategy.md)
- Step 6 -> [workflow/step-6-generate-plan.md](workflow/step-6-generate-plan.md)
- Step 7 -> [workflow/step-7-generate-script.md](workflow/step-7-generate-script.md)
- Step 8 -> [workflow/step-8-run.md](workflow/step-8-run.md)
- Step 9 -> [workflow/step-9-report.md](workflow/step-9-report.md)

## Bundle contents
- `governance.md`: 流程治理、狀態語意、gate 規則
- `project-profile-auto-fe-unit.md`: 專案預設與輸出路徑
- `workflow/*`: 各 step 的執行規則
- `references/*`: 輸入、分類、策略、證據、輸出契約
- `templates/*`: 標準產物模板
- `examples/*`: 叫用方式與輸出範例
- `scripts/*`: 技能包驗證腳本

## Additional resources
- 使用說明： [README.md](README.md)
- 版本變更： [CHANGELOG.md](CHANGELOG.md)
- 已知限制： [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md)
- 發布檢查： [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md)
- 常見阻塞： [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 輸入欄位與狀態值： [references/input-schema.md](references/input-schema.md)
- 分類規則： [references/classification-rules.md](references/classification-rules.md)
- 策略矩陣： [references/strategy-matrix.md](references/strategy-matrix.md)
- 輸出契約： [references/output-contract.md](references/output-contract.md)
- 架構說明： [references/architecture.md](references/architecture.md)
- 叫用範例： [examples/invocation-examples.md](examples/invocation-examples.md)

## Template source of truth
優先使用本技能目錄下的模板：

`<skill_root>/templates/`

## Integration contract
- `governance.md` 是狀態語意與治理規則的唯一來源
- `project-profile-auto-fe-unit.md` 只定義專案預設，不得覆蓋治理語意
- `workflow/*` 負責執行順序與 gate，不得任意跳步
- `templates/*` 定義標準產物骨架，產出時不得省略必要欄位
