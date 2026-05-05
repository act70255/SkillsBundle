# Known Limitations

## 非目標範圍

1. 不處理完整 `E2E` 流程
2. 不處理跨頁導覽、登入態治理與正式站台驗證
3. 不內建視覺回歸或 snapshot 審美治理
4. 不直接保證第三方 plugin / SDK 可被完全模擬

## 目前限制

1. 跨文件一致性驗證目前採規則式字串檢查
若文件標題、章節名稱或關鍵描述大幅改寫，需同步更新驗證腳本。

2. legacy jQuery 專案仍依賴人工判斷測試切分粒度
特別是 plugin side effects、全域事件綁定與混雜式 imperative code。

3. `ExecutionRaw.log` 需要實作者主動正規化
若測試工具輸出其他格式或多檔原始結果，需要額外整理到標準路徑。

4. `test-report-html/index.html` 與 `coverage-html/index.html` 需要 runner 或額外 reporter 支援
若既有測試工具不支援 HTML 輸出，需補齊 reporter 或轉換流程；否則 Step 8 可能因無法產出必要 HTML 報告而 `BLOCKED`。

5. `MockStrategy.md` 與 `GapReport.md` 的觸發雖已治理化，但仍需執行者依規則正確判斷情境。

6. Step 3 目前沒有獨立的失敗路徑 gate 欄位（若 `Input Validation Status ≠ passed`，Step 3 直接不執行），Step 4 的 entry 驗證依賴 `RunReport.md` 的 `Normalization Status = passed`；若 Step 3 因異常中斷，需手動確認 `Normalization Status` 欄位是否已設定。

7. `TestAssetManifest.md` 目前已驗證主要 section 與表格欄位結構
   但仍未做更細緻的內容級 schema 驗證（例如每列資料是否都有合法值、Case IDs 是否逐筆對應），若未來擴充更嚴格格式要求，需同步升級 verifier。

8. `npm auto-setup` 在受限執行環境中可能無法完成
   若 npm registry 不通、磁碟空間不足、Node.js 版本過低或使用者無安裝權限，Step 1 的自動初始化將失敗並標記 `Test Env Status = blocked`，需要人工修復。詳見 `TROUBLESHOOTING.md` Section 12。

## 使用建議

1. 若專案已存在既有 test runner，優先沿用
2. 若規格或 API contract 缺失，應接受 `BLOCKED`，不要強行推測
3. 若外部依賴複雜，優先補齊 `MockStrategy.md`
