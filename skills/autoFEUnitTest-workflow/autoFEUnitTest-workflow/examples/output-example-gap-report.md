# GapReport Output Example

## 輸入情境
- Target: `src/legacy/order-form.js`
- Stack: `HTML + JS + jQuery`
- Current Problem:
  - 缺少明確需求文件
  - 依賴未提供的 jQuery plugin
  - API response format 不明

## 預期 `GapReport.md` 重點

### 狀態摘要
- Workflow Status: `BLOCKED`
- Blocking Step: `Step 5 - 策略決策`
- Severity: `high`

### 缺口清單
| Gap ID | Category | Description | Impact | Blocking | Suggested Resolution |
| --- | --- | --- | --- | --- | --- |
| GAP-001 | spec | 無需求文件，僅能從現有行為推測表單規則 | 無法安全定義完整測試案例 | yes | 提供驗收規則或 bug 重現步驟 |
| GAP-002 | dependency | `$.fn.orderWizard` plugin 原始碼缺失 | 無法確認初始化與 side effect 行為 | yes | 提供 plugin source 或最小行為說明 |
| GAP-003 | dependency | API response schema 不明 | 無法穩定建立 success/error mocks | yes | 提供 API example 或 contract |

### 已嘗試處理
- 從現有 `order-form.js` 推導 selector 與 submit 流程
- 搜尋 repo 內是否存在 plugin 定義與 API mock 範例
- 以保守策略切分可先測與不可先測範圍

### 需要使用者補充
- jQuery plugin 來源或最小行為說明
- API 回應格式範例
- 表單驗證規則或歷史 bug 描述

### 建議下一步
- 補齊 dependency 與 spec 後回到 Step 2 補件
- 若 plugin 無法取得，先把可獨立測的 pure DOM validation 拆出來
