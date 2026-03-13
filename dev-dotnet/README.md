# Dev .NET Workflow 使用說明

本文件說明 `dev-dotnet/commands/` 兩個 slash command 的定位、執行順序、使用情境與調用案例。

## 快速選擇

- 還不確定規格是否可實作，或懷疑文件有缺漏/衝突：使用 `/workflow-dotnet-validation`
- 規格已確認可執行，準備開始開發與測試：使用 `/workflow-dotnet-implement`

## 建議執行流程（Workflow）

參考共用規範：`workflow-dev-general-loop.md`

```text
1) /workflow-dotnet-validation <範圍或功能描述>
2) 若結果為 NEEDS_UPDATE -> 先送出 [SPEC]CHANGE-REQUEST.md，改走 planning 的 /workflow-spec-update
3) planning 更新完成後 -> 回到 /workflow-dotnet-validation 進行 re-validation
4) 重複 2)~3) 直到 PASS
5) PASS 後才進入 /workflow-dotnet-implement <TASK 範圍>
```

## 1) `workflow-dotnet-validation`

### 使用情境
- 接手既有專案時，先確認 `SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`ARCHITECTURE.md`、`TASKS.md` 一致。
- 需求剛被調整，想先評估是否會影響 API、資料模型、驗收可測性。
- 不希望工程團隊先寫程式才發現規格不可落地。

### 主要行為
- 以規格文件為唯一依據，檢查可追溯性（FR/NFR/CR -> TASK -> AC）。
- 遇到缺漏或衝突時，停止實作並輸出交接文件。
- 不直接修改 planning 文件，所有規格變更都需透過 planning bundle 的 `/workflow-spec-update`。
- 每輪輸出需包含 `Next Action` 與 `Re-Validation Scope`，確保可直接進入下一輪。

### 主要輸出
- `[SPEC]CHANGE-REQUEST.md`（唯一輸出）
  - 結論：`PASS` 或 `NEEDS_UPDATE`
  - 缺漏/衝突清單、建議修正、影響範圍、Blockers

### 調用案例
```text
/workflow-dotnet-validation 訂單查詢 API v2（含分頁、排序、狀態過濾）
```

```text
/workflow-dotnet-validation 會員登入流程新增 MFA 與裝置綁定
```

## 2) `workflow-dotnet-implement`

### 使用情境
- 規格已通過驗證（或已更新完成），要開始依 `TASKS.md` 實作功能。
- 需要同時完成程式碼、測試、lint/validate 與驗收覆蓋回填。
- 需要明確知道每項 TASK 的完成狀態與風險。

### 主要行為
- 僅實作可 Trace 的任務，不自行補寫規格。
- 可不帶參數呼叫；未提供範圍時，預設依 `TASKS.md` 自動選取「可執行且有 Trace」任務。
- 若自動選取後範圍仍不明確，改為一次一題與使用者確認，直到關鍵資訊完整（不設固定問答輪數上限）。
- 每完成一項任務就同步驗證測試與驗收條件覆蓋。
- 可更新 `TASKS.md` 的進度欄位，但不可改任務定義。
- 若遇到規格問題，先輸出 `[SPEC]CHANGE-REQUEST.md`，再切到 planning bundle 做更新。

### 主要輸出
- `IMPLEMENTATION-REPORT.md`
  - 變更檔案清單、TASK 完成狀態、測試摘要、AC 覆蓋狀態
- `[DEV]BLOCKERS.md`（條件式）
  - 單一關鍵問題 + 建議預設值

### 調用案例
```text
/workflow-dotnet-implement TASK-12~TASK-18：實作訂單查詢 API 與快取策略
```

```text
/workflow-dotnet-implement 會員模組：登入、JWT 刷新、MFA 驗證流程
```

```text
/workflow-dotnet-implement
```

## 常見決策與建議

- 先驗證再實作：可大幅降低「做到一半才返工」的風險。
- 若 `TASKS.md` 無可執行項或缺 Trace，先補規格，不要硬做。
- 需要改 `SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`ARCHITECTURE.md`、`TASKS.md` 任務定義時，一律走 `/workflow-spec-update`。
- 在命令參數中明確給「模組、API、TASK 範圍、驗收重點」，可減少阻塞與往返溝通。
- 收斂完成判定：必要文件齊全、Trace 完整、AC 可測、跨文件無衝突。
