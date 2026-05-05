# MockStrategy Output Example

## 輸入情境
- Target: `src/components/LoginForm.tsx`
- Stack: `React + TypeScript`
- External Dependencies:
  - `fetch` login API
  - `localStorage` remember-me state
  - `window.location.assign` 成功登入後跳轉

## 預期 `MockStrategy.md` 重點

### 範圍
- In Scope: `LoginForm` 的三個外部依賴（fetch API、localStorage、window.location）
- Out of Scope: 非網路層的 UI 互動（按鈕樣式、輸入欄位 focus 行為）

### 外部依賴盤點
| Dependency | Type | Why Mock | Strategy | Notes |
| --- | --- | --- | --- | --- |
| `fetch(/api/login)` | API | 避免打真實 API、控制成功/失敗情境 | full mock | 需覆蓋 200、401、500 |
| `localStorage` | Browser API | 驗證 remember-me 行為 | stub | 需驗證 get/set/remove |
| `window.location.assign` | Browser API | 避免真實跳轉 | spy/stub | 驗證是否被呼叫 |

### 網路層策略
- Success response strategy: 回傳 `{ token, user }`
- Error response strategy: 至少覆蓋 `401` 與 `500`
- Timeout / retry strategy: 若元件內未實作 retry，可標記 `not_applicable`

### 瀏覽器能力策略
- `localStorage`: 使用 in-memory stub
- `location/history`: 使用 spy 驗證跳轉行為

### 第三方套件 / SDK 策略
- 此範例無第三方 SDK，標記 `not_applicable`

### 風險與限制
- 若專案包裝了自訂 API client，需改 mock client 層而非直接 mock `fetch`
- 若登入成功後有 analytics side effect，需額外列入 mock 範圍
