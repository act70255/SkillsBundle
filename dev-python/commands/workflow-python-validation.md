---
description: 驗證規格並輸出 Python 交接請求
---

請先主動載入並使用以下 skills（依序）：
`python-fastapi-development, python-pro, api-design-principles, database-design, python-patterns`

目標：
- 以既有規格文件為唯一依據，驗證 Python/FastAPI 可實作性，僅產出單一交接文件給 planning 更新規格。

執行規則：
1) 先檢查並對齊以下文件：`SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`ARCHITECTURE.md`、`TASKS.md`。
2) 僅處理可追溯項目（需可對應 FR/NFR/CR 與 TASK 編號）。
3) 發現缺漏或衝突時，不進入實作，改輸出交接修訂需求。
4) 不修改任何 planning 文件；規格變更只能透過 `/workflow-spec-update`。

Workflow Gate：
1) 任一必要文件不存在：停止並輸出缺少文件清單。
2) `TASKS.md` 無可執行項或無 Trace：停止並輸出補件需求。
3) 驗收條件不可測或規格互相衝突：停止並輸出交接修訂需求。

跨 Bundle 交接規則：
- 目前你位於 `dev-python` bundle，可能無法直接使用 planning 指令。
- 若需更新規格，先輸出 `[SPEC]CHANGE-REQUEST.md`（含衝突點、建議修正、影響範圍）。
- 再切換到 `planning` bundle 後執行：`/workflow-spec-update <[SPEC]CHANGE-REQUEST.md 重點>`。

請輸出：
1) `[SPEC]CHANGE-REQUEST.md`（唯一輸出）
   - 結論：`PASS` 或 `NEEDS_UPDATE`
   - 缺漏/衝突清單（對應 FR/NFR/CR、TASK、AC）
   - 建議修正內容（供 `/workflow-spec-update` 直接使用）
   - 影響範圍（模組/API/資料/測試）
   - 阻塞項與單一最關鍵問題（若有）
   - 若為 `PASS`，明確標示「無需更新 planning 文件，可進入 `/workflow-python-implement`」
