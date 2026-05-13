# Invocation Examples

## 建議啟動格式

為確保 workflow 完整執行 Step 0~9，建議附加明確指示（scope 可選）：

```text
/auto-fe-unit-test-workflow [optional-scope]，依序執行完整 Step 0~9。
```

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

若需確保完整執行 Step 0~9，可附加執行指示（參見上方「建議啟動格式」）。

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

1. 初始化或續跑 `RunReport.md`（Step 0）
2. 驗證輸入齊全，並先自動偵測 / 初始化測試環境（Step 1）；即使其他 required inputs 缺失，也不得延後 `test_env` auto-setup
3. Step 1 驗證通過後直接進入 Step 3；若驗證不通過，停在 Step 2 補件，補件完成後 Step 2 將 `Input Validation Status` 重設為 `not_checked`，回 Step 1 重跑驗證，通過後再進入 Step 3（Step 2 為條件式步驟；`test_env` 阻塞時僅記錄 `env_blocker`，不走一般一問一答補件）
4. 將輸入正規化為統一資料模型（Step 3）
5. 分類技術棧、框架、外部依賴與風險（Step 4）
6. 決策測試策略與覆蓋範圍（Step 5）
7. 產出測試計畫與測試案例（Step 6）
8. 生成測試腳本與測試資產（Step 7）
9. 執行測試並保留原始執行證據；若前置條件不成立，記錄阻塞狀態並產出阻塞產物後繼續 Step 9（Step 8）
10. 產出最終報告並完成 DONE Gate（Step 9）
11. 結束時先以中文總結結果；若 `test-report-html/index.html` 或 `coverage-html/index.html` 已產出，再主動詢問是否要用網頁檢視測試結果
