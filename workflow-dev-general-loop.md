# workflow-dev-general-loop

本文件定義跨 bundle 的通用開發閉環，適用於 `dev-python`、`dev-dotnet` 與 `planning`。

## 目的

- 讓規格驗證與規格更新形成可收斂流程，避免一次性驗證後直接進入實作。
- 讓不同技術棧共用同一套狀態機與交接格式。

## 狀態機（唯一流程）

```text
VALIDATION
  -> PASS -> IMPLEMENT
  -> NEEDS_UPDATE -> SPEC_UPDATE -> RE_VALIDATION -> (PASS | NEEDS_UPDATE)
  -> BLOCKED -> [SPEC]BLOCKERS.md -> 等待關鍵資訊後回到 VALIDATION 或 SPEC_UPDATE
```

## Gate 與停止條件

- 必要文件齊全：`SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`ARCHITECTURE.md`、`TASKS.md`。
- Trace 完整：FR/NFR/CR -> TASK -> AC 可追溯。
- 驗收可測：AC 必須可用手測、自動測試或資料驗證方式驗證。
- 無衝突：跨文件定義不可互相矛盾。

任一 Gate 未通過時，結論不可為 `PASS`。

## 技術棧路由規則

技術棧在 `/workflow-spec-create` 定案；後續依技術棧選擇 validation/implement workflow。

- `Python/FastAPI`
  - Validation: `/workflow-python-validation`
  - Implement: `/workflow-python-implement`
- `.NET`
  - Validation: `/workflow-dotnet-validation`
  - Implement: `/workflow-dotnet-implement`

## 交接輸入/輸出契約

### validation 輸出

- 檔名：`[SPEC]CHANGE-REQUEST.md`
- 必填欄位：
  - `Conclusion`: `PASS` 或 `NEEDS_UPDATE`
  - 缺漏/衝突清單（含 FR/NFR/CR、TASK、AC 對應）
  - 建議修正內容
  - 影響範圍（模組/API/資料/測試）
  - `Next Action`
  - `Re-Validation Scope`

### spec-update 輸出

- 更新規劃文件（`SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`ARCHITECTURE.md`、`TASKS.md`）
- 補充 `NEXT-ACTION.md`，明確指向下一個 re-validation 指令與 scope。

## 實作進入條件

- 只有在最新一輪 validation 結論為 `PASS`，且 `Next Action` 指向 implement 時，才可進入實作。
- 若後續又出現規格變更，必須重啟本閉環，不得沿用舊的 `PASS`。
