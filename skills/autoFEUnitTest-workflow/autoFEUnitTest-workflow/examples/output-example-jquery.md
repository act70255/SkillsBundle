# jQuery Output Example

## 輸入情境
- Target: `src/legacy/order-form.js`
- Stack: `HTML + JS + jQuery`
- Focus: selector、event binding、DOM side effects

## 預期分類摘要
- Stack: `HTML + JS + jQuery`
- Test Targets: `DOM 操作`、`事件互動`、`表單驗證`
- Runtime: `jsdom`
- Dependency Mode: `需部分 mock`

## 預期策略摘要
- Test Runner: `Vitest` 或 `Jest`
- Helper: DOM/event assertions
- Mock Strategy: stub `$.ajax`、mock plugin initialization

## 預期測試案例
- `TC-001`: 文件載入後正確綁定 submit handler
- `TC-002`: 必填欄位缺失時阻止送出並顯示錯誤
- `TC-003`: `$.ajax` 成功後更新成功訊息區塊
- `TC-004`: plugin 未初始化時標記風險或補 mock

## 預期產物重點
- `ClassificationSummary.md` 要明確標示 legacy imperative 結構風險
- `StrategyDecision.md` 要記錄選 `Vitest` 或 `Jest` 的理由
- `FinalReport.md` 要說明未覆蓋 plugin side effects 的殘餘風險
