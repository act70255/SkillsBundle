# Planning Commands Workflow Guide

本文件僅說明 `planning/commands/` 底下兩個 workflow 指令的使用方式。

共用閉環規範：`workflow-dev-general-loop.md`

## 快速選擇

- 還沒有 `SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`TASKS.md`：使用 `/workflow-spec-create`。
- 已有上述文件，但需求要新增/修改/刪除：使用 `/workflow-spec-update`。

## workflow-spec-create

### 使用情境
- 專案剛起始，尚未有完整規劃文件。
- 需求剛提出，需要先釐清範圍、風險與驗收標準。
- 想建立一套可追溯的規格、架構與任務分解基準。

### 功能特色
- 先做需求完整性與衝突檢查，再進入規劃。
- 缺少關鍵資訊時，採「一問一答」模式逐步補齊。
- 一問一答採條件式進行：直到資訊補齊或使用者明確暫停/結束。
- 產出完整規劃文件（如 `SPEC.md`、`ACCEPTANCE-CRITERIA.md`、`ARCHITECTURE.md`、`TASKS.md`）。
- 強制可驗證與可追溯（需求編號、驗證方式、DoD、Trace）。
- 建立規格時必須明確決定 `Tech Stack` 與 `Target Bundle`，供後續 workflow 路由。

### 呼叫範例
```text
/workflow-spec-create 建立一個內部知識庫搜尋 API（含權限控管與審計記錄）
```

```text
/workflow-spec-create 新增訂單查詢服務，需支援分頁、排序、匯出 CSV
```

## workflow-spec-update

### 使用情境
- 已有既存規劃文件，需求發生新增、修改或刪除。
- 想評估變更對架構、API、資料與里程碑的影響。
- 需要在不重做全部文件的前提下，維持文件一致性。

### 功能特色
- 先整理變更摘要與影響範圍，再更新規劃文件。
- 只更新受影響段落，保留既有章節結構。
- 產出變更追蹤文件（如 `CHANGE-REQUEST-SUMMARY.md`、`RISK-UPDATE.md`、`CHANGELOG-SPEC.md`）。
- 若資訊不足，依規則啟動條件式一問一答；若中止或資訊仍不足可輸出 blocker 文件。
- 可直接接收 validation 輸出的 `[SPEC]CHANGE-REQUEST.md` 作為更新輸入。
- 更新完成後需輸出下一步回流驗證指令（re-validation）。

### 呼叫範例
```text
/workflow-spec-update 付款流程新增 Apple Pay，並將退款 SLA 從 3 天改為 1 天
```

```text
/workflow-spec-update 會員模組新增多因子驗證，並調整登入 API 錯誤碼策略
```

```text
/workflow-python-validation 會員登入新增 MFA
-> 輸出 [SPEC]CHANGE-REQUEST.md
-> /workflow-spec-update <CHANGE-REQUEST 重點>
-> /workflow-python-validation <re-validation scope>
```

## 建議

- 新需求且文件尚未建立：優先用 `workflow-spec-create`。
- 已有規格後的任何變更：用 `workflow-spec-update`，避免文件版本漂移。
- 在輸入敘述中明確包含「目標、限制、驗收重點」，可明顯減少追問輪數。
- 若需求易有爭議，先給預設值與例外條件，可降低 blocker 風險。
- 規格建立時先定技術棧，後續依 `workflow-dev-general-loop.md` 路由到對應 validation/implement。
