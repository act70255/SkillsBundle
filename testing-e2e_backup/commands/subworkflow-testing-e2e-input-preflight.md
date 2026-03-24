---
description: E2E 子流程：檢查輸入、逐項補件、參數確認
---

目標：

- 檢查輸入參數完整性與格式。
- 缺少項目時逐項詢問使用者（必要與非必要皆需逐項確認）。
- 產出最終參數快照供後續子流程使用。
- 先記錄 secrets 設定鍵名（不可記錄敏感值），供後續規格/站台判定整併。

路徑規則唯一來源：`testing-e2e/commands/rule-testing-e2e-path.md`

讀取輸入：

1. 啟動參數（`scope/site-url/test-path/artifact-dir/input-file/src-path/secrets-file/scan-depth/max-routes/scan-timeout-sec`）

寫出檔案（內部交接）：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`

固定詢問順序（一次一題）：

1. 必要項：`測試範圍`
2. 必要項：`site-url`
3. 非必要項：`test-path`
4. 非必要項：`artifact-dir`
5. 非必要項：`input-file`
6. 非必要項：`src-path`
7. 非必要項：`secrets-file`
8. 非必要項：`scan-depth`
9. 非必要項：`max-routes`
10. 非必要項：`scan-timeout-sec`

規範：

1. 非必要項也要逐項詢問，允許「無輸入/略過」
2. URL 必須為 `http://` 或 `https://`
3. 路徑不得為空字串
4. 全部收集完成後，輸出最終參數快照並等待使用者確認
5. 未確認前不得進入下一子流程
6. `site-url` 必填；缺失時必須持續補件，禁止進入下一子流程
7. 僅可記錄 secrets 變數鍵名（例如 `PW_LOGIN_EMAIL`），不得記錄任何實際值
8. 若使用者明確表示此批次需要登入/敏感資料，需在快照標記 `secretKeys`（最少 `PLAYWRIGHT_BASE_URL`、`PW_LOGIN_EMAIL`、`PW_LOGIN_PASSWORD`）
9. `scan-depth`、`max-routes`、`scan-timeout-sec` 若未指定，需套用預設值 `3/30/300`
10. `scan-depth`、`max-routes`、`scan-timeout-sec` 必須為正整數；非法值需要求使用者更正

輸出：

- 必須寫入 `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
- 檔案需符合 `rule-testing-e2e-path.md` 的最小欄位契約
- `CurrentState` 更新為 `PRECHECK`
