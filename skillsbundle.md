# Skills Bundle 規劃（流程總控優先）

> 目標：建立 5 個可手動切換的技能包：`planning`、`dev-dotnet`、`dev-python`、`testing`、`deployment`

## 掃描基準

- 掃描來源：`antigravity-awesome-skills/skills/**/SKILL.md`
- 掃描總數：`1234` skills
- 規劃原則：
  1. 先選「流程型總控 skills（workflow-bundle / granular-workflow-bundle）」
  2. 再補「語言/框架子 skills」
  3. 明列總控 skill 的依賴，避免整理時漏掉

---

以下以「各 Bundle 總表」為唯一維護來源（Single Source of Truth）。

## 手動切換建議（避免過重）

1. 每次只啟用 1 個主包。
2. 啟用順序建議：先主控 skill，再補 5-10 個必要子 skill。
3. 若 token 壓力大，先停用跨領域依賴（例如 `cloud-devops` 中你暫時不用的雲平台技能）。
4. 開發流程建議：`planning` -> `dev-dotnet/dev-python` -> `testing` -> `deployment`。

---

## 各 Bundle 總表

### `planning`

| SKILLS NAME | 類型(總控/子SKILLS) | 功能說明 | 依賴SKILLS |
|---|---|---|---|
| `concise-planning` | 總控 | 與人類互動釐清需求，產出可執行、可驗證的規劃步驟 | 無顯式依賴 |
| `planning-with-files` | 總控 | 用檔案化方式持續更新規劃，追蹤需求變更、發現與進度 | 無顯式依賴 |
| `brainstorming` | 子SKILLS | 需求發散收斂、方案探索 | - |
| `architecture` | 子SKILLS | 系統架構、分層與模組邊界規劃 | - |
| `architecture-decision-records` | 子SKILLS | ADR 決策記錄與追蹤 | - |
| `senior-architect` | 子SKILLS | 中大型系統架構決策與權衡 | - |
| `product-manager-toolkit` | 子SKILLS | MVP、優先級、里程碑管理 | - |
| `api-design-principles` | 子SKILLS | API 契約一致性與可維護設計 | - |
| `writing-plans` | 子SKILLS | 輸出高品質計畫文件 | - |
| `ask-questions-if-underspecified` | 子SKILLS | 規格不足時補關鍵問題 | - |

### `planning` 目標輸出文件（預設）

- `SPEC`（需求與範圍、約束、邊界條件）
- 驗收標準（Acceptance Criteria）
- 架構規劃（分層、模組責任、資料/API 邊界）
- 風險與衝突清單（含待確認事項）
- 開發任務拆解（可執行 steps）

### `planning` 規格必要補完條目（Checklist）

- 功能需求
- 非功能需求
- 技術選型
- 軟體架構
- 服務架構
- 資料設計與 API/契約
- 驗收標準
- 風險/假設/依賴/待確認問題

### `dev-dotnet`

| SKILLS NAME | 類型(總控/子SKILLS) | 功能說明 | 依賴SKILLS |
|---|---|---|---|
| `development` | 總控 | 全開發生命週期流程（setup、backend、db、testing、quality、deploy） | `app-builder`, `senior-fullstack`, `environment-setup-guide`, `concise-planning`, `frontend-developer`, `frontend-design`, `react-patterns`, `typescript-pro`, `tailwind-patterns`, `nextjs-app-router-patterns`, `backend-architect`, `backend-dev-guidelines`, `nodejs-backend-patterns`, `fastapi-pro`, `api-design-principles`, `auth-implementation-patterns`, `database-architect`, `database-design`, `prisma-expert`, `postgresql`, `neon-postgres`, `test-driven-development`, `javascript-testing-patterns`, `python-testing-patterns`, `e2e-testing-patterns`, `playwright-skill`, `code-reviewer`, `clean-code`, `lint-and-validate`, `security-scanning-security-sast`, `deployment-engineer`, `docker-expert`, `vercel-deployment`, `github-actions-templates`, `cicd-automation-workflow-automate` |
| `dotnet-architect` | 子SKILLS | .NET 後端架構與分層設計 | - |
| `dotnet-backend` | 子SKILLS | ASP.NET Core API 與後端服務實作 | - |
| `dotnet-backend-patterns` | 子SKILLS | .NET DI/EF Core/Dapper/測試等實務模式 | - |
| `csharp-pro` | 子SKILLS | C# 語言層級最佳實務 | - |
| `sql-pro` | 子SKILLS | SQL 調校與查詢優化 | - |
| `database-design` | 子SKILLS | schema/索引/ORM 選型 | - |
| `api-design-principles` | 子SKILLS | API 介面一致與演進策略 | - |
| `clean-code` | 子SKILLS | 程式可讀性與維護性提升 | - |

### `dev-python`

| SKILLS NAME | 類型(總控/子SKILLS) | 功能說明 | 依賴SKILLS |
|---|---|---|---|
| `python-fastapi-development` | 總控 | Python/FastAPI 後端完整流程（setup -> DB -> API -> auth -> testing -> docs -> deploy） | `app-builder`, `python-development-python-scaffold`, `fastapi-templates`, `uv-package-manager`, `prisma-expert`, `database-design`, `postgresql`, `pydantic-models-py`, `fastapi-router-py`, `api-design-principles`, `api-patterns`, `auth-implementation-patterns`, `api-security-best-practices`, `fastapi-pro`, `error-handling-patterns`, `python-testing-patterns`, `api-testing-observability-api-mock`, `api-documenter`, `openapi-spec-generation`, `deployment-engineer`, `docker-expert` |
| `python-pro` | 子SKILLS | Python 3.12+ 生產級開發實務 | - |
| `python-patterns` | 子SKILLS | Pythonic 設計模式與結構化寫法 | - |
| `async-python-patterns` | 子SKILLS | asyncio 並發與非同步設計 | - |
| `python-performance-optimization` | 子SKILLS | Python 效能分析與優化 | - |
| `clean-code` | 子SKILLS | 程式品質與可維護性 | - |
| `sql-pro` | 子SKILLS | SQL 查詢與資料庫效能調校 | - |

### `testing`

| SKILLS NAME | 類型(總控/子SKILLS) | 功能說明 | 依賴SKILLS |
|---|---|---|---|
| `testing-qa` | 總控 | 測試全流程（策略、單元、整合、E2E、效能、品質閘） | `test-automator`, `test-driven-development`, `javascript-testing-patterns`, `python-testing-patterns`, `unit-testing-test-generate`, `tdd-orchestrator`, `api-testing-observability-api-mock`, `e2e-testing-patterns`, `playwright-skill`, `webapp-testing`, `browser-automation`, `screenshots`, `performance-engineer`, `performance-profiling`, `web-performance-optimization`, `code-reviewer`, `code-review-excellence`, `find-bugs`, `security-scanning-security-sast`, `lint-and-validate`, `verification-before-completion` |
| `e2e-testing` | 總控 | E2E 專項流程（Playwright、視覺回歸、跨瀏覽器、CI） | `playwright-skill`, `e2e-testing-patterns`, `test-automator`, `webapp-testing`, `browser-automation`, `ui-visual-validator`, `github-actions-templates`, `cicd-automation-workflow-automate` |
| `debugging-strategies` | 子SKILLS | 根因分析與除錯策略 | - |
| `systematic-debugging` | 子SKILLS | 系統化定位問題與驗證 | - |
| `test-fixing` | 子SKILLS | 失敗測試修復流程 | - |
| `code-review-checklist` | 子SKILLS | PR 品質檢查清單 | - |

### `deployment`

| SKILLS NAME | 類型(總控/子SKILLS) | 功能說明 | 依賴SKILLS |
|---|---|---|---|
| `cloud-devops` | 總控 | 雲端與 DevOps 總流程（infra、容器、CI/CD、監控、安全、DR） | `cloud-architect`, `aws-skills`, `azure-functions`, `gcp-cloud-run`, `terraform-skill`, `terraform-specialist`, `kubernetes-architect`, `docker-expert`, `helm-chart-scaffolding`, `k8s-manifest-generator`, `k8s-security-policies`, `deployment-engineer`, `cicd-automation-workflow-automate`, `github-actions-templates`, `gitlab-ci-patterns`, `deployment-pipeline-design`, `observability-engineer`, `grafana-dashboards`, `prometheus-configuration`, `datadog-automation`, `sentry-automation`, `cloud-penetration-testing`, `aws-penetration-testing`, `secrets-management`, `mtls-configuration`, `cost-optimization`, `database-cloud-optimization-cost-optimize`, `incident-responder`, `incident-runbook-templates`, `postmortem-writing` |
| `deployment-engineer` | 子SKILLS | 部署工程主導（部署策略、風險控管、回滾與可觀測性） | - |
| `cloud-architect` | 子SKILLS | 雲端架構、環境分層、可靠性與成本權衡 | - |
| `deployment-pipeline-design` | 子SKILLS | 多階段 CI/CD 設計、Gate 與批准流程 | - |
| `deployment-procedures` | 子SKILLS | 上線前檢查、回滾、驗證與安全發布原則 | - |
| `deployment-validation-config-validate` | 子SKILLS | 佈署配置驗證、環境一致性與安全檢核 | - |
| `secrets-management` | 子SKILLS | 機密管理（Vault/Cloud Secret Manager/Key Vault） | - |
| `observability-engineer` | 子SKILLS | 指標/日誌/追蹤、SLO/告警與上線後驗證 | - |
| `incident-responder` | 子SKILLS | 事故應變、分級、回復與事後檢討流程 | - |
| `incident-runbook-templates` | 子SKILLS | Incident Runbook 模板、演練與交接標準化 | - |
| `cicd-automation-workflow-automate` | 子SKILLS | CI/CD 自動化編排與品質閘落地 | - |
| `github-actions-templates` | 子SKILLS | GitHub Actions 工作流模板與部署實作 | - |
| `gitlab-ci-patterns` | 子SKILLS | GitLab CI 多階段管線與環境部署模式 | - |
| `git-advanced-workflows` | 子SKILLS | 進階 Git 流程（rebase/cherry-pick/回溯） | - |
| `docker-expert` | 子SKILLS | 容器化、映像優化、安全強化與驗證 | - |
| `environment-setup-guide` | 子SKILLS | 環境一致化與基礎配置管理 | - |

### `deployment` 已同步技能清單（來源：`antigravity-awesome-skills/skills`）

- 直接由 commands 使用：`deployment-engineer`, `cloud-architect`, `deployment-pipeline-design`, `deployment-procedures`, `secrets-management`, `observability-engineer`, `cloud-devops`, `deployment-validation-config-validate`, `incident-responder`, `cicd-automation-workflow-automate`, `github-actions-templates`, `gitlab-ci-patterns`, `git-advanced-workflows`, `incident-runbook-templates`, `docker-expert`, `environment-setup-guide`
- 由 `cloud-devops` 轉引並一併同步：`aws-skills`, `azure-functions`, `gcp-cloud-run`, `terraform-skill`, `terraform-specialist`, `kubernetes-architect`, `helm-chart-scaffolding`, `k8s-manifest-generator`, `k8s-security-policies`, `grafana-dashboards`, `prometheus-configuration`, `datadog-automation`, `sentry-automation`, `cloud-penetration-testing`, `aws-penetration-testing`, `mtls-configuration`, `cost-optimization`, `database-cloud-optimization-cost-optimize`, `postmortem-writing`
- 目前 `SkillsBundle/deployment/skills` 同步數量：`35`

---

## Slash Commands 使用說明

| Slash Command | 用法 | 何時使用（情境） |
|---|---|---|
| `/workflow-spec-create` | `/workflow-spec-create <需求或目標>` | 專案啟動時與人類互動釐清需求，檢查完整性/衝突，產出 SPEC 與驗收標準 |
| `/workflow-spec-update` | `/workflow-spec-update <本次要推進的任務>` | 需求變更後更新 SPEC、補齊缺漏、修正衝突，並同步架構與執行規劃 |
| `/workflow-dotnet-validation` | `/workflow-dotnet-validation <功能需求>` | 先驗證規格文件完整性，僅產出 `[SPEC]CHANGE-REQUEST.md` 交接 planning |
| `/workflow-dotnet-implement` | `/workflow-dotnet-implement <功能需求（可省略）>` | 依 SPEC/TASKS 實作並回填驗收覆蓋與風險；未提供時由 TASKS 推導並以問答補齊 |
| `/workflow-python-validation` | `/workflow-python-validation <功能需求>` | 先驗證規格文件完整性，僅產出 `[SPEC]CHANGE-REQUEST.md` 交接 planning |
| `/workflow-python-implement` | `/workflow-python-implement <功能需求（可省略）>` | 依 SPEC/TASKS 實作並回填驗收覆蓋與風險；未提供時由 TASKS 推導並以問答補齊 |
| `/workflow-testing-plan` | `/workflow-testing-plan <變更範圍>` | 建立測試策略與測試案例（僅文件，不產測試腳本） |
| `/workflow-testing-script-generate` | `/workflow-testing-script-generate <變更範圍> --target playwright\|chromedevtools\|mixed --src-path <path> --test-path <path>` | 依指定路徑與測試文件產出自動化腳本 |
| `/workflow-testing-execute` | `/workflow-testing-execute <變更範圍> --target playwright\|chromedevtools\|mixed` | 依目標執行測試、產出 `TEST-REPORT.md`，必要時輸出阻塞交接文件 |
| `/workflow-deploy-readiness` | `/workflow-deploy-readiness <服務或模組>` | 上線前 Readiness 檢查（環境、secrets、依賴、遷移風險） |
| `/workflow-deploy-package-docker` | `/workflow-deploy-package-docker <服務或模組>` | 建立可部署 Docker 產物並做最小可用驗證 |
| `/workflow-deploy-manual` | `/workflow-deploy-manual <服務/環境/版本>` | 依 Runbook 手動部署、驗證與回滾演練 |
| `/workflow-deploy-cicd` | `/workflow-deploy-cicd <repo 或服務名稱>` | 建立/調整 CI/CD 管線與部署前後 Gate |
| `/workflow-deploy-plan` | `/workflow-deploy-plan <服務或版本>` | 上線前規劃部署步驟、回滾與監控策略 |
| `/workflow-deploy-execute` | `/workflow-deploy-execute <服務或版本>` | 實際部署、上線後驗證、必要時回滾判斷 |

> 補充：`<...>` 內容會對應 command 模板內的 `$ARGUMENTS`。

> 命名規範（強制）：僅「跨 workflow/bundle 溝通文件」使用 `[]` 前綴，例如 `[SPEC]CHANGE-REQUEST.md`、`[SPEC]BLOCKERS.md`、`[DEV]BLOCKERS.md`、`[TEST]BLOCKERS.md`；其餘一般產出文件維持既有命名（如 `IMPLEMENTATION-REPORT.md`、`TEST-REPORT.md`、`TEST-PLAN.md`）。

> 跨包交接：在 `dev-*` bundle 內若需修訂規格，先產生 `[SPEC]CHANGE-REQUEST.md`，再切換到 `planning` bundle 執行 `/workflow-spec-update`。

> Validation 輸出規範（強制）：`/workflow-dotnet-validation` 與 `/workflow-python-validation` 僅可產出單一文件 `[SPEC]CHANGE-REQUEST.md`，不得額外產出其他報告文件。

> Testing 輸出規範（強制）：`/workflow-testing-plan` 必須產出 `TEST-PLAN.md` 與 `TEST-CASES.md`；`/workflow-testing-script-generate` 必須產出測試腳本與 `TEST-SCRIPT-REPORT.md`；`/workflow-testing-execute` 必須產出 `TEST-REPORT.md`，僅在阻塞時產出 `[TEST]BLOCKERS.md`。

> Testing 執行目標規範：`/workflow-testing-plan` 維持單一規劃流程，不拆 Playwright/Chrome DevTools 兩份；於 `TEST-CASES.md` 以 `AutomationTarget = playwright | chromedevtools | manual` 標註。`/workflow-testing-script-generate` 透過 `--target` 決定腳本產出路徑，`/workflow-testing-execute` 透過 `--target` 決定執行目標。

> Testing 腳本產出規範：測試腳本產出由 `/workflow-testing-script-generate` 專責。此流程以 prompt argument 為主（`--target`、`--src-path`、`--test-path`），路徑優先序為「明確參數 > 專案慣例 > 預設值」。腳本輸出路徑為 `testscripts/playwright/` 與 `testscripts/chrome-devtools/`。`/workflow-testing-plan` 不直接產腳本。

> Testing 模板路徑：
> - 開發倉庫：`SkillsBundle/testing/templates/TEST-PLAN.template.md`、`SkillsBundle/testing/templates/TEST-CASES.template.md`、`SkillsBundle/testing/templates/TEST-REPORT.template.md`、`SkillsBundle/testing/templates/TEST-SCRIPT-REPORT.template.md`
> - 部署建議：`.opencode/templates/testing/TEST-PLAN.template.md`、`.opencode/templates/testing/TEST-CASES.template.md`、`.opencode/templates/testing/TEST-REPORT.template.md`、`.opencode/templates/testing/TEST-SCRIPT-REPORT.template.md`

> OpenCode 部署路徑建議：
> - Commands：`.opencode/commands/`
> - Skills：`.opencode/skills/`
> - Templates：`.opencode/templates/`

> 阻塞交付規範：若 `implement` 階段遇到阻塞，先在 `dev-*` bundle 更新 `[SPEC]CHANGE-REQUEST.md`（阻塞原因、影響 TASK/AC、建議修正與建議預設值），再切換到 `planning` bundle 執行 `/workflow-spec-update <阻塞摘要>`，待規格更新後才可回到 `dev-*` 繼續實作。

---

## 使用說明範例（建議流程）

### 範例 1：建立 PLANNING 新專案計畫

情境：要啟動一個新 .NET 專案，先把需求與規格建立完整。

1. 切換到 `planning` bundle。
2. 執行：`/workflow-spec-create 建立會員中心與 JWT 登入 API`。
3. 產出並確認文件：
   - `SPEC.md`
   - `ACCEPTANCE-CRITERIA.md`
   - `ARCHITECTURE.md`
   - `TASKS.md`
4. 若仍有缺漏，先完成一問一答補件，再進入開發 bundle。

### 範例 2：透過 PLANNING 建立變更計畫

情境：需求新增「Refresh Token 機制」與「登入風險控管」。

1. 切換到 `planning` bundle。
2. 執行：`/workflow-spec-update 新增 Refresh Token 與登入風險控管`。
3. 更新並確認文件一致性：
   - `SPEC.md`（更新需求與邊界）
   - `ACCEPTANCE-CRITERIA.md`（新增/調整驗收條件）
   - `ARCHITECTURE.md`（補充受影響模組）
   - `TASKS.md`（重排執行順序與驗證點）

### 範例 3：DEV 進行規格驗證（不寫程式）

情境：要確認目前規格是否可直接落地實作。

1. 切換到 `dev-dotnet` bundle。
2. 執行：`/workflow-dotnet-validation 會員中心登入與權限管理`。
3. 讀取輸出：
   - `[SPEC]CHANGE-REQUEST.md`（唯一輸出）
4. 若有規格缺漏/衝突，於 DEV 端先產出：`[SPEC]CHANGE-REQUEST.md`。
5. 驗證命令不得再輸出其他文件（例如 Blueprint、Trace、Open Questions）。

### 範例 4：PLANNING 讀取 DEV 驗證結果並更新文件

情境：DEV 驗證發現驗收條件不可測、TASK Trace 不完整。

1. 切換回 `planning` bundle。
2. 依 `[SPEC]CHANGE-REQUEST.md` 內容執行：
   - `/workflow-spec-update 修正 TASK Trace 與驗收可測性（依 [SPEC]CHANGE-REQUEST）`
3. 完成後再次確認：`SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`ARCHITECTURE.md`、`TASKS.md` 已同步。

### 範例 5：DEV 執行開發

情境：規格已穩定、可追溯且可測，開始實作。

1. 切換到 `dev-dotnet` bundle。
2. 執行：`/workflow-dotnet-implement 會員中心登入與權限管理`。
3. 預期輸出：
   - `IMPLEMENTATION-REPORT.md`
   - `TASKS.md`（僅更新任務進度：勾選/狀態/完成時間）
   - `[DEV]BLOCKERS.md`（若有阻塞）
4. 若開發中再次發現規格問題：
   - DEV 不直接改 planning 文件
   - 先更新 `[SPEC]CHANGE-REQUEST.md`
   - 再切換 `planning` 執行 `/workflow-spec-update`

### 範例 6：有阻塞時如何交付 PLANNING

情境：`/workflow-dotnet-implement` 遇到阻塞（例如驗收條件不可測、TASK 無法追溯、規格衝突）。

1. 留在 `dev-dotnet`（或 `dev-python`）bundle，先更新 `[SPEC]CHANGE-REQUEST.md`，至少包含：
   - 阻塞類型（缺漏/衝突/不可測/外部依賴）
   - 受影響範圍（TASK 編號、AC 編號、模組/API/資料）
   - 建議修正內容（可直接給 planning 套用）
   - 建議預設值與風險
2. 停止繼續開發，避免基於錯誤規格擴大變更。
3. 切換到 `planning` bundle，執行：
   - `/workflow-spec-update 依 [SPEC]CHANGE-REQUEST.md 解阻塞並更新規格`
4. PLANNING 更新完成後，回到 `dev-*` bundle 重新執行 validation 或 implement。

### 範例 7：TESTING 三段式流程（文件 -> 產腳本 -> 執行）

情境：功能已完成，需建立可回歸的自動化測試並執行驗證。

1. 切換到 `testing` bundle。
2. 執行測試規劃：`/workflow-testing-plan 會員登入與權限檢查`。
3. 產出並確認：
   - `TEST-PLAN.md`
   - `TEST-CASES.md`
4. 依需求產生腳本：`/workflow-testing-script-generate 會員登入與權限檢查 --target mixed --src-path src --test-path tests`。
5. 產出並確認：
   - `testscripts/playwright/*`
   - `testscripts/chrome-devtools/*`
   - `TEST-SCRIPT-REPORT.md`
6. 執行測試：`/workflow-testing-execute 會員登入與權限檢查 --target mixed`。
7. 讀取結果：
   - `TEST-REPORT.md`
   - `[TEST]BLOCKERS.md`（僅阻塞時）

### 一頁式流程摘要

`planning:/workflow-spec-create`
-> `dev-dotnet:/workflow-dotnet-validation`
->（有缺漏）`planning:/workflow-spec-update`
-> `dev-dotnet:/workflow-dotnet-implement`
-> `testing:/workflow-testing-plan`
-> `testing:/workflow-testing-script-generate --target mixed --src-path <path> --test-path <path>`
-> `testing:/workflow-testing-execute --target mixed`
->（有新衝突）`planning:/workflow-spec-update`
->（上線前）`deployment:/workflow-deploy-plan`
->（實際上線）`deployment:/workflow-deploy-execute`
