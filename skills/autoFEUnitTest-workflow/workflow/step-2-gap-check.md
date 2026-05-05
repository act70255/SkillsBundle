# Step 2 - 缺口補件

## Scope
只處理 Step 2 的補件與阻塞分流。

## Entry Gate
- 必須確認 `RunReport.md` 中 `Input Validation Status = blocked` 才可進入補件；`Missing Required Inputs` 必須由 Step 1 寫入且非空（依 Step 1 完整性約束，若 `Input Validation Status = blocked` 但 `Missing Required Inputs` 為空，屬 Step 1 執行異常，Step 2 不得繼續補件；此情況下 Step 2 應在 `RunReport.md` 的 `阻塞問題` 記錄此異常，並將 `Current Step` 倒退至 Step 1（Step 2 有授權進行此倒退，見 `governance.md` Section 3），重跑 Step 1 修正異常後再進入 Step 2）
- 若 `Input Validation Status = passed`，不需要執行 Step 2；應繼續進入 Step 3

## Process
1. 讀取 `InputSummary.md` 與 `RunReport.md`
2. 找出 `missing_blocking` 欄位，並對照 `RunReport.md` 的 `Missing Required Inputs`
3. 將缺口分流為兩類：
   - 使用者補件型：`project_config`、`test_targets`、`behavior_spec`，以及缺少直接依據時需要使用者補充的 `framework_type` / `acceptance_rules`
   - 環境阻塞型：`test_env`
4. 僅對使用者補件型缺口採用一問一答方式補件
5. 若存在 `test_env`，不得把 `test_env` 當作一般一問一答補件欄位；應標記為 `env_blocker`，記錄 Step 1 自動初始化失敗摘要、建議人工修復步驟，以及回到 Step 1 重跑的條件
6. 補件或分流後回寫 `InputSummary.md`，並同步更新 `Missing Required Inputs`（僅更新仍存在的缺失欄位；若所有缺口均已補完，`Missing Required Inputs` 不主動清空，待 Step 1 重跑時清空）
7. 若核心輸入仍缺失，或 `test_env` 仍處於 `env_blocker`，產出 `GapReport.md`
8. 於 `RunReport.md` 記錄 `Gap Report Status = generated` 或 `not_applicable`
9. 若缺口已解除，將 `Input Validation Status` 重設為 `not_checked`；此時 `Status` 仍維持 `BLOCKED`，待 Step 1 重跑驗證通過後才更新為 `IN_PROGRESS`；`Missing Required Inputs` 的清空由後續 Step 1 重跑驗證通過時執行，Step 2 不主動清空此欄位；若 `GapReport.md` 已存在，在 `GapReport.md` 中將缺口狀態欄位（`Status: active / resolved`）更新為 `resolved`，並在 `RunReport.md` 的 `備註` 記錄缺口解除說明
10. 若核心輸入仍缺失，或 `test_env` 尚未修復，設定 `Input Validation Status = blocked`，並將 `RunReport` 狀態標記為 `BLOCKED`，同時在 `阻塞問題` 記錄缺口摘要與 `GapReport.md` 路徑
11. 刷新 `Last Updated`
12. 若補件完成，勾選 Step 2 檢查清單並將 `Current Step` 更新為 `Step 1`，強制重跑輸入驗證；若仍阻塞，`Current Step` 維持在 Step 2

## GapReport trigger
符合以下條件時，必須獨立產出 `GapReport.md`：
- Step 2 補件後，仍存在 `missing_blocking` 欄位
- 缺口已明確阻塞 Step 3 之後的流程
- 缺口需要後續回合或使用者補件才能解除

## 環境修復型缺口
當 `missing_blocking` 欄位為 `test_env`（即 `Test Env Status = blocked`）時，缺口性質屬於「環境修復型」，處理方式與規格缺口不同：

1. 不適合以「補件一問一答」解決；Step 2 不得重新選擇 runner、安裝依賴或直接宣告 `test_env` 已補齊
2. 應引導使用者確認並修復執行環境（確認 Node.js 版本、網路連線、npm 權限等）
3. 修復後，回到 Step 1 重新執行環境偵測，確認 `Test Env Status = passed`
4. 若環境問題超出 workflow 能自動處理的範圍（如 npm registry 封鎖、受限執行環境），應在 `GapReport.md` 明確標記缺口類型為 `env_blocker`，並在 `阻塞問題` 記錄建議的人工修復步驟

## Exit criteria
- 所有阻塞欄位已補齊且 `Current Step` 已更新為 `Step 1` 以待重跑輸入驗證，或已明確停在 `BLOCKED`
- 補件紀錄已寫入 `InputSummary.md`
- 若仍有缺口，`RunReport.md` 的 `Missing Required Inputs` 已更新為仍存在的缺失欄位；若缺口已解除，`Missing Required Inputs` 維持現狀，待 Step 1 重跑驗證通過時由 Step 1 清空（Step 2 不主動清空此欄位）
- `test_env` 若仍阻塞，已被記錄為 `env_blocker`，且未被當作一般補件欄位處理
- 若仍為 `BLOCKED`，`GapReport.md` 已建立並記錄缺口與建議下一步

## Skill-local resources
- Template: `<skill_root>/templates/InputSummary.template.md`
- Template: `<skill_root>/templates/GapReport.template.md`
- Rules: `<skill_root>/governance.md`
