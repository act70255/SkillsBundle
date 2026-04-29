# Invocation Examples

## 基本叫用

```text
/auto-fe-unit-test-workflow src/components/Button.tsx
```

適用：單一元件或單一模組為主要測試目標。

```text
/auto-fe-unit-test-workflow src/views/cart/
```

適用：某個功能目錄需要完整 Step 0~9 治理流程。

```text
/auto-fe-unit-test-workflow src/legacy/order-form.js
```

適用：`HTML + JS + jQuery` 或 legacy imperative code。

## 建議補充敘述

```text
/auto-fe-unit-test-workflow src/components/LoginForm.tsx
目標是補齊表單驗證、錯誤提示與 API mock 的單元測試。
```

```text
/auto-fe-unit-test-workflow public/js/profile.js
請以 html+js 情境建立 DOM interaction tests，避免連真實 API。
```

## 預期 workflow 行為

1. 初始化或續跑 `RunReport.md`
2. 檢查輸入是否齊全
3. 缺資訊時停在補件，不跳步假設
4. 產出分類、策略、測試計畫、測試腳本與結果報告
