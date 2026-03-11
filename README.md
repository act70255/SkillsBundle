# Skills Bundle 模組說明

本文件以「模組」為單位整理以下資訊：
- 每個模組有哪些 Workflow
- 每個 Workflow 主要調用哪些 Skills
- Skills 之間的依賴關係（Skill -> Skill）

## 模組總覽

| 模組 | 主要用途 | 代表 Workflow |
|---|---|---|
| `planning` | 需求釐清、規格建立與更新 | `/workflow-spec-create`, `/workflow-spec-update` |
| `dev-dotnet` | .NET 功能驗證與實作 | `/workflow-dotnet-validation`, `/workflow-dotnet-implement` |
| `dev-python` | Python/FastAPI 功能驗證與實作 | `/workflow-python-validation`, `/workflow-python-implement` |
| `testing` | 測試規劃、腳本產生與執行 | `/workflow-testing-plan`, `/workflow-testing-script-generate`, `/workflow-testing-execute` |
| `deployment` | 上線準備、封裝、部署與 CI/CD | `/workflow-deploy-readiness`, `/workflow-deploy-package-docker`, `/workflow-deploy-manual`, `/workflow-deploy-cicd`, `/workflow-deploy-plan`, `/workflow-deploy-execute` |

---

## `planning` 模組

### Workflow -> Called Skills

| Workflow | 主要調用 Skills | 說明 |
|---|---|---|
| `/workflow-spec-create` | `concise-planning` + `planning-with-files`, `architecture`, `architecture-decision-records`, `product-manager-toolkit`, `api-design-principles` | 新建規格、驗收與任務拆解 |
| `/workflow-spec-update` | `planning-with-files` + `concise-planning`, `writing-plans`, `architecture`, `architecture-decision-records`, `ask-questions-if-underspecified` | 依變更或阻塞更新規格與任務 |

### Skills 依賴關係（Skill -> Skill）

| Skill | 類型 | 用途 | 依賴 Skills |
|---|---|---|---|
| `concise-planning` | 總控 | 釐清需求與產出規劃 | 無顯式依賴 |
| `planning-with-files` | 總控 | 追蹤規格與管理變更 | 無顯式依賴 |
| `brainstorming` | 子 Skill | 發散需求與收斂方案 | - |
| `architecture` | 子 Skill | 設計分層與定義邊界 | - |
| `architecture-decision-records` | 子 Skill | 記錄決策與追蹤演進 | - |
| `senior-architect` | 子 Skill | 權衡方案與決策架構 | - |
| `product-manager-toolkit` | 子 Skill | 規劃MVP與排序優先級 | - |
| `api-design-principles` | 子 Skill | 設計契約與管理演進 | - |
| `writing-plans` | 子 Skill | 撰寫計畫與拆解任務 | - |
| `ask-questions-if-underspecified` | 子 Skill | 補齊資訊與確認規格 | - |

---

## `dev-dotnet` 模組

### Workflow -> Called Skills

| Workflow | 主要調用 Skills | 說明 |
|---|---|---|
| `/workflow-dotnet-validation` | `development` + `dotnet-architect`, `api-design-principles`, `database-design`, `dotnet-backend-patterns` | 驗證規格可實作性與缺漏 |
| `/workflow-dotnet-implement` | `development` + `dotnet-backend`, `dotnet-backend-patterns`, `clean-code`, `lint-and-validate` | 依規格進行 .NET 實作 |

### Skills 依賴關係（Skill -> Skill）

| Skill | 類型 | 用途 | 依賴 Skills |
|---|---|---|---|
| `development` | 總控 | 串接流程與推進交付 | `app-builder`, `senior-fullstack`, `environment-setup-guide`, `concise-planning`, `frontend-developer`, `frontend-design`, `react-patterns`, `typescript-pro`, `tailwind-patterns`, `nextjs-app-router-patterns`, `backend-architect`, `backend-dev-guidelines`, `nodejs-backend-patterns`, `fastapi-pro`, `api-design-principles`, `auth-implementation-patterns`, `database-architect`, `database-design`, `prisma-expert`, `postgresql`, `neon-postgres`, `test-driven-development`, `javascript-testing-patterns`, `python-testing-patterns`, `e2e-testing-patterns`, `playwright-skill`, `code-reviewer`, `clean-code`, `lint-and-validate`, `security-scanning-security-sast`, `deployment-engineer`, `docker-expert`, `vercel-deployment`, `github-actions-templates`, `cicd-automation-workflow-automate` |
| `dotnet-architect` | 子 Skill | 設計架構與劃分分層 | - |
| `dotnet-backend` | 子 Skill | 實作API與交付服務 | - |
| `dotnet-backend-patterns` | 子 Skill | 套用模式與提升品質 | - |
| `csharp-pro` | 子 Skill | 優化語法與強化型別 | - |
| `sql-pro` | 子 Skill | 優化查詢與調校效能 | - |
| `database-design` | 子 Skill | 設計模型與規劃索引 | - |
| `api-design-principles` | 子 Skill | 定義契約與維持一致 | - |
| `clean-code` | 子 Skill | 改善可讀與降低複雜 | - |

---

## `dev-python` 模組

### Workflow -> Called Skills

| Workflow | 主要調用 Skills | 說明 |
|---|---|---|
| `/workflow-python-validation` | `python-fastapi-development` + `api-design-principles`, `database-design` | 驗證規格可實作性與缺漏 |
| `/workflow-python-implement` | `python-fastapi-development` + `python-pro`, `python-patterns`, `async-python-patterns`, `python-performance-optimization`, `sql-pro`, `clean-code` | 依規格進行 Python/FastAPI 實作 |

### Skills 依賴關係（Skill -> Skill）

| Skill | 類型 | 用途 | 依賴 Skills |
|---|---|---|---|
| `python-fastapi-development` | 總控 | 串接流程與推進交付 | `app-builder`, `python-development-python-scaffold`, `fastapi-templates`, `uv-package-manager`, `prisma-expert`, `database-design`, `postgresql`, `pydantic-models-py`, `fastapi-router-py`, `api-design-principles`, `api-patterns`, `auth-implementation-patterns`, `api-security-best-practices`, `fastapi-pro`, `error-handling-patterns`, `python-testing-patterns`, `api-testing-observability-api-mock`, `api-documenter`, `openapi-spec-generation`, `deployment-engineer`, `docker-expert` |
| `python-pro` | 子 Skill | 強化語法與落地實務 | - |
| `python-patterns` | 子 Skill | 套用模式與整理結構 | - |
| `async-python-patterns` | 子 Skill | 設計並發與管理非同步 | - |
| `python-performance-optimization` | 子 Skill | 分析瓶頸與優化效能 | - |
| `clean-code` | 子 Skill | 改善可讀與降低複雜 | - |
| `sql-pro` | 子 Skill | 優化查詢與調校資料庫 | - |

---

## `testing` 模組

### Workflow -> Called Skills

| Workflow | 主要調用 Skills | 說明 |
|---|---|---|
| `/workflow-testing-plan` | `testing-qa` + `test-driven-development`, `python-testing-patterns`, `javascript-testing-patterns`, `api-testing-observability-api-mock` | 產出測試策略與測試案例 |
| `/workflow-testing-script-generate` | `e2e-testing` + `playwright-skill`, `e2e-testing-patterns`, `browser-automation`, `ui-visual-validator` | 產生自動化測試腳本 |
| `/workflow-testing-execute` | `testing-qa` + `e2e-testing`, `webapp-testing`, `performance-profiling`, `find-bugs`, `verification-before-completion` | 執行測試並產生測試報告 |

### Skills 依賴關係（Skill -> Skill）

| Skill | 類型 | 用途 | 依賴 Skills |
|---|---|---|---|
| `testing-qa` | 總控 | 串接測試與把關品質 | `test-automator`, `test-driven-development`, `javascript-testing-patterns`, `python-testing-patterns`, `unit-testing-test-generate`, `tdd-orchestrator`, `api-testing-observability-api-mock`, `e2e-testing-patterns`, `playwright-skill`, `webapp-testing`, `browser-automation`, `screenshots`, `performance-engineer`, `performance-profiling`, `web-performance-optimization`, `code-reviewer`, `code-review-excellence`, `find-bugs`, `security-scanning-security-sast`, `lint-and-validate`, `verification-before-completion` |
| `e2e-testing` | 總控 | 產生腳本與串接CI | `playwright-skill`, `e2e-testing-patterns`, `test-automator`, `webapp-testing`, `browser-automation`, `ui-visual-validator`, `github-actions-templates`, `cicd-automation-workflow-automate` |
| `debugging-strategies` | 子 Skill | 分析根因與制定路徑 | - |
| `systematic-debugging` | 子 Skill | 定位問題與驗證修復 | - |
| `test-fixing` | 子 Skill | 修復測試與穩定結果 | - |
| `code-review-checklist` | 子 Skill | 檢查品質與確認交付 | - |

---

## `deployment` 模組

### Workflow -> Called Skills

| Workflow | 主要調用 Skills | 說明 |
|---|---|---|
| `/workflow-deploy-readiness` | `deployment-engineer` + `deployment-validation-config-validate`, `secrets-management`, `observability-engineer` | 上線前檢查與風險盤點 |
| `/workflow-deploy-package-docker` | `deployment-engineer` + `docker-expert`, `environment-setup-guide` | 建立可部署 Docker 產物 |
| `/workflow-deploy-manual` | `deployment-engineer` + `deployment-procedures`, `incident-runbook-templates` | 手動部署、驗證與回滾演練 |
| `/workflow-deploy-cicd` | `cloud-devops` + `deployment-pipeline-design`, `github-actions-templates`, `gitlab-ci-patterns`, `cicd-automation-workflow-automate` | 建立或調整 CI/CD 與部署 Gate |
| `/workflow-deploy-plan` | `cloud-devops` + `deployment-pipeline-design`, `cloud-architect`, `observability-engineer` | 制定部署步驟、回滾與監控策略 |
| `/workflow-deploy-execute` | `cloud-devops` + `deployment-engineer`, `incident-responder`, `observability-engineer` | 執行部署與上線後驗證 |

### Skills 依賴關係（Skill -> Skill）

| Skill | 類型 | 用途 | 依賴 Skills |
|---|---|---|---|
| `cloud-devops` | 總控 | 串接平台與推進上線 | `cloud-architect`, `aws-skills`, `azure-functions`, `gcp-cloud-run`, `terraform-skill`, `terraform-specialist`, `kubernetes-architect`, `docker-expert`, `helm-chart-scaffolding`, `k8s-manifest-generator`, `k8s-security-policies`, `deployment-engineer`, `cicd-automation-workflow-automate`, `github-actions-templates`, `gitlab-ci-patterns`, `deployment-pipeline-design`, `observability-engineer`, `grafana-dashboards`, `prometheus-configuration`, `datadog-automation`, `sentry-automation`, `cloud-penetration-testing`, `aws-penetration-testing`, `secrets-management`, `mtls-configuration`, `cost-optimization`, `database-cloud-optimization-cost-optimize`, `incident-responder`, `incident-runbook-templates`, `postmortem-writing` |
| `deployment-engineer` | 子 Skill | 規劃部署與控管風險 | - |
| `cloud-architect` | 子 Skill | 設計雲端與確保可靠 | - |
| `deployment-pipeline-design` | 子 Skill | 設計管線與定義Gate | - |
| `deployment-procedures` | 子 Skill | 執行手動部署與回滾 | - |
| `deployment-validation-config-validate` | 子 Skill | 驗證配置與比對環境 | - |
| `secrets-management` | 子 Skill | 管理機密與控管存取 | - |
| `observability-engineer` | 子 Skill | 建置監控與設計告警 | - |
| `incident-responder` | 子 Skill | 分級事故與推進復原 | - |
| `incident-runbook-templates` | 子 Skill | 撰寫Runbook與支援演練 | - |
| `cicd-automation-workflow-automate` | 子 Skill | 自動化流程與落地管線 | - |
| `github-actions-templates` | 子 Skill | 套用模板與建立工作流 | - |
| `gitlab-ci-patterns` | 子 Skill | 套用模式與配置管線 | - |
| `git-advanced-workflows` | 子 Skill | 管理分支與追溯變更 | - |
| `docker-expert` | 子 Skill | 建置映像與強化安全 | - |
| `environment-setup-guide` | 子 Skill | 建立環境與維持一致 | - |

---

## 必要補充說明

- Workflow 的 `<...>` 參數對應 command 模板中的 `$ARGUMENTS`。
- 跨模組交接建議：`planning` -> `dev-dotnet/dev-python` -> `testing` -> `deployment`。
- 若 `dev-*` 實作中遇到規格阻塞，先更新 `[SPEC]CHANGE-REQUEST.md`，再切回 `planning` 執行 `/workflow-spec-update`。
