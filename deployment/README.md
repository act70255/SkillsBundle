# Deployment Workflows 使用說明

這份文件給「部署經驗不多」的開發者使用，目標是用最少步驟完成可回滾、可驗證的上線流程。

## 先理解：Docker 只是其中一段

部署不只是在做 Docker，完整流程通常是：

1. 上線前檢查（Readiness）
2. 打包 Docker（Package）
3. 手動部署跑通一次（Manual）
4. 再做 CI/CD 自動化（CICD）

## 快速選擇

- 不確定現在能不能上線：`/workflow-deploy-readiness`
- 要建置 Docker 產物：`/workflow-deploy-package-docker`
- 要人工上線並做回滾演練：`/workflow-deploy-manual`
- 要建立或調整自動部署管線：`/workflow-deploy-cicd`

## 建議執行順序（MVP）

```text
1) /workflow-deploy-readiness <服務或模組>
2) /workflow-deploy-package-docker <服務或模組>
3) /workflow-deploy-manual <環境/版本>
4) /workflow-deploy-cicd <repository 或服務名稱>
```

若任一步驟輸出 `[DEPLOY]BLOCKERS.md`，先解掉 blocker 再進下一步。

## 新手版四步驟（你實際要做什麼）

### Step 1: 檢查（Readiness）

- 要做的事：確認環境變數、secrets、健康檢查端點、資料庫遷移策略、監控告警是否齊全。
- 完成標準：`DEPLOY-READINESS.md` 沒有 `BLOCK`。

### Step 2: 打包 Docker（Package）

- 要做的事：建立可重現 image（建議版本 tag + commit sha），並在容器內跑基本健康檢查。
- 完成標準：成功建置 image，容器可啟動，`/health` 可通。

### Step 3: 手動部署（Manual）

- 要做的事：先在目標環境手動上線一次，完整記錄步驟與版本，並演練至少一次回滾。
- 完成標準：`MANUAL-DEPLOY-REPORT.md` 與 `ROLLBACK-DRILL-REPORT.md` 皆可用。

### Step 4: CI/CD 自動化（CICD）

- 要做的事：把手動流程轉成 pipeline（build -> test -> package -> deploy -> verify）。
- 完成標準：pipeline 可重複執行，且失敗時能明確停在 gate 並給回滾建議。

## 每步驟輸入建議

- `workflow-deploy-readiness`：服務名稱、目標環境、依賴資源（DB/Queue/Cache）。
- `workflow-deploy-package-docker`：服務名稱、映像標籤策略、啟動命令與健康檢查路徑。
- `workflow-deploy-manual`：服務名稱、環境、目標版本、回滾版本。
- `workflow-deploy-cicd`：repo、分支策略、部署環境（dev/staging/prod）、CI 平台（如 GitHub Actions）。

## 常見誤解

- 「有 Dockerfile 就等於可部署」：不對，還要有驗證、監控與回滾。
- 「先做 CI/CD 比較快」：新手通常先手動跑通，再自動化才穩。
- 「部署成功 = 任務完成」：還要看 post-deploy 指標與業務 smoke 測試。

## 各 workflow 白話說明

### 1) `workflow-deploy-readiness`

使用情境：
- 你不知道目前專案是不是已具備上線條件。
- 懷疑 env、secrets、DB migration、監控告警還沒準備好。

你會拿到：
- `DEPLOY-READINESS.md`：哪些已就緒，哪些還缺。
- `[DEPLOY]BLOCKERS.md`（條件式）：目前最關鍵卡點。

### 2) `workflow-deploy-package-docker`

使用情境：
- 你已經確認可上線，接下來要做可部署 image。
- 想先確保容器能啟動且健康檢查可過。

你會拿到：
- `DOCKER-PACKAGE-REPORT.md`：Dockerfile/compose 變更與 image 驗證結果。
- `[DEPLOY]BLOCKERS.md`（條件式）：打包或啟動失敗原因。

### 3) `workflow-deploy-manual`

使用情境：
- 先不用 CI/CD，自行手動上線一次確認流程可行。
- 你想先建立可執行的 Runbook 與回滾路徑。

你會拿到：
- `MANUAL-DEPLOY-REPORT.md`：實際手動部署紀錄。
- `ROLLBACK-DRILL-REPORT.md`：回滾演練結果。
- `[DEPLOY]BLOCKERS.md`（條件式）：部署或回滾阻塞。

### 4) `workflow-deploy-cicd`

使用情境：
- 手動流程已跑通，準備改成自動化。
- 想把 build/test/deploy/post-check 變成固定 pipeline。

你會拿到：
- `CICD-DEPLOY-PLAN.md`：pipeline 階段、觸發條件、gate 規則。
- `CICD-DEPLOY-REPORT.md`：執行結果與失敗修復建議。
- `[DEPLOY]BLOCKERS.md`（條件式）：CI/CD 上線阻塞。

## 調用案例

```text
/workflow-deploy-readiness payment-api staging
```

```text
/workflow-deploy-package-docker payment-api
```

```text
/workflow-deploy-manual payment-api staging v1.4.2
```

```text
/workflow-deploy-cicd payment-api github-actions
```

## 舊指令相容

- `/workflow-deploy-plan`：仍可使用，定位為「總覽規劃入口」，建議逐步改用 `readiness + package + manual + cicd`。
- `/workflow-deploy-execute`：仍可使用，定位為「整合執行入口」，建議在成熟團隊保留作一鍵流程。
