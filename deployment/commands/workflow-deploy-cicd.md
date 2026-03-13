---
description: 建立 CI/CD 部署管線與自動驗證
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, deployment-pipeline-design, cicd-automation-workflow-automate, github-actions-templates, gitlab-ci-patterns, git-advanced-workflows, deployment-validation-config-validate, observability-engineer`

目標：
- 為 $ARGUMENTS 建立可重複執行的 CI/CD 部署流程，並加入部署前後驗證守門。

執行規則：
1) 最小管線需包含：build -> test -> package -> deploy -> post-deploy verify。
2) 以環境分層（dev/staging/prod）控管部署策略與權限。
3) 部署前 gate 必須檢查測試結果與必要設定（secrets/env）。
4) 部署後 gate 必須檢查健康狀態與關鍵指標；失敗時提供回滾建議。

Workflow Gate：
1) 測試或品質檢查失敗：停止部署。
2) 缺少必要 secrets/變數：停止部署。
3) post-deploy 驗證未通過：標記失敗並輸出回滾建議。

請輸出：
1) `CICD-DEPLOY-PLAN.md`
   - 管線階段、觸發條件、環境策略
   - Gate 規則與失敗分流
2) `CICD-DEPLOY-REPORT.md`
   - 本次執行結果摘要
   - 失敗步驟與修復建議（如有）
3) `[DEPLOY]BLOCKERS.md`（如有）
   - 單一最關鍵問題
   - 建議預設值與替代方案
