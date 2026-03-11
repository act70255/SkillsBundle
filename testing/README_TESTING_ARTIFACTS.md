# testing-artifacts 使用規範

此文件說明測試流程產物目錄 `testing-artifacts/` 的使用方式。

## 目錄結構

- `testing-artifacts/vitest/`
- `testing-artifacts/playwright/`
- `testing-artifacts/chromedevtools/`

每個 target 目錄建議包含：

- `TEST-PLAN.md`
- `TEST-CASES.md`
- `ACCEPTANCE-CRITERIA.md`（條件式）
- `INPUT-GAP.md`（條件式）
- `TEST-SCRIPT-REPORT.md`
- `TEST-REPORT.md`
- `[TEST]BLOCKERS.md`（條件式）

## 產出規則

- `testing-artifacts/` 屬於流程執行後產物；可在第一次執行 slash command 時建立。
- 預設輸出位置為對應 target 子目錄。
- 可透過 `--artifact-dir <path>` 覆寫輸出位置。
- `script-generate` 與 `execute` 必須讀取同一個 `--artifact-dir`，避免前後流程讀到不同版本文件。

## 覆蓋與保留策略

- 同一 target、同一範圍重跑：允許覆蓋既有檔案（以最新規劃/執行結果為準）。
- 不同 target 並行：禁止共用同一個 artifact 目錄。
- 若需保留歷史版本，建議建立批次子目錄，例如：
  - `testing-artifacts/vitest/2026-03-11-login-flow/`
  - `testing-artifacts/playwright/2026-03-11-auth-e2e/`

## 清理建議

- 只清理已過期批次資料，不刪除最新一次成功產物。
- 清理前先確認 `TEST-REPORT.md` 與 `[TEST]BLOCKERS.md` 是否仍需追蹤。
