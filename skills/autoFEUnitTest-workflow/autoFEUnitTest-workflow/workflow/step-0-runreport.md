# Step 0 - RunReport 初始化與續跑檢查

## Scope
只處理 Step 0。

## Process
1. 確認 `RunReport.md` 是否存在
2. 若不存在，依模板建立新檔
3. 若存在，檢查 `Status`、`Current Step`、產物路徑、產物狀態欄位與檢查清單
4. 判斷本次為新執行或續跑
5. 將 `Status` 更新為 `IN_PROGRESS`
6. 設定 `Current Step = Step 0`
7. 刷新 `Last Updated`
8. 完成 Step 0 後，勾選 Step 0 檢查清單並將 `Current Step` 更新為下一個合法步驟

## Exit criteria
- `RunReport.md` 已存在且結構完整
- 已記錄本次 workflow 狀態與目前步驟
- 條件式與必要產物狀態欄位存在且可追蹤
- 已決定續跑起點

## Skill-local resources
- Template: `<skill_root>/templates/RunReport.template.md`
- Rules: `<skill_root>/governance.md`
