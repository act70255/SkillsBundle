---
description: 依規格文件實作 Python/FastAPI 功能並回填驗收覆蓋
---

請先主動載入並使用以下 skills（依序）：
`python-fastapi-development, python-patterns, async-python-patterns, clean-code, python-testing-patterns`

目標：
- 依規格文件與 `TASKS.md` 完成 Python/FastAPI 實作，並回報驗收覆蓋與風險。

參數與範圍決策（強制）：
1) 若提供 `$ARGUMENTS`：以 `$ARGUMENTS` 作為本次實作範圍。
2) 若未提供 `$ARGUMENTS`：預設改由 `TASKS.md` 自動選取「可執行且有 Trace」的任務作為範圍。
3) 若範圍仍不明確、候選任務過多或關鍵資訊不足：改為一次只問一個關鍵問題，逐步向使用者確認，直到取得可安全實作的完整資訊。
4) 不使用固定問答輪數上限；僅在資訊完整時進入實作，或在使用者明確暫停/停止時結束確認流程。
5) 若使用者暫停/停止或仍缺關鍵資訊：輸出 `[DEV]BLOCKERS.md`，列出阻塞與建議預設值，不得硬做。

執行規則：
1) 僅實作有 Trace 的任務（需對應 FR/NFR/CR 與 ACCEPTANCE）。
2) 不自行補寫規格；若規格缺漏，先停下並提出一個最關鍵問題。
3) 每完成一項任務，必須同步驗證測試與驗收條件覆蓋。
4) 允許更新 `TASKS.md` 的任務進度（勾選/狀態/完成時間），但不得修改任務定義內容。
5) 規格或任務定義調整一律改走 `/workflow-spec-update`。

Workflow Gate：
1) 規格文件缺失或 `TASKS.md` 無可執行項：停止實作並回報阻塞。
2) 規格衝突或驗收條件不可測：停止實作並輸出 `[DEV]BLOCKERS.md`。

文件治理規範：
- 允許修改：`src` 程式碼、`test` 測試、`IMPLEMENTATION-REPORT.md`、`TASKS.md`（僅進度欄位）。
- 禁止修改：`SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`ARCHITECTURE.md`、`TASKS.md` 的任務定義內容（描述/順序/Trace）。
- 若需更新 planning 文件，必須改走 `/workflow-spec-update`。

跨 Bundle 交接規則：
- 目前你位於 `dev-python` bundle，可能無法直接使用 planning 指令。
- 若實作中發現規格問題，先輸出 `[SPEC]CHANGE-REQUEST.md`（含阻塞、建議調整、受影響 TASK/AC）。
- 再切換到 `planning` bundle 後執行：`/workflow-spec-update <[SPEC]CHANGE-REQUEST.md 重點>`。

請執行：
1) 完成功能與型別註記
2) 補齊單元/整合測試
3) 檢查 lint/type check
4) 回報結果與下一步

請輸出：
1) `IMPLEMENTATION-REPORT.md`
   - 變更檔案清單（含目的）
   - 任務完成狀態（對應 TASK 編號）
   - 測試結果摘要
   - `ACCEPTANCE` 覆蓋狀態摘要（已覆蓋/未覆蓋/阻塞）
2) `[DEV]BLOCKERS.md`（如有阻塞）
   - 單一關鍵問題 + 建議預設值
