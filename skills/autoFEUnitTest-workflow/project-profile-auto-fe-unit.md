# Auto FE Unit Test Project Profile

## 目的
定義此技能包的預設輸出位置、常用工具預設與流程內部命名。

## 預設輸出根目錄
- Handoff Root: `testing-artifact/handoff/`
- Deliverables Root: `testing-artifact/deliverables/`
- Evidence Root: `testing-artifact/evidence/`
- Scripts Root: `testing-artifact/scripts/`

## 預設主要產物路徑
- RunReport: `testing-artifact/handoff/RunReport.md`
- Input Summary: `testing-artifact/handoff/InputSummary.md`
- Normalized Input: `testing-artifact/handoff/NormalizedInput.md`
- Classification Summary: `testing-artifact/handoff/ClassificationSummary.md`
- Strategy Decision: `testing-artifact/handoff/StrategyDecision.md`
- Mock Strategy: `testing-artifact/handoff/MockStrategy.md`
- Gap Report: `testing-artifact/handoff/GapReport.md`
- Env Template: `testing-artifact/handoff/EnvTemplate.example`
- Generation Review: `testing-artifact/handoff/GenerationReview.md`
- Execution Raw: `testing-artifact/evidence/ExecutionRaw.log`
- Test Result HTML Report: `testing-artifact/evidence/test-report-html/index.html`
- Coverage HTML Report: `testing-artifact/evidence/coverage-html/index.html`
- Execution Summary: `testing-artifact/handoff/ExecutionSummary.md`
- Coverage Summary: `testing-artifact/handoff/CoverageSummary.md`
- Test Plan: `testing-artifact/deliverables/TestPlan.md`
- Test Cases: `testing-artifact/deliverables/TestCases.md`
- Test Asset Manifest: `testing-artifact/deliverables/TestAssetManifest.md`
- Final Report: `testing-artifact/deliverables/FinalReport.md`

## 技術預設
- `React`: `Vitest + Testing Library + jsdom`
- `Vue`: `Vitest + Vue Test Utils + jsdom`
- `HTML + JS`: `Vitest + jsdom`
- `HTML + JS + jQuery`: `Vitest + jsdom`，必要時退回 `Jest`

## 工作模式
- `unit`
- `component`
- `mixed`

## 補充規則
- 若專案已有既有 test runner，優先沿用
- 若專案依賴特殊瀏覽器能力，需在策略決策中明確記錄
