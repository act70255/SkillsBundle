# TEST-PLAN

## 1. 測試目標與範圍

- 變更範圍：
- 不在本次範圍：
- 風險摘要（High/Medium/Low）：

## 2. 可追溯輸入

- SPEC 版本：
- AC 來源：
- TASK 來源：

## 3. 測試分層策略

### 3.1 Unit

- 目標：
- 覆蓋重點：

### 3.2 Integration

- 目標：
- 覆蓋重點：

### 3.3 E2E

- 目標：
- 覆蓋重點：

## 4. 品質閘（G1~G4）

- G1 靜態檢查：
  - Pass 條件：
  - Fail 條件：
- G2 Unit/Integration：
  - Pass 條件：
  - Fail 條件：
- G3 E2E：
  - Pass 條件：
  - Fail 條件：
- G4 非功能 Smoke（效能/安全最小檢查）：
  - Pass 條件：
  - Fail 條件：

## 5. 執行順序

1.
2.
3.

## 6. 自動化目標與腳本策略

- Vitest（`testscripts/vitest/`）：
- Playwright（`testscripts/playwright/`）：
- Chrome DevTools（`testscripts/chrome-devtools/`）：
- Manual：

## 7. 阻塞與交接規則

- 規格阻塞：更新 `[SPEC]CHANGE-REQUEST.md`，切換 planning 執行 `/workflow-spec-update`
- 實作阻塞：回交 `dev-*` 處理後再回歸測試
