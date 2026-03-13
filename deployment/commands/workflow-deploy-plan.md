---
description: 規劃部署、回滾與監控策略
---

請先主動載入並使用以下 skills（依序）：
`scout-regiment-workflow-lite, deployment-engineer, cloud-architect, deployment-pipeline-design, deployment-procedures, secrets-management, observability-engineer`

目標：
- 為 $ARGUMENTS 產出部署總覽計畫，並導向可執行的分階段流程。

定位：
- 本指令為「整體規劃入口」。
- 新專案或新手團隊，建議優先拆分使用：
  1) `/workflow-deploy-readiness`
  2) `/workflow-deploy-package-docker`
  3) `/workflow-deploy-manual`
  4) `/workflow-deploy-cicd`

執行規則：
1) 先完成 Readiness 範圍盤點（環境、secrets、依賴、監控）。
2) 明確定義部署策略（手動/自動、滾動/金絲雀、回滾/前滾）。
3) 列出每階段 Gate 與阻塞條件，避免直接跳過檢查。
4) 若缺關鍵資訊，輸出單一最關鍵問題，不進入模糊規劃。

Workflow Gate：
1) 缺少目標環境資訊或版本策略：停止並回報阻塞。
2) 未定義回滾路徑：停止並回報阻塞。
3) 未定義 post-deploy 驗證：停止並回報阻塞。

請輸出：
1) `DEPLOY-PLAN.md`
   - 分階段流程（readiness/package/manual/cicd）
   - 前置檢查與 Gate
2) `RISK-REGISTER.md`
   - 風險分級、觸發條件、緩解措施
3) `ROLLBACK-PLAN.md`
   - 回滾策略、觸發門檻、驗證方式
4) `[DEPLOY]BLOCKERS.md`（如有）
   - 單一最關鍵問題 + 建議預設值
