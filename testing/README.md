# Testing Workflows 使用說明

本文件說明 `.opencode/commands/` 內三條測試路線的使用方式、執行順序與範例：

- `vitest`：單元/元件測試
- `playwright`：E2E 測試
- `chromedevtools`：瀏覽器自動化測試（Chrome DevTools 路線）

## 1) 共同執行順序

每條路線皆使用相同三階段：

1. `plan`：產生測試規劃與案例
2. `genscript`：依案例產生腳本
3. `execute`：執行腳本並產出報告

建議固定流程：

```bash
/workflow-testing-plan-<target> <scope>
/workflow-testing-genscript-<target> <scope> [options]
/workflow-testing-execute-<target> <scope> [options]
```

或使用一鍵總流程：

```bash
/workflow-testing-<target> <scope> [options]
```

一鍵總流程說明：

- 使用者只需呼叫一次 `/workflow-testing-<target>`
- 總流程會先做補件與參數確認，再自動推進 `plan -> genscript -> execute`
- 若缺件或阻塞，會停在當前階段並回報 `NextAction`，不會盲目往下執行

`<target>` 可為：`vitest`、`playwright`、`chromedevtools`。

## 2) 輸入文件規則（含容錯）

- 優先讀取：`SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`TASKS.md`
- 若文件不存在，可僅提供 `src` 範圍，流程會改為靜態分析推導
- 若缺追溯資訊，會使用 `INFERRED-AC-*`、`INFERRED-TASK-*`
- 文件缺失時，會額外輸出 `INPUT-GAP.md`
- 各 target 預設輸出到獨立目錄：`testing-artifacts/vitest`、`testing-artifacts/playwright`、`testing-artifacts/chromedevtools`

## 3) 各路線指令與用途

### A. Vitest 路線

- `workflow-testing-plan-vitest`
- `workflow-testing-genscript-vitest`
- `workflow-testing-execute-vitest`
- `workflow-testing-vitest`（總流程，一次串接 plan -> genscript -> execute）

用途：前端單元/元件測試（邏輯、表單驗證、錯誤處理、邊界條件）。

### B. Playwright 路線

- `workflow-testing-plan-playwright`
- `workflow-testing-genscript-playwright`
- `workflow-testing-execute-playwright`
- `workflow-testing-playwright`（總流程，一次串接 plan -> genscript -> execute）

用途：端對端關鍵流程（登入、導頁、主要操作路徑）。

### C. Chrome DevTools 路線

- `workflow-testing-plan-chromedevtools`
- `workflow-testing-genscript-chromedevtools`
- `workflow-testing-execute-chromedevtools`
- `workflow-testing-chromedevtools`（總流程，一次串接 plan -> genscript -> execute）

用途：以 Chrome DevTools 自動化能力做瀏覽器互動驗證。

## 5) 實際範例

### 範例 1：Vitest 測 Login 頁面

```bash
/workflow-testing-plan-vitest src/pages/Authentication/LoginPage.vue
/workflow-testing-genscript-vitest src/pages/Authentication/LoginPage.vue --src-path src/pages/Authentication --test-path testscripts/vitest --artifact-dir testing-artifacts/vitest
/workflow-testing-execute-vitest src/pages/Authentication/LoginPage.vue --test-path testscripts/vitest --artifact-dir testing-artifacts/vitest
```

### 範例 1-1：Vitest 一鍵總流程

```bash
/workflow-testing-vitest src/pages/Authentication/LoginPage.vue --src-path src/pages/Authentication --test-path testscripts/vitest --artifact-dir testing-artifacts/vitest
```

### 範例 2：Playwright 測登入路由

```bash
/workflow-testing-plan-playwright /auth/login
/workflow-testing-genscript-playwright /auth/login --src-path src --test-path testscripts/playwright --artifact-dir testing-artifacts/playwright
/workflow-testing-execute-playwright /auth/login --test-path testscripts/playwright --artifact-dir testing-artifacts/playwright
```

### 範例 2-1：Playwright 一鍵總流程

```bash
/workflow-testing-playwright /auth/login --site-url https://staging.example.com --test-path testscripts/playwright --artifact-dir testing-artifacts/playwright
```

### 範例 3：Chrome DevTools 測指定範圍

```bash
/workflow-testing-plan-chromedevtools src/pages/Dashboard
/workflow-testing-genscript-chromedevtools src/pages/Dashboard --src-path src/pages/Dashboard --test-path testscripts/chrome-devtools --artifact-dir testing-artifacts/chromedevtools
/workflow-testing-execute-chromedevtools src/pages/Dashboard --test-path testscripts/chrome-devtools --artifact-dir testing-artifacts/chromedevtools
```

### 範例 3-1：Chrome DevTools 一鍵總流程

```bash
/workflow-testing-chromedevtools src/pages/Dashboard --site-url https://staging.example.com --src-path src/pages/Dashboard --test-path testscripts/chrome-devtools --artifact-dir testing-artifacts/chromedevtools
```

## 6) 主要輸出產物

規劃與執行過程會產出：

- `TEST-PLAN.md`
- `TEST-CASES.md`
- `ACCEPTANCE-CRITERIA.md`（條件式）
- `TEST-SCRIPT-REPORT.md`
- `TEST-REPORT.md`
- `INPUT-GAP.md`（條件式）
- `[TEST]BLOCKERS.md`（條件式）

預設檔案位置（依 target 分流）：

- `testing-artifacts/vitest/`
- `testing-artifacts/playwright/`
- `testing-artifacts/chromedevtools/`

模板位置：

- `.opencode/templates/TEST-PLAN.template.md`
- `.opencode/templates/TEST-CASES.template.md`
- `.opencode/templates/ACCEPTANCE-CRITERIA.template.md`
- `.opencode/templates/INPUT-GAP.template.md`
- `.opencode/templates/TEST-SCRIPT-REPORT.template.md`
- `.opencode/templates/TEST-REPORT.template.md`

## 7) 一致性快照（plan -> genscript -> execute）

### A. Vitest

- Plan 主要輸出：`testing-artifacts/vitest/TEST-PLAN.md`、`testing-artifacts/vitest/TEST-CASES.md`、`testing-artifacts/vitest/ACCEPTANCE-CRITERIA.md`（條件式）、`testing-artifacts/vitest/INPUT-GAP.md`（條件式）
- genscript 必要輸入：`testing-artifacts/vitest/TEST-PLAN.md`、`testing-artifacts/vitest/TEST-CASES.md`、`testing-artifacts/vitest/ACCEPTANCE-CRITERIA.md`
- genscript 主要輸出：Vitest 腳本（預設 `testscripts/vitest/`）、`testing-artifacts/vitest/TEST-SCRIPT-REPORT.md`
- Execute 前置檢查（Fail-fast）：`TEST-PLAN.md` / `TEST-CASES.md` / `ACCEPTANCE-CRITERIA.md` 缺失即停止
- Execute 主要輸出：`testing-artifacts/vitest/TEST-REPORT.md`、`testing-artifacts/vitest/[TEST]BLOCKERS.md`（條件式）

### B. Playwright

- Plan 主要輸出：`testing-artifacts/playwright/TEST-PLAN.md`、`testing-artifacts/playwright/TEST-CASES.md`、`testing-artifacts/playwright/ACCEPTANCE-CRITERIA.md`（條件式）、`testing-artifacts/playwright/INPUT-GAP.md`（條件式）
- genscript 必要輸入：`testing-artifacts/playwright/TEST-PLAN.md`、`testing-artifacts/playwright/TEST-CASES.md`、`testing-artifacts/playwright/ACCEPTANCE-CRITERIA.md`
- genscript 主要輸出：Playwright 腳本（預設 `testscripts/playwright/`）、`testing-artifacts/playwright/TEST-SCRIPT-REPORT.md`
- Execute 前置檢查（Fail-fast）：`TEST-PLAN.md` / `TEST-CASES.md` / `ACCEPTANCE-CRITERIA.md` 缺失即停止
- Execute 主要輸出：`testing-artifacts/playwright/TEST-REPORT.md`、`testing-artifacts/playwright/[TEST]BLOCKERS.md`（條件式）

### C. Chrome DevTools

- Plan 主要輸出：`testing-artifacts/chromedevtools/TEST-PLAN.md`、`testing-artifacts/chromedevtools/TEST-CASES.md`、`testing-artifacts/chromedevtools/ACCEPTANCE-CRITERIA.md`（條件式）、`testing-artifacts/chromedevtools/INPUT-GAP.md`（條件式）
- genscript 必要輸入：`testing-artifacts/chromedevtools/TEST-PLAN.md`、`testing-artifacts/chromedevtools/TEST-CASES.md`、`testing-artifacts/chromedevtools/ACCEPTANCE-CRITERIA.md`
- genscript 主要輸出：Chrome DevTools 腳本（預設 `testscripts/chrome-devtools/`）、`testing-artifacts/chromedevtools/TEST-SCRIPT-REPORT.md`
- Execute 前置檢查（Fail-fast）：`TEST-PLAN.md` / `TEST-CASES.md` / `ACCEPTANCE-CRITERIA.md` 缺失即停止
- Execute 主要輸出：`testing-artifacts/chromedevtools/TEST-REPORT.md`、`testing-artifacts/chromedevtools/[TEST]BLOCKERS.md`（條件式）

## 9) 一鍵總流程產物

- `workflow-testing-vitest`：`testing-artifacts/vitest/WORKFLOW-RUN-REPORT.md`
- `workflow-testing-playwright`：`testing-artifacts/playwright/WORKFLOW-RUN-REPORT.md`
- `workflow-testing-chromedevtools`：`testing-artifacts/chromedevtools/WORKFLOW-RUN-REPORT.md`
- 建議固定欄位：`WorkflowType`、`CurrentState`、`FinalStatus`、`InputSnapshot`、`StageResults`、`BlockerType`、`NextAction`

## 8) Artifact 目錄慣例

- 三條路線預設使用分流目錄，避免互相覆蓋：`testing-artifacts/<target>/`
- 可用 `--artifact-dir <path>` 覆寫，但同一批次的 `plan`、`genscript`、`execute` 必須使用同一路徑
- 目錄策略、覆蓋/保留與清理建議請參考：`.opencode/README_TESTING_ARTIFACTS.md`
