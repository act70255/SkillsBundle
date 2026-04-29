# Step 7 - 產出測試腳本與測試資產

## Scope
只處理 Step 7。

## Process
1. 讀取 `TestPlan.md` 與 `TestCases.md`
2. 依策略產出測試腳本、setup、mock、fixture
3. 盤點測試資產並寫入 `TestAssetManifest.md`
4. 執行生成品質檢核並寫入 `GenerationReview.md`
5. 於 `RunReport.md` 記錄 `Generation Review Status = generated`
6. 若腳本品質通過，設定 `Script Generation Gate = passed`
7. 若腳本品質未通過，設定 `Script Generation Gate = failed`，並將 `Status = IN_PROGRESS`，同時在 `備註` 記錄待修正的生成問題
8. 刷新 `Last Updated`
9. 成功完成時，勾選 Step 7 檢查清單並將 `Current Step` 更新為下一個合法步驟，且 `Status = IN_PROGRESS`；若未通過，`Current Step` 維持在 Step 7
10. 更新 `RunReport.md`

## Exit criteria
- 測試資產盤點完整
- 主要腳本已生成
- 品質檢核已記錄，未通過時不得進 Step 8

## Skill-local resources
- Templates: `<skill_root>/templates/{TestAssetManifest,GenerationReview}.template.md`
- Reference: `<skill_root>/references/output-contract.md`
