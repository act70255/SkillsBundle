# Troubleshooting

## 1. 流程停在 `BLOCKED`

常見原因：

1. 缺少 `behavior_spec`
2. 缺少可執行的 `test_targets`
3. `framework_type` 無法安全推導
4. 外部依賴契約不明
5. env 或 plugin/SDK 缺失
6. `acceptance_rules` 無法確認，導致 Step 5 或 Step 6 無法合法繼續

處理方式：

1. 先檢查 `InputSummary.md`
2. 再檢查 `RunReport.md` 的 `Missing Required Inputs` 與 `阻塞問題`
3. 若 Step 2 後仍阻塞，查看 `GapReport.md`

補充：若 Step 2 已完成補件，流程必須先回到 Step 1 重跑輸入驗證；在重新驗證通過前，不應直接進入 Step 3。

## 2. 為什麼會產生 `GapReport.md`

當 Step 2 補件後仍存在 `missing_blocking`，且缺口阻塞 Step 3 之後流程時，必須產生 `GapReport.md`。這包含兩種路徑：

1. 使用者補件型缺口尚未解除
2. `test_env` 已被 Step 1 判定為 `env_blocker`，仍待人工修復

## 3. 為什麼會產生 `MockStrategy.md`

當外部依賴或 env 複雜到不適合只用 `StrategyDecision.md` 簡述時，必須獨立產生 `MockStrategy.md`。

符合以下任一條件時，`MockStrategy.md` 為實際必要產物：

1. 兩個以上外部 API / network dependency 需要 mock
2. 存在第三方 SDK、plugin 或 analytics side effect
3. 需要 mock 兩個以上 browser APIs，例如 `localStorage`、`location`、`ResizeObserver`
4. `test_env` 會影響測試行為或 mock 連線目標
5. 需要 partial mock，且 mock 邊界不只單一函式或單一模組

## 4. 為什麼要求 `ExecutionRaw.log`

因為這是 Step 8 的必要原始執行證據。

若沒有 `ExecutionRaw.log`：

1. 無法穩定追溯測試命令與原始輸出
2. DONE gate 不應成立
3. 最終報告可信度下降

## 4.1 為什麼要求 HTML 測試報告

因為 `test-report-html/index.html` 與 `coverage-html/index.html` 已被定義為 Step 8 的必要 HTML 證據。

若成功執行測試卻沒有這兩份 HTML 報告：

1. 無法提供可視化的案例結果與 coverage 細節
2. `RunReport.md` 的證據狀態無法完整對齊
3. `DONE` gate 不應成立

若 runner 或 coverage 工具沒有原生 HTML 輸出能力：

1. 必須補齊可用 reporter
2. 或建立明確的轉換流程並正規化到標準路徑
3. 否則 Step 8 應視為 `BLOCKED`

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

## 8. `Missing Required Inputs` 誰負責維護

1. Step 1 必須把所有 `missing_blocking` 欄位同步寫入 `RunReport.md` 的 `Missing Required Inputs`
2. Step 2 補件後，須將 `Input Validation Status` 重設為 `not_checked`，回到 Step 1 重跑；`Missing Required Inputs` 的清空由 Step 1 重跑驗證通過時執行，Step 2 不主動清空此欄位
3. 若 `Missing Required Inputs` 與 `InputSummary.md` 不一致，應回到 Step 1 重新驗證；確認 `Input Validation Status = passed` 後才可繼續進入 Step 3，不得直接跳步
4. `test_env` 雖可能出現在 `Missing Required Inputs`，但它不是一般補件欄位；Step 2 只能把它視為 `env_blocker` 並導回 Step 1 重跑驗證

## 9. 為什麼 Step 6 也可能停住

即使 Step 5 已完成策略決策，若出現以下情況，Step 6 仍不得進入 Step 7：

1. `acceptance_rules` 仍不明確
2. 測試案例無法追溯到規格、風險或 bug
3. 測試範圍與不測範圍仍不清楚

此時應查看 `RunReport.md` 的 `Planning Gate Status`，判斷是 `blocked` 還是仍需內部修正。

## 10. Step 4 BLOCKED（framework_type 無法確認）

若 `ClassificationSummary.md` 顯示 `Classification Status = blocked`，通常原因是：

1. `source_code` 或 `project_config` 不足以支撐框架推導（例如只有部分檔案、無 package.json、無設定檔）
2. 存在多個框架候選（例如 React + jQuery 混用），無法安全判定主要 `framework_type`
3. 既有測試工具設定缺失，無法從中推導

處理方式：

1. 查看 `ClassificationSummary.md` 的「技術棧分類 Evidence」與「備註」欄位，確認缺失的依據
2. 回到 Step 2 補件，補充 `source_code` 完整範圍、`project_config` 路徑或 `framework_type` 直接說明
3. 補件後，先回到 Step 1 重跑輸入驗證，確認 `Input Validation Status = passed` 後再繼續 Step 3 → Step 4

## 11. 已觸發的 `GapReport.md` 缺口解除後如何處理

當 `GapReport.md` 已產生（`Gap Report Status = generated`），且後續回合缺口已被補齊：

1. 在 `GapReport.md` 中將 `Status` 欄位更新為 `resolved`
2. 在 `RunReport.md` 的 `備註` 記錄缺口解除說明（解除時間點與補件摘要）
3. `GapReport.md` 本身保留作為歷史紀錄，`Gap Report Status`（即 `RunReport.md` 中的產物狀態欄位）維持 `generated`
4. 補件完成後，依正常流程回到 Step 1 重跑輸入驗證

## 12. `Test Env Status = blocked` 解除路徑

若 `RunReport.md` 顯示 `Test Env Status = blocked`，代表 Step 1 已經嘗試過自動初始化但失敗；此動作不得因其他 required inputs 缺失而被延後。接下來需要人工介入：

1. 查看 `RunReport.md` 的 `阻塞問題` 欄位，確認失敗原因（如 npm registry 不通、Node.js 版本過低、磁碟空間不足、無安裝權限等）
2. 依失敗原因修復環境（手動執行 `npm install`、升級 Node.js、確認網路連線或磁碟空間等）
3. Step 2 在此路徑只負責記錄 `env_blocker` 與修復建議，不負責重新選擇 runner 或直接把 `test_env` 改成已通過
4. 修復後，回到 Step 1 重新執行；Step 1 的 Process 步驟 4~9 會重新偵測環境並更新 `Test Env Status`
5. 若修復成功，`Test Env Status` 更新為 `passed`，流程可繼續進入 Step 3
6. 若環境限制超出可修復範圍（如嚴格受限執行環境、npm registry 封鎖），應在 `GapReport.md` 中明確記錄缺口類型為 `env_blocker`，並在 `阻塞問題` 說明無法自動修復的原因與建議的替代方案

## 13. `Planning Gate Status = failed` 解除路徑

`Planning Gate Status = failed` 代表測試計畫已起草，但案例追溯、範圍界線或驗收對應仍需內部修正（非外部阻塞）。解除路徑：

1. 查看 `RunReport.md` 的 `備註` 欄位，確認 Step 6 記錄的待修正項目
2. 常見 `failed` 情境：
   - 測試案例無法追溯到規格、風險或 bug
   - 測試範圍與不測範圍定義不清楚
   - 驗收條件（`acceptance_rules`）與案例對應不完整
3. 回到 Step 6，修正 `TestPlan.md` 與 `TestCases.md`，並將 `Planning Gate Status` 重設為 `not_checked`，再重新執行 Step 6 Process 步驟 5~8
4. 修正完成後，Step 6 應重新設定 `Planning Gate Status = passed`，`Status` 維持 `IN_PROGRESS`
5. 注意：`failed` 不等於 `blocked`——`Planning Gate Status = failed` 時，`Status` 應維持 `IN_PROGRESS`，不應設為 `BLOCKED`；若問題實際上是外部資訊缺失（如 `acceptance_rules` 無法確認），應改設為 `Planning Gate Status = blocked` 並走阻塞路徑

## 14. Coverage 指標全為 0%（Statements/Branches/Functions/Lines）

若 `Coverage Status = measured` 且四項 coverage 皆為 `0%`，依治理規則應判定為 `FAILED`（Coverage Zero Gate fail），不是 `BLOCKED`。

建議依以下順序排查：

1. `include/exclude` 設定是否誤排除 source（`include_misconfig`）
2. 測試是否實際執行（`tests_not_executed`）
3. 測試是否有觸發目標 function（import/呼叫 + assertion）（`no_target_invocation`）
4. coverage instrumentation 是否生效（`instrumentation_issue`）

補充高風險訊號：

1. 若測試以 `fs.readFileSync + eval` 或函式片段 `eval` 執行，coverage 常無法歸戶到 source module
2. 此情況應回到 Step 7，改為 `import`/`require` 載入被測模組後再重跑 Step 8

修復要求：

1. 在 `CoverageSummary.md` 填寫 `Coverage Zero Check`、`Root Cause Category`、`Next Fix Action`
2. 在 `ExecutionSummary.md` 填寫 `Coverage Gate Result` 與 `Failure Classification = coverage_zero`
3. 回到 Step 7 修正 Case-to-Function-to-Script 映射，再重跑 Step 8
