# Playwright 黑箱測試輸入模板

> 可選：用於 `workflow-testing-plan-playwright` 與 `workflow-testing-genscript-playwright`。

## 必填

- `site_url`: 目標站台 URL(例如 `https://staging.example.com`)

## 建議填寫

- `route_scope`: 需優先覆蓋的路由清單(例如 `/login,/checkout,/orders`)
- `entry_routes`: 主要入口頁(例如 `/login`)
- `p0_flows`: P0 核心流程(例如 `登入->首頁->下單`)
- `assertion_targets`: 每個流程的可觀測驗證點(URL、關鍵文字、關鍵元件)
- `test_data`: 測試資料鍵值(避免放真實機敏資料)
- `accounts`: 測試帳號代稱(密碼請放環境變數，不寫在檔案)
- `exclude_routes`: 本次不測範圍(例如 `/admin`)

## 可選補強

- `page_context_files`: UI 截圖、流程圖、DOM 摘要檔路徑
- `src_path`: 需補強分析的程式碼路徑(可選)

## YAML 範例

```yaml
site_url: https://staging.example.com
route_scope:
  - /login
  - /checkout
entry_routes:
  - /login
p0_flows:
  - id: FLOW-P0-LOGIN
    name: 登入後進入首頁
  - id: FLOW-P0-CHECKOUT
    name: 加入購物車後結帳成功
assertion_targets:
  - flow_id: FLOW-P0-LOGIN
    url: /dashboard
    visible_text:
      - 歡迎回來
  - flow_id: FLOW-P0-CHECKOUT
    url: /order/success
    visible_text:
      - 訂單成立
test_data:
  product_sku: SKU-001
accounts:
  buyer_user: QA_BUYER_USER
exclude_routes:
  - /admin
page_context_files:
  - docs/ui/login.png
  - docs/flows/checkout.md
src_path: src/
```
