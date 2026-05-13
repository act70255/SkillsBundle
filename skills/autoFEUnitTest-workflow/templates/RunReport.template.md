# Workflow 執行報告

## 中繼資料
- Status: NEW
- Current Step: Step 0
- Last Updated:
- Workflow Mode: unknown
- Auto Repair Enabled: true
- Auto Repair Max Attempts: 2
- Auto Repair Attempt: 0

## 輸入
- Source Code Path:
- Project Config Path:
- Framework Type:
- Test Targets:
- Behavior Spec Source:
- Node Version:
- Package Manager:

## 驗證
- Input Validation Status: not_checked（合法值：passed / blocked / not_checked；不使用 failed）
- Missing Required Inputs:
- Test Env Status: not_checked（合法值：not_checked / passed / blocked；passed 包含「原本就緒」與「Step 1 自動初始化成功」兩種情境）
- Normalization Status: not_checked（合法值：not_checked / passed）
- Classification Status: not_checked（合法值：not_checked / passed / blocked；Step 4 分類路徑無獨立 failed 狀態）
- Strategy Gate Status: not_checked（合法值：not_checked / passed / blocked；Step 5 策略路徑無獨立 failed 狀態）
- Planning Gate Status: not_checked（合法值：not_checked / passed / blocked / failed）
- Script Generation Gate: not_checked（合法值：not_checked / passed / failed / blocked）
- Execution Gate: not_checked（合法值：not_checked / passed / blocked；不使用 failed）
- Verification DoD Status: not_checked（合法值：not_checked / passed / blocked / failed）

## 證據中繼資料
- App Version / Commit:
- Test Data Identifier(s):
- Coverage Evidence:

## 阻塞問題
- None

## 產物
- Handoff Root: testing-artifact/handoff/
- Deliverables Root: testing-artifact/deliverables/
- Evidence Root: testing-artifact/evidence/
- Scripts Root: testing-artifact/scripts/
- RunReport: testing-artifact/handoff/RunReport.md
- Input Summary: testing-artifact/handoff/InputSummary.md
- Normalized Input: testing-artifact/handoff/NormalizedInput.md
- Classification Summary: testing-artifact/handoff/ClassificationSummary.md
- Strategy Decision: testing-artifact/handoff/StrategyDecision.md
- Mock Strategy: testing-artifact/handoff/MockStrategy.md
- Mock Strategy Status: pending（合法值：pending / generated / not_applicable）
- Gap Report: testing-artifact/handoff/GapReport.md
- Gap Report Status: pending（合法值：pending / generated / not_applicable；缺口解除後此欄位維持 `generated`，不更改；解除狀態記錄於 `GapReport.md` 本身的 `Status: resolved`）
- Generation Review: testing-artifact/handoff/GenerationReview.md
- Generation Review Status: pending（合法值：pending / generated；`GenerationReview.md` 為必要治理產物，不使用 `not_applicable`）
- Execution Raw: testing-artifact/evidence/ExecutionRaw.log
- Execution Raw Status: pending（合法值：pending / generated / not_applicable）
- Test Result HTML Report: testing-artifact/evidence/test-report-html/index.html
- Test Result HTML Report Status: pending（合法值：pending / generated / not_applicable；成功執行 Step 8 時必須為 `generated`，前置條件阻塞時可為 `not_applicable`）
- Coverage HTML Report: testing-artifact/evidence/coverage-html/index.html
- Coverage HTML Report Status: pending（合法值：pending / generated / not_applicable；成功執行 Step 8 時必須為 `generated`，前置條件阻塞時可為 `not_applicable`）
- Test Plan: testing-artifact/deliverables/TestPlan.md
- Test Cases: testing-artifact/deliverables/TestCases.md
- Test Asset Manifest: testing-artifact/deliverables/TestAssetManifest.md
- Execution Summary: testing-artifact/handoff/ExecutionSummary.md
- Coverage Summary: testing-artifact/handoff/CoverageSummary.md
- Final Report: testing-artifact/deliverables/FinalReport.md

## 檢查清單
- [ ] Step 0 - RunReport 初始化/續跑檢查
- [ ] Step 1 - 輸入驗證
- [ ] Step 2 - 缺口補件
- [ ] Step 3 - 輸入正規化
- [ ] Step 4 - 技術與測試目標分類
- [ ] Step 5 - 測試策略決策
- [ ] Step 6 - 產出測試計畫
- [ ] Step 7 - 產出測試腳本與測試資產
- [ ] Step 8 - 執行測試
- [ ] Step 9 - 最終報告與 DONE Gate

## 備註
-

## 下一步
- （依 Current Step 填入下一個待執行步驟，或記錄 BLOCKED 解除條件）
