---
description: 執行部署流程與上線後驗證
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, deployment-engineer, cloud-devops, deployment-procedures, deployment-validation-config-validate, observability-engineer, incident-responder`

目標：
- 依流程執行 $ARGUMENTS 部署與驗證，並在失敗時提供明確回滾決策。

定位：
- 本指令為「整合執行入口」。
- 若流程尚未成熟，建議先分階段使用：
  - `/workflow-deploy-readiness`
  - `/workflow-deploy-package-docker`
  - `/workflow-deploy-manual`
  - `/workflow-deploy-cicd`

執行規則：
1) 部署前需確認前置檢查、備援、回滾版本皆可用。
2) 依序執行：部署 -> post-deploy 驗證 -> 觀測指標確認。
3) 若關鍵驗證失敗，立即進入回滾評估並輸出建議。
4) 記錄版本、時間點、驗證結果與處置決策。

Workflow Gate：
1) 前置檢查未過：停止部署。
2) 部署後健康檢查或關鍵 smoke 測試失敗：標記失敗並輸出回滾建議。
3) 無法確認回滾可行性：停止並輸出阻塞。

請執行：
1) 前置檢查與備援確認
2) 執行部署
3) 進行 post-deploy 驗證
4) 輸出結果與回滾建議

請輸出：
1) `DEPLOY-REPORT.md`
   - 部署步驟與結果
   - 版本、時間點、異常摘要
2) `POST-DEPLOY-VALIDATION.md`
   - 健康檢查、smoke 測試、關鍵指標結果
3) `[DEPLOY]BLOCKERS.md`（如有）
   - 單一最關鍵問題 + 建議預設值
