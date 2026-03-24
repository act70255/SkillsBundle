---
description: E2E 子流程：分析 SPEC/AC/TASK 並建立追溯基線
---

目標：

- 讀取並對齊 `SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`TASKS.md`（若存在）。
- 建立 AC/TASK 追溯基線，缺件時使用 `INFERRED-AC-*`、`INFERRED-TASK-*`。
- 從規格辨識是否涉及登入/敏感資料，產出 `requiredSecretKeysHint`。

路徑規則唯一來源：`testing-e2e/commands/rule-testing-e2e-path.md`

讀取輸入：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
2. `SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`TASKS.md`（若存在）

寫出檔案（內部交接）：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]SPEC-BASELINE.md`

規範：

1. 不可依賴站台觀測結果覆蓋規格原意，僅可標註差異
2. 若 `ACCEPTANCE-CRITERIA.md` 缺失，需標記待由文件生成階段補齊 inferred AC
3. 明確列出可追溯項目與缺口
4. 需標記 `securitySensitiveFlows`（例如 login、profile-edit、checkout、token exchange）
5. 若流程涉及登入/敏感資料，需輸出 `requiredSecretKeysHint`（僅鍵名，不含值）

輸出：

- 必須寫入 `--artifact-dir/workflow-handoff/[WORKFLOW]SPEC-BASELINE.md`
- 檔案需符合 `rule-testing-e2e-path.md` 的最小欄位契約
- 缺件需體現在 `gaps` 與 inferred 欄位
- `securitySensitiveFlows` 與 `requiredSecretKeysHint` 必須可追溯到對應 AC/TASK
