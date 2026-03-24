---
description: E2E 子流程：以 src-path 做補強分析（非必要、不可取代黑箱）
---

目標：

- 僅在提供 `--src-path` 時，補強黑箱分析在高風險區或疑難案例的定位能力。

路徑規則唯一來源：`testing-e2e/commands/rule-testing-e2e-path.md`

讀取輸入：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]INPUT-SNAPSHOT.md`
2. `--artifact-dir/workflow-handoff/[WORKFLOW]SITE-BASELINE.md`
3. `--src-path`（條件式）

寫出檔案（內部交接）：

1. `--artifact-dir/workflow-handoff/[WORKFLOW]SRC-SUPPLEMENT.md`（條件式）

規範：

1. `src-path` 為選填補充，不可取代 `site-url` 黑箱基線
2. 只可用於補強：
   - 高風險流程定位
   - 可測試性缺口確認（語意標記、test id、可觀測訊號）
   - 疑難案例的斷言點補全
3. 不得以內部私有狀態或實作細節作為通過準則
4. 若 `--src-path` 未提供，必須回報 `skipped`，不得視為失敗

輸出：

- 必須寫入 `--artifact-dir/workflow-handoff/[WORKFLOW]SRC-SUPPLEMENT.md`
- `--src-path` 存在時：`status=written` 並填入補強欄位
- `--src-path` 缺失時：仍需落檔，`status=skipped` 且填 `reason`
