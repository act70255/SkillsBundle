---
description: 上線前 Readiness 檢查與風險分級
---

請先主動載入並使用以下 skills（依序）：
`cloud-devops, environment-setup-guide, secrets-management, deployment-validation-config-validate, incident-runbook-templates, observability-engineer`

目標：
- 針對 $ARGUMENTS 執行部署前就緒檢查，確認是否可安全進入打包與部署。

執行規則：
1) 優先檢查：執行環境、機密管理、設定完整性、依賴服務、資料庫遷移風險。
2) 需明確標示每個檢查項狀態：`PASS`、`WARN`、`BLOCK`。
3) 遇到 `BLOCK` 時停止後續部署流程，先提出單一最關鍵阻塞問題。
4) 不直接修改應用程式規格文件；若涉及需求或驗收變更，改走 planning 流程。

Workflow Gate：
1) 缺少必要環境變數或 secrets：停止並輸出阻塞。
2) 健康檢查端點或基本 smoke 驗證不可用：停止並輸出阻塞。
3) 資料庫遷移不可回滾或風險未界定：停止並輸出阻塞。

請輸出：
1) `DEPLOY-READINESS.md`
   - 檢查清單與狀態（PASS/WARN/BLOCK）
   - 風險分級（Low/Medium/High）
   - 上線前必修項目
2) `[DEPLOY]BLOCKERS.md`（如有）
   - 單一最關鍵問題
   - 建議預設值與暫行處置
