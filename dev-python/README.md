# Dev Python Workflow 使用說明

本文件說明 `dev-python/commands/` 兩個 slash command 的定位、使用方式、執行情境與調用案例。

## 快速選擇

- 尚未確認規格可實作，或懷疑文件有缺漏/衝突：使用 `/workflow-python-validation`
- 規格已可執行，準備開始開發與測試：使用 `/workflow-python-implement`

## 建議執行流程（Workflow）

參考共用規範：`workflow-dev-general-loop.md`

```text
1) /workflow-python-validation <範圍或功能描述>
2) 若結果為 NEEDS_UPDATE -> 先輸出 [SPEC]CHANGE-REQUEST.md，改走 planning 的 /workflow-spec-update
3) planning 更新完成後 -> 回到 /workflow-python-validation 進行 re-validation
4) 重複 2)~3) 直到 PASS
5) PASS 後才進入 /workflow-python-implement <TASK 範圍>
```

## 1) `workflow-python-validation`

### 使用情境
- 接手既有 Python/FastAPI 專案時，先確認規格文件的一致性與可追溯性。
- 需求剛變更，想先評估對 API、資料模型、驗收可測性的影響。
- 避免先進入實作才發現規格不可落地。

### 參數說明
- 可帶參數：聚焦特定模組或功能範圍，例如「會員登入流程」或「訂單查詢 API」。
- 不帶參數：預設進行全域驗證，掃描目前工作目錄中的規格文件並檢查整體可實作性。

### 主要行為
- 以 `SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`ARCHITECTURE.md`、`TASKS.md` 為唯一依據。
- 僅處理可追溯項目（FR/NFR/CR -> TASK -> AC）。
- 發現缺漏或衝突時，停止實作並產出交接修訂需求。
- 不直接修改 planning 文件；規格更新統一改走 `/workflow-spec-update`。
- 每輪輸出需包含 `Next Action` 與 `Re-Validation Scope`，確保可直接進入下一輪。

### 主要輸出
- `[SPEC]CHANGE-REQUEST.md`（唯一輸出）
  - 結論：`PASS` 或 `NEEDS_UPDATE`
  - 缺漏/衝突清單、建議修正、影響範圍、阻塞項

### 調用案例
```text
/workflow-python-validation 訂單查詢 API v2（分頁、排序、狀態過濾）
```

```text
/workflow-python-validation 會員登入流程新增 MFA 與裝置綁定
```

```text
/workflow-python-validation
```

## 2) `workflow-python-implement`

### 使用情境
- 規格已通過驗證（或更新完成），要開始依 `TASKS.md` 進入 Python/FastAPI 實作。
- 需要同步完成功能、型別註記、測試、lint/type check 與驗收覆蓋。
- 需要對每個 TASK 的完成狀態與風險做可交接回報。

### 主要行為
- 僅實作有 Trace 的任務，不自行補寫規格。
- 可不帶參數呼叫；未提供範圍時，預設依 `TASKS.md` 自動選取「可執行且有 Trace」任務。
- 若自動選取後範圍仍不明確，改為一次一題與使用者確認，直到關鍵資訊完整（不設固定問答輪數上限）。
- 每完成一項任務就同步驗證測試與驗收條件覆蓋。
- 可更新 `TASKS.md` 進度欄位，但不可修改任務定義。
- 若實作中發現規格問題，先輸出 `[SPEC]CHANGE-REQUEST.md`，再切換到 planning bundle 使用 `/workflow-spec-update`。

### 主要輸出
- `IMPLEMENTATION-REPORT.md`
  - 變更檔案清單、TASK 完成狀態、測試摘要、AC 覆蓋狀態
- `[DEV]BLOCKERS.md`（條件式）
  - 單一關鍵問題 + 建議預設值

### 調用案例
```text
/workflow-python-implement TASK-08~TASK-14：實作訂單查詢 API、快取與錯誤處理
```

```text
/workflow-python-implement 會員模組：登入、JWT 刷新、MFA 驗證流程
```

```text
/workflow-python-implement
```

## 常見決策與建議

- 先 validation 再 implement，可有效降低返工成本。
- 若 `TASKS.md` 沒有可執行項或無 Trace，先補規格再進入實作。
- 需要調整 `SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`ARCHITECTURE.md`、`TASKS.md` 任務定義時，一律走 `/workflow-spec-update`。
- 命令參數盡量寫清楚「模組、API、TASK 範圍、驗收重點」，可顯著減少阻塞與往返溝通。
- 收斂完成判定：必要文件齊全、Trace 完整、AC 可測、跨文件無衝突。
