# Vue Output Example

## 輸入情境
- Target: `src/components/TodoList.vue`
- Stack: `Vue 3 + Vite`
- Focus: props、列表 render、emit event

## 預期分類摘要
- Stack: `Vue`
- Test Targets: `UI 元件`、`事件互動`
- Runtime: `jsdom`
- Dependency Mode: `可完全 mock`

## 預期策略摘要
- Test Runner: `Vitest`
- Helper: `Vue Test Utils`
- Mock Strategy: mock composables、stub child components

## 預期測試案例
- `TC-001`: 傳入 items 後正確渲染列表
- `TC-002`: 點擊完成按鈕時 emit `toggle`
- `TC-003`: 空列表時顯示 placeholder
- `TC-004`: disabled 狀態下不觸發事件

## 預期產物重點
- `ClassificationSummary.md` 要說明 Vue SFC 與事件模型依據
- `TestPlan.md` 要列出 props/emit 為主要覆蓋點
- `CoverageSummary.md` 要標示未覆蓋的邊界情境
- 完整必要產物清單（含 `RunReport.md`、`InputSummary.md`、`NormalizedInput.md`、`ClassificationSummary.md`、`StrategyDecision.md`、`TestPlan.md`、`TestCases.md`、`TestAssetManifest.md`、`GenerationReview.md`、`ExecutionRaw.log`、`test-report-html/index.html`、`coverage-html/index.html`、`ExecutionSummary.md`、`CoverageSummary.md`、`FinalReport.md`）均需產出；詳見 governance.md Section 7
