---
description: 建立並驗證 Docker 打包產物
---

請先主動載入並使用以下 skills（依序）：
`docker-expert, deployment-engineer, cloud-devops, deployment-validation-config-validate`

目標：
- 針對 $ARGUMENTS 建立可部署的 Docker 產物，並完成最小可用驗證。

執行規則：
1) 以可重現建置為優先：固定基底映像版本、固定依賴版本來源。
2) 避免將 secrets 打入 image；敏感設定一律使用執行環境注入。
3) 提供明確 tag 策略（版本號 + commit sha）。
4) 打包完成後，至少執行一次容器啟動與健康檢查驗證。

Workflow Gate：
1) image 無法成功建置或啟動：停止並回報。
2) 健康檢查失敗或關鍵依賴無法連線：停止並回報。
3) 掃描到高風險設定（明文密鑰、debug 開啟）：停止並回報。

請輸出：
1) `DOCKER-PACKAGE-REPORT.md`
   - Dockerfile/compose 變更摘要
   - image tag 與建置結果
   - 本機或測試環境啟動驗證結果
2) `[DEPLOY]BLOCKERS.md`（如有）
   - 單一最關鍵問題
   - 建議預設值與修復方向
