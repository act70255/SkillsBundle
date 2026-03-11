---
description: 依 Runbook 手動部署與回滾演練
---

請先主動載入並使用以下 skills（依序）：
`deployment-procedures, deployment-engineer, incident-runbook-templates, cloud-devops, incident-responder, observability-engineer`

目標：
- 針對 $ARGUMENTS 執行手動部署，並完成 post-deploy 驗證與回滾可行性確認。

執行規則：
1) 部署前先完成前置檢查（環境、備份、目標版本、回滾版本）。
2) 依固定步驟執行：拉取版本 -> 部署 -> 驗證 -> 監控觀察。
3) 任何關鍵驗證失敗時，立即進入回滾決策。
4) 全程記錄操作時間點、版本資訊與驗證結果。

Workflow Gate：
1) 前置檢查未通過：不得開始部署。
2) 部署後健康檢查或關鍵業務 smoke 測試失敗：立即啟動回滾。
3) 回滾路徑不明或不可執行：停止並輸出阻塞。

請輸出：
1) `MANUAL-DEPLOY-REPORT.md`
   - 實際操作步驟與執行時間
   - 部署版本/回滾版本
   - post-deploy 驗證摘要
2) `ROLLBACK-DRILL-REPORT.md`
   - 回滾觸發條件
   - 回滾步驟與結果
3) `[DEPLOY]BLOCKERS.md`（如有）
   - 單一最關鍵問題
   - 建議預設值與處置方案
