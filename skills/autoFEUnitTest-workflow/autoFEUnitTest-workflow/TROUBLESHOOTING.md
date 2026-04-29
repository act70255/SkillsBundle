# Troubleshooting

## 1. 流程停在 `BLOCKED`

常見原因：

1. 缺少 `behavior_spec`
2. 缺少可執行的 `test_targets`
3. `framework_type` 無法安全推導
4. 外部依賴契約不明
5. env 或 plugin/SDK 缺失

處理方式：

1. 先檢查 `InputSummary.md`
2. 再檢查 `RunReport.md` 的 `Missing Required Inputs` 與 `阻塞問題`
3. 若 Step 2 後仍阻塞，查看 `GapReport.md`

## 2. 為什麼會產生 `GapReport.md`

當 Step 2 補件後仍存在 `missing_blocking`，且缺口阻塞 Step 3 之後流程時，必須產生 `GapReport.md`。

## 3. 為什麼會產生 `MockStrategy.md`

當外部依賴或 env 複雜到不適合只用 `StrategyDecision.md` 簡述時，必須獨立產生 `MockStrategy.md`。

常見情境：

1. 多個 API 需要 mock
2. 有第三方 SDK / plugin
3. 有多個 browser APIs 需要 stub
4. partial mock 邊界複雜

## 4. 為什麼要求 `ExecutionRaw.log`

因為這是 Step 8 的必要原始執行證據。

若沒有 `ExecutionRaw.log`：

1. 無法穩定追溯測試命令與原始輸出
2. DONE gate 不應成立
3. 最終報告可信度下降

## 5. `GenerationReview.md` 缺失

`GenerationReview.md` 是 Step 7 的必要治理產物，用來記錄腳本產生品質 gate。

若缺失：

1. 回到 Step 7
2. 重新執行生成檢核
3. 更新 `RunReport.md` 的 `Generation Review Status`

## 6. 條件式產物為什麼是 `not_applicable`

若 `MockStrategy.md` 或 `GapReport.md` 未產生，不代表遺漏；前提是：

1. `RunReport.md` 有對應 `Status`
2. workflow 條件未達觸發門檻
3. 相關摘要已寫入 `StrategyDecision.md` 或 `InputSummary.md`

## 7. `pending`、`generated`、`not_applicable` 代表什麼

1. `pending`
表示該產物尚未被 workflow 判定或尚未產生。

2. `generated`
表示該產物已依規則產生，且能在 `RunReport.md` 中追蹤路徑與狀態。

3. `not_applicable`
表示該產物經 workflow 判定後不適用，不是遺漏，也不是失敗。
