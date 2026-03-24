---
description: E2E 子流程：產出測試規劃文件（PLAN/CASES/AC/INPUT-GAP）
---

目標：

- 根據 `InputSnapshot`、`SpecBaseline`、`ObservedBehaviorBaseline` 產出測試文件。

路徑規則唯一來源：`testing-e2e/commands/rule-testing-e2e-path.md`

讀取輸入：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
2. `--artifact-dir/workflow-handoff/[WORKFLOW]SPEC-BASELINE.md`
3. `--artifact-dir/workflow-handoff/[WORKFLOW]SITE-BASELINE.md`
4. `--artifact-dir/workflow-handoff/[WORKFLOW]SRC-SUPPLEMENT.md`（條件式）

寫出檔案：

1. `--artifact-dir/workflow-deliverables/TEST-PLAN.md`
2. `--artifact-dir/workflow-deliverables/TEST-CASES.md`
3. `--artifact-dir/workflow-deliverables/ACCEPTANCE-CRITERIA.md`（條件式）
4. `--artifact-dir/workflow-deliverables/INPUT-GAP.md`（條件式）
5. `--artifact-dir/workflow-deliverables/.env.playwright.template`（條件式：`requiresSecrets=true` 且 `--secrets-file` 不存在）

規範：

1. 產出 `TEST-PLAN.md`、`TEST-CASES.md`
2. 若原始 AC 缺失，產出 `ACCEPTANCE-CRITERIA.md`（`Status: Inferred`）
3. 規格與站台不一致時，產出 `INPUT-GAP.md`
4. 每個案例必須包含 `AutomationTarget` 與 AC/TASK trace
5. 導頁案例必須包含 `NavigationType` + URL + 目標頁關鍵元素驗證點
6. 若 `SPEC/SITE` 判定 `requiresSecrets=true`，需在文件中標註需使用環境變數登入，禁止明文帳密
7. 若 `requiresSecrets=true` 且 `--secrets-file` 不存在，需產生 `.env` 樣板（至少含 `PLAYWRIGHT_BASE_URL`、`PW_LOGIN_EMAIL`、`PW_LOGIN_PASSWORD`）並提醒使用者填值
8. `.env.playwright.template` 的建立責任僅屬於本子流程；其他子流程僅可讀取/引用，不得重複建立

輸出：

- 必須寫入 `workflow-deliverables/` 下的文件（依「寫出檔案」清單）
- 不得只輸出摘要；檔案內容需可追溯到 AC/TASK 與 NavigationType 驗證點
- 若產生 `.env` 樣板，僅可包含鍵名與註解，不得出現敏感真值
