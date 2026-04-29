# HTML + JS Output Example

## 輸入情境
- Target: `public/js/profile.js`
- Stack: `HTML + JavaScript`
- Focus: DOM 初始化、事件綁定、資料格式化

## 預期分類摘要
- Stack: `HTML + JS`
- Test Targets: `DOM 操作`、`事件互動`、`工具模組`
- Runtime: `jsdom`
- Dependency Mode: `可完全 mock`

## 預期策略摘要
- Test Runner: `Vitest`
- Helper: DOM assertions
- Mock Strategy: mock `fetch`、`localStorage`

## 預期測試案例
- `TC-001`: 初始化時從 DOM 讀取必要節點
- `TC-002`: 點擊儲存按鈕後呼叫格式化與送出函式
- `TC-003`: `fetch` 失敗時顯示錯誤區塊
- `TC-004`: localStorage 有舊資料時正確回填欄位

## 預期產物重點
- `NormalizedInput.md` 要明確列出 DOM 依賴與 browser APIs
- `StrategyDecision.md` 要說明為何不需要 framework-specific helper
- `ExecutionSummary.md` 要記錄 mock 網路行為與測試命令
