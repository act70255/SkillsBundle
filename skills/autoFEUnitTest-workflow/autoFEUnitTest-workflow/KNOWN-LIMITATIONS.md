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

4. `MockStrategy.md` 與 `GapReport.md` 的觸發雖已治理化，但仍需執行者依規則正確判斷情境。

## 使用建議

1. 若專案已存在既有 test runner，優先沿用
2. 若規格或 API contract 缺失，應接受 `BLOCKED`，不要強行推測
3. 若外部依賴複雜，優先補齊 `MockStrategy.md`
