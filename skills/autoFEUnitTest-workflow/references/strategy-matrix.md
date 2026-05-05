# Strategy Matrix

## 預設工具矩陣
| Stack | Default Runner | DOM Env | Helper |
| --- | --- | --- | --- |
| React | Vitest | jsdom | Testing Library |
| Vue | Vitest | jsdom | Vue Test Utils |
| HTML + JS | Vitest | jsdom | DOM assertions |
| HTML + JS + jQuery | Vitest or Jest | jsdom | DOM/event assertions |

## 決策規則
1. 已有既有 runner 時優先沿用
2. `Vite` 生態優先考慮 `Vitest`
3. 重度 DOM 依賴優先 `jsdom`
4. legacy jQuery 可採更保守的測試切分
5. 若 env 或外部依賴複雜，需獨立輸出 `MockStrategy.md`

## MockStrategy 觸發條件
符合以下任一條件時，`MockStrategy.md` 為實際必要產物：
1. 兩個以上外部 API / network dependency 需要 mock
2. 存在第三方 SDK、plugin 或 analytics side effect
3. 需要 mock 兩個以上 browser APIs，例如 `localStorage`、`location`、`ResizeObserver`
4. `test_env` 會影響測試行為或 mock 連線目標
5. 需要 partial mock，且 mock 邊界不只單一函式或單一模組
