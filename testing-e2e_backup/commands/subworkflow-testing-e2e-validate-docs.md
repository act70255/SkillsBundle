---
description: E2E 子流程：驗證文件與輸入來源/SITE 是否相符
---

目標：

- 驗證 `TEST-PLAN/TEST-CASES/AC/INPUT-GAP` 是否與輸入來源與站台觀測一致。

路徑規則唯一來源：`testing-e2e/commands/rule-testing-e2e-path.md`

讀取輸入：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
2. `--artifact-dir/workflow-handoff/[WORKFLOW]SPEC-BASELINE.md`
3. `--artifact-dir/workflow-handoff/[WORKFLOW]SITE-BASELINE.md`
4. `--artifact-dir/workflow-handoff/[WORKFLOW]SRC-SUPPLEMENT.md`（條件式）
5. `--artifact-dir/workflow-deliverables/TEST-PLAN.md`
6. `--artifact-dir/workflow-deliverables/TEST-CASES.md`
7. `--artifact-dir/workflow-deliverables/ACCEPTANCE-CRITERIA.md`（條件式）
8. `--artifact-dir/workflow-deliverables/INPUT-GAP.md`（條件式）

寫出檔案（內部交接）：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]DOC-VALIDATION.md`

檢查項：

1. 文件是否完整（必要檔存在）
2. Trace 是否完整（Case -> AC/TASK）
3. P0 導頁案例是否都有 `NavigationType` 與 URL/目標頁元素預期
4. 文件敘述是否違反觀測事實（與 `ObservedBehaviorBaseline` 比對）
5. 若 `SITE-BASELINE.requiresSecrets=true`，文件是否明確標註 secrets 需求與補件狀態（不含任何敏感值）
6. `ACCEPTANCE-CRITERIA.md` 缺失時，需驗證 `TEST-CASES.md` 是否已以 `SPEC-BASELINE.inferredAcIds` 完成可追溯映射；若可追溯則可判定文件完整

輸出：

- 必須寫入 `--artifact-dir/workflow-handoff/[WORKFLOW]DOC-VALIDATION.md`
- 驗證結果與差異清單必須落檔（`result` + `mismatches`）
- 必須填寫 `secretsReadiness`（`not-required | template-created | pending-user-input | ready | blocked`）
