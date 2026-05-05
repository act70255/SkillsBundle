import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

const [
  readme,
  skill,
  troubleshooting,
  outputContract,
  inputSchema,
  evidenceContract,
  governance,
  runReportTemplate,
  finalReportTemplate,
  executionSummaryTemplate,
  coverageSummaryTemplate,
  classificationSummaryTemplate,
  strategyDecisionTemplate,
  generationReviewTemplate,
  testAssetManifestTemplate,
  projectProfile,
  step0,
  step1,
  step2,
  step3,
  step4,
  step5,
  step6,
  step7,
  step8,
  step9,
  strategyMatrix,
  classificationRules,
  gapReportTemplate,
  inputSummaryTemplate,
  invocationExamples,
  outputExampleReact,
  outputExampleVue,
  outputExampleHtmlJs,
  outputExampleJquery,
  outputExampleGapReport,
  outputExampleMockStrategy,
  knownLimitations,
] = await Promise.all([
  read("README.md"),
  read("SKILL.md"),
  read("TROUBLESHOOTING.md"),
  read("references/output-contract.md"),
  read("references/input-schema.md"),
  read("references/evidence-contract.md"),
  read("governance.md"),
  read("templates/RunReport.template.md"),
  read("templates/FinalReport.template.md"),
  read("templates/ExecutionSummary.template.md"),
  read("templates/CoverageSummary.template.md"),
  read("templates/ClassificationSummary.template.md"),
  read("templates/StrategyDecision.template.md"),
  read("templates/GenerationReview.template.md"),
  read("templates/TestAssetManifest.template.md"),
  read("project-profile-auto-fe-unit.md"),
  read("workflow/step-0-runreport.md"),
  read("workflow/step-1-input-gate.md"),
  read("workflow/step-2-gap-check.md"),
  read("workflow/step-3-normalize.md"),
  read("workflow/step-4-classify.md"),
  read("workflow/step-5-strategy.md"),
  read("workflow/step-6-generate-plan.md"),
  read("workflow/step-7-generate-script.md"),
  read("workflow/step-8-run.md"),
  read("workflow/step-9-report.md"),
  read("references/strategy-matrix.md"),
  read("references/classification-rules.md"),
  read("templates/GapReport.template.md"),
  read("templates/InputSummary.template.md"),
  read("examples/invocation-examples.md"),
  read("examples/output-example-react.md"),
  read("examples/output-example-vue.md"),
  read("examples/output-example-html-js.md"),
  read("examples/output-example-jquery.md"),
  read("examples/output-example-gap-report.md"),
  read("examples/output-example-mock-strategy.md"),
  read("KNOWN-LIMITATIONS.md"),
]);

function getSection(content, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${escapedHeading}\\r?\\n([\\s\\S]*?)(?=^##\\s|^###\\s|$(?!\\r?\\n))`, "m");
  const match = content.match(pattern);
  if (match) return match[0];
  // Fallback: heading at end of file (no subsequent ## heading)
  const fallback = new RegExp(`^${escapedHeading}\\r?\\n([\\s\\S]*)$`, "m");
  const fallbackMatch = content.match(fallback);
  return fallbackMatch ? fallbackMatch[0] : "";
}

const quickStartSection = getSection(readme, "## Quick Start");

const checks = [
  {
    description: "GenerationReview required across docs",
    ok:
      outputContract.includes("- `GenerationReview.md`") &&
      !getSection(outputContract, "## 條件式模板對應").includes("GenerationReview") &&
      evidenceContract.includes("`GenerationReview.md`") &&
      step7.includes("GenerationReview.md") &&
      readme.includes("`GenerationReview.md`") &&
      finalReportTemplate.includes("GenerationReview.md") &&
      runReportTemplate.includes("Generation Review:") &&
      projectProfile.includes("Generation Review:"),
  },
  {
    description: "ExecutionRaw required across docs",
    ok:
      outputContract.includes("- `ExecutionRaw.log`") &&
      governance.includes("`ExecutionRaw.log`") &&
      evidenceContract.includes("`ExecutionRaw.log`") &&
      step8.includes("ExecutionRaw.log") &&
      readme.includes("`ExecutionRaw.log`") &&
      executionSummaryTemplate.includes("Execution Gate Status:") &&
      executionSummaryTemplate.includes("Blocked Reason:") &&
      executionSummaryTemplate.includes("Raw Evidence Status:") &&
      coverageSummaryTemplate.includes("Status: measured / not_applicable") &&
      finalReportTemplate.includes("ExecutionRaw.log") &&
      runReportTemplate.includes("Execution Raw:") &&
      projectProfile.includes("Execution Raw:"),
  },
  {
    description: "HTML reports required across docs",
    ok:
      outputContract.includes("- `test-report-html/index.html`") &&
      outputContract.includes("- `coverage-html/index.html`") &&
      governance.includes("`test-report-html/index.html`") &&
      governance.includes("`coverage-html/index.html`") &&
      evidenceContract.includes("`test-report-html/index.html`") &&
      evidenceContract.includes("`coverage-html/index.html`") &&
      step8.includes("test-report-html/index.html") &&
      step8.includes("coverage-html/index.html") &&
      step9.includes("test-report-html/index.html") &&
      step9.includes("coverage-html/index.html") &&
      readme.includes("`test-report-html/index.html`") &&
      readme.includes("`coverage-html/index.html`") &&
      finalReportTemplate.includes("test-report-html/index.html") &&
      finalReportTemplate.includes("coverage-html/index.html") &&
      runReportTemplate.includes("Test Result HTML Report:") &&
      runReportTemplate.includes("Coverage HTML Report:") &&
      projectProfile.includes("Test Result HTML Report:") &&
      projectProfile.includes("Coverage HTML Report:"),
  },
  {
    description: "RunReport Last Updated maintenance aligned",
    ok:
      governance.includes("Last Updated") &&
      step0.includes("Last Updated") &&
      step1.includes("Last Updated") &&
      step2.includes("Last Updated") &&
      step3.includes("Last Updated") &&
      step4.includes("Last Updated") &&
      step5.includes("Last Updated") &&
      step6.includes("Last Updated") &&
      step7.includes("Last Updated") &&
      step8.includes("Last Updated") &&
      step9.includes("Last Updated"),
  },
  {
    description: "Step 0 resume and rollback semantics align with SKILL.md",
    ok:
      skill.includes("回退到最近可重建證據的步驟") &&
      step0.includes("最近可重建證據的步驟") &&
      step0.includes("清場為 `not_checked`") &&
      step0.includes("獨立產物狀態欄位（如 `Mock Strategy Status`") &&
      governance.includes("Step 0 判定 `RunReport.md`、產物與證據鏈不一致") &&
      governance.includes("相依的產物狀態欄位必須重設為 `pending`"),
  },
  {
    description: "Step 0 rollback map covers per-step rollback targets and reset rules",
    ok:
      step0.includes("回退至 Step 1") &&
      step0.includes("回退至 Step 3") &&
      step0.includes("回退至 Step 4") &&
      step0.includes("回退至 Step 5") &&
      step0.includes("回退至 Step 6") &&
      step0.includes("回退至 Step 7") &&
      step0.includes("回退至 Step 8") &&
      step0.includes("回退至 Step 9") &&
      step0.includes("`Normalization Status` 及其後所有 gate 清場為 `not_checked`") &&
      step0.includes("`Classification Status` 及其後所有 gate 清場為 `not_checked`") &&
      step0.includes("`Strategy Gate Status` 及其後所有 gate 清場為 `not_checked`") &&
      step0.includes("`Planning Gate Status`、`Script Generation Gate`、`Execution Gate`、`Verification DoD Status` 清場為 `not_checked`") &&
      step0.includes("`Script Generation Gate`、`Execution Gate`、`Verification DoD Status` 清場為 `not_checked`") &&
      step0.includes("`Execution Gate`、`Verification DoD Status` 清場為 `not_checked`") &&
      step0.includes("`Verification DoD Status` 清場為 `not_checked`") &&
      step0.includes("`Execution Raw Status`、`Test Result HTML Report Status`、`Coverage HTML Report Status`"),
  },
  {
    description: "RunReport artifact status fields aligned",
    ok:
      outputContract.includes("RunReport 狀態欄位規則") &&
      runReportTemplate.includes("Mock Strategy Status:") &&
      runReportTemplate.includes("Gap Report Status:") &&
      runReportTemplate.includes("Generation Review Status:") &&
      runReportTemplate.includes("合法值：pending / generated；`GenerationReview.md` 為必要治理產物，不使用 `not_applicable`") &&
      runReportTemplate.includes("Execution Raw Status:") &&
      runReportTemplate.includes("Test Result HTML Report Status:") &&
      runReportTemplate.includes("Coverage HTML Report Status:") &&
      step2.includes("Gap Report Status") &&
      step5.includes("Mock Strategy Status") &&
      step7.includes("Generation Review Status") &&
      step8.includes("Execution Raw Status") &&
      step8.includes("Test Result HTML Report Status") &&
      step8.includes("Coverage HTML Report Status") &&
      step9.includes("產物狀態欄位"),
  },
  {
    description: "Step 2 re-validation loop aligned",
    ok:
      readme.includes("D --> B") &&
      skill.includes("Step 2 補件完成後，必須回到 Step 1 重跑輸入驗證") &&
      step2.includes("Current Step` 更新為 `Step 1`") &&
      step2.includes("Input Validation Status` 重設為 `not_checked`") &&
      step3.includes("Input Validation Status = passed") &&
      governance.includes("重設為 `not_checked`") &&
      step1.includes("Missing Required Inputs"),
  },
  {
    description: "Missing Required Inputs governance aligned",
    ok:
      runReportTemplate.includes("Missing Required Inputs:") &&
      step1.includes("Missing Required Inputs") &&
      step2.includes("Missing Required Inputs") &&
      governance.includes("Missing Required Inputs") &&
      readme.includes("Step 2 補件完成後，必須回到 Step 1 重跑輸入驗證") &&
      troubleshooting.includes("Missing Required Inputs") &&
      troubleshooting.includes("Step 2 不主動清空此欄位"),
  },
  {
    description: "Governed required resolution aligned",
    ok:
      inputSchema.includes("## Governed Required 解析規則") &&
      step4.includes("framework_type") &&
      step5.includes("acceptance_rules") &&
      step6.includes("acceptance_rules") &&
      readme.includes("`framework_type` 必須在 Step 4") &&
      readme.includes("`acceptance_rules` 必須在 Step 5"),
  },
  {
    description: "Planning gate aligned across docs",
    ok:
      governance.includes("Planning Gate Status") &&
      runReportTemplate.includes("Planning Gate Status:") &&
      step6.includes("Planning Gate Status") &&
      step7.includes("Planning Gate Status = passed") &&
      step9.includes("gate 狀態欄位"),
  },
  {
    description: "MockStrategy conditional rule aligned",
    ok:
      outputContract.includes("MockStrategy 補充規則") &&
      strategyMatrix.includes("MockStrategy 觸發條件") &&
      step5.includes("## MockStrategy trigger") &&
      readme.includes("`MockStrategy.md` 的建議觸發條件"),
  },
  {
    description: "GapReport conditional rule aligned",
    ok:
      outputContract.includes("GapReport 補充規則") &&
      step2.includes("## GapReport trigger") &&
      readme.includes("`GapReport.md` 的建議觸發條件"),
  },
  {
    description: "README Quick Start required artifact list aligned",
    ok:
      quickStartSection.includes("`RunReport.md`") &&
      quickStartSection.includes("`InputSummary.md`") &&
      quickStartSection.includes("`NormalizedInput.md`") &&
      quickStartSection.includes("`ClassificationSummary.md`") &&
      quickStartSection.includes("`StrategyDecision.md`") &&
      quickStartSection.includes("`TestPlan.md`") &&
      quickStartSection.includes("`TestCases.md`") &&
      quickStartSection.includes("`TestAssetManifest.md`") &&
      quickStartSection.includes("`GenerationReview.md`") &&
      quickStartSection.includes("`ExecutionRaw.log`") &&
      quickStartSection.includes("`test-report-html/index.html`") &&
      quickStartSection.includes("`coverage-html/index.html`") &&
      quickStartSection.includes("`ExecutionSummary.md`") &&
      quickStartSection.includes("`CoverageSummary.md`") &&
      quickStartSection.includes("`FinalReport.md`"),
  },
  {
    description: "Output examples required artifact lists aligned",
    ok:
      outputExampleReact.includes("`StrategyDecision.md`") &&
      outputExampleReact.includes("`test-report-html/index.html`") &&
      outputExampleReact.includes("`coverage-html/index.html`") &&
      outputExampleVue.includes("`StrategyDecision.md`") &&
      outputExampleVue.includes("`test-report-html/index.html`") &&
      outputExampleVue.includes("`coverage-html/index.html`") &&
      outputExampleHtmlJs.includes("`StrategyDecision.md`") &&
      outputExampleHtmlJs.includes("`test-report-html/index.html`") &&
      outputExampleHtmlJs.includes("`coverage-html/index.html`") &&
      outputExampleJquery.includes("`StrategyDecision.md`") &&
      outputExampleJquery.includes("`test-report-html/index.html`") &&
      outputExampleJquery.includes("`coverage-html/index.html`"),
  },
  {
    description: "GapReport output example aligns with blocked Step 2 semantics",
    ok:
      outputExampleGapReport.includes("Workflow Status: `BLOCKED`") &&
      outputExampleGapReport.includes("Blocking Step: `Step 2 - 缺口補件") &&
      outputExampleGapReport.includes("Status: `active`") &&
      outputExampleGapReport.includes("Suggested Resolution") &&
      outputExampleGapReport.includes("補齊 dependency 與 spec 後回到 Step 2 補件"),
  },
  {
    description: "GapReport output example has governed section structure",
    ok:
      outputExampleGapReport.includes("### 狀態摘要") &&
      outputExampleGapReport.includes("### 缺口清單") &&
      outputExampleGapReport.includes("| Gap ID | Category | Description | Impact | Blocking | Suggested Resolution |") &&
      outputExampleGapReport.includes("### 缺口來源") &&
      outputExampleGapReport.includes("### 已嘗試處理") &&
      outputExampleGapReport.includes("### 需要使用者補充") &&
      outputExampleGapReport.includes("### 建議下一步"),
  },
  {
    description: "MockStrategy output example aligns with trigger semantics",
    ok:
      outputExampleMockStrategy.includes("fetch") &&
      outputExampleMockStrategy.includes("localStorage") &&
      outputExampleMockStrategy.includes("window.location.assign") &&
      outputExampleMockStrategy.includes("第三方 SDK") &&
      outputExampleMockStrategy.includes("not_applicable"),
  },
  {
    description: "MockStrategy output example has governed section structure",
    ok:
      outputExampleMockStrategy.includes("### 範圍") &&
      outputExampleMockStrategy.includes("### 外部依賴盤點") &&
      outputExampleMockStrategy.includes("| Dependency | Type | Why Mock | Strategy | Notes |") &&
      outputExampleMockStrategy.includes("### 網路層策略") &&
      outputExampleMockStrategy.includes("### 瀏覽器能力策略") &&
      outputExampleMockStrategy.includes("### 第三方套件 / SDK 策略") &&
      outputExampleMockStrategy.includes("### 風險與限制"),
  },
  {
    description: "Output contract forbids merging required artifacts",
    ok:
      outputContract.includes("主要產物在完整版 workflow 下都應存在") &&
      outputContract.includes("不得省略、合併或以摘要取代") &&
      !outputContract.includes("被合併"),
  },
  {
    description: "README Mermaid reflects Planning Gate Status branches",
    ok:
      readme.includes("Planning Gate Status?") &&
      readme.includes("blocked / failed --> H") &&
      readme.includes("PG -- passed --> I"),
  },
  {
    description: "README Mermaid reflects Script Generation Gate blocked and failed branches",
    ok:
      readme.includes("Script Generation Gate?") &&
      readme.includes("failed / blocked --> I") &&
      readme.includes("passed --> K"),
  },
  {
    description: "README Mermaid reflects Step 8 Execution Gate branches",
    ok:
      readme.includes("Execution Gate?") &&
      readme.includes("blocked: precondition path --> L") &&
      readme.includes("blocked: HTML report missing --> K"),
  },
  {
    description: "README Quick Start covers Governed Required with missing_blocking",
    ok:
      quickStartSection.includes("Governed Required") &&
      quickStartSection.includes("missing_blocking"),
  },
  {
    description: "README documents ExecutionRaw.log not_applicable exception",
    ok:
      readme.includes("Execution Raw Status` 標記為 `not_applicable`") &&
      readme.includes("ExecutionRaw.log`（若 Step 8 前置條件不成立"),
  },
  {
    description: "README documents HTML report not_applicable exceptions",
    ok:
      readme.includes("Test Result HTML Report Status` 標記為 `not_applicable`") &&
      readme.includes("Coverage HTML Report Status` 標記為 `not_applicable`") &&
      readme.includes("test-report-html/index.html`（若 Step 8 前置條件不成立") &&
      readme.includes("coverage-html/index.html`（若 Step 8 前置條件不成立"),
  },
  {
    description: "Normalization Status gate field aligned across docs",
    ok:
      runReportTemplate.includes("Normalization Status: not_checked") &&
      step3.includes("Normalization Status = passed") &&
      step4.includes("Normalization Status = passed") &&
      outputContract.includes("Normalization Status") &&
      governance.includes("Normalization Status"),
  },
  {
    description: "Entry Gate declarations present in all steps",
    ok:
      step0.includes("## Entry Gate") &&
      step1.includes("## Entry Gate") &&
      step2.includes("## Entry Gate") &&
      step3.includes("## Entry Gate") &&
      step4.includes("## Entry Gate") &&
      step5.includes("## Entry Gate") &&
      step6.includes("## Entry Gate") &&
      step7.includes("## Entry Gate") &&
      step8.includes("## Entry Gate") &&
      step9.includes("## Entry Gate"),
  },
  {
    description: "Step 8 entry gate references Script Generation Gate field",
    ok:
      step8.includes("Script Generation Gate = passed"),
  },
  {
    description: "MockStrategy triggers canonical across step-5, strategy-matrix, README",
    ok:
      step5.includes("兩個以上外部 API") &&
      step5.includes("需要 partial mock") &&
      strategyMatrix.includes("兩個以上外部 API") &&
      strategyMatrix.includes("需要 partial mock") &&
      readme.includes("兩個以上外部 API") &&
      readme.includes("需要 partial mock"),
  },
  {
    description: "governance covers Step 3 BLOCKED and Step 7 external blocked",
    ok:
      governance.includes("Step 3 若因") &&
      governance.includes("Script Generation Gate = failed") &&
      governance.includes("外部原因導致無法繼續"),
  },
  {
    description: "output-contract lists all gate fields including Normalization Status",
    ok:
      outputContract.includes("Normalization Status") &&
      outputContract.includes("Classification Status") &&
      outputContract.includes("Strategy Gate Status") &&
      outputContract.includes("Planning Gate Status") &&
      outputContract.includes("Script Generation Gate") &&
      outputContract.includes("Execution Gate") &&
      outputContract.includes("Verification DoD Status"),
  },
  {
    description: "TROUBLESHOOTING covers Step 4 BLOCKED (framework_type)",
    ok:
      troubleshooting.includes("Step 4 BLOCKED") &&
      troubleshooting.includes("framework_type"),
  },
  {
    description: "ClassificationSummary template has framework_type confirmed field",
    ok:
      classificationSummaryTemplate.includes("Framework Type Confirmed:"),
  },
  {
    description: "StrategyDecision template has acceptance_rules confirmed field",
    ok:
      strategyDecisionTemplate.includes("Acceptance Rules 確認") &&
      strategyDecisionTemplate.includes("Resolved At: Step 5"),
  },
  {
    description: "GenerationReview template has Status values and Script Generation Gate note",
    ok:
      generationReviewTemplate.includes("Status: passed / failed") &&
      generationReviewTemplate.includes("blocked") &&
      generationReviewTemplate.includes("Script Generation Gate"),
  },
  {
    description: "FinalReport template has Workflow Status values and DoD section",
    ok:
      finalReportTemplate.includes("DONE / BLOCKED / FAILED / IN_PROGRESS") &&
      finalReportTemplate.includes("Verification DoD Status:"),
  },
  {
    description: "project-profile includes EnvTemplate path",
    ok:
      projectProfile.includes("Env Template:"),
  },
  {
    description: "classification-rules documents TypeScript classification note",
    ok:
      classificationRules.includes("TypeScript") &&
      classificationRules.includes("React + TypeScript"),
  },
  {
    description: "evidence-contract Step 2 note references InputSummary",
    ok:
      evidenceContract.includes("InputSummary.md") &&
      evidenceContract.includes("補件紀錄"),
  },
  {
    description: "ExecutionSummary template has Blocked Reason field and CoverageSummary has not_applicable",
    ok:
      executionSummaryTemplate.includes("Blocked Reason") &&
      executionSummaryTemplate.includes("Test Result HTML Report Path:") &&
      coverageSummaryTemplate.includes("not_applicable") &&
      coverageSummaryTemplate.includes("Coverage HTML Report Path:") &&
      governance.includes("ExecutionSummary.md") &&
      governance.includes("CoverageSummary.md") &&
      step8.includes("前置條件不成立"),
  },
  {
    description: "TestAssetManifest table format aligned across docs",
    ok:
      step7.includes("表格格式（Script Path / Case IDs / Status）") &&
      outputContract.includes("Script Path、Case IDs（可追溯至 `TestCases.md`）與 Status") &&
      evidenceContract.includes("Script Path、Case IDs、Status") &&
      testAssetManifestTemplate.includes("| Script Path | Case IDs | Status |") &&
      testAssetManifestTemplate.includes("generated / pending"),
  },
  {
    description: "TestAssetManifest template covers all governed sections",
    ok:
      testAssetManifestTemplate.includes("## 測試腳本") &&
      testAssetManifestTemplate.includes("## Setup 檔") &&
      testAssetManifestTemplate.includes("| File Path | Purpose | Status |") &&
      testAssetManifestTemplate.includes("## Mock / Stub") &&
      testAssetManifestTemplate.includes("| Mock Target | Type | Strategy | Status |") &&
      testAssetManifestTemplate.includes("## Fixture") &&
      testAssetManifestTemplate.includes("| Fixture Path | Used In | Status |") &&
      testAssetManifestTemplate.includes("## 其他資產"),
  },
  {
    description: "governance covers Script Generation Gate definition and Step 8 Execution Gate values",
    ok:
      governance.includes("Script Generation Gate") &&
      governance.includes("Execution Gate = passed") &&
      governance.includes("Execution Gate = blocked"),
  },
  {
    description: "Step 8 HTML report generation and blocked fallback aligned",
    ok:
      step8.includes("Test Result HTML Report Status = not_applicable") &&
      step8.includes("Coverage HTML Report Status = not_applicable") &&
      step8.includes("test-report-html/index.html") &&
      step8.includes("coverage-html/index.html") &&
      step8.includes("Execution Gate = blocked") &&
      step8.includes("Current Step` 維持在 Step 8") &&
      governance.includes("`test-report-html/index.html`、`coverage-html/index.html` 可標記為 `not_applicable`") &&
      governance.includes("必要 HTML 報告無法合法產出"),
  },
  {
    description: "Step 6 blocked recovery paths clear both Strategy and Planning gates before rerun",
    ok:
      step6.includes("回退 Step 5 補齊依據後重跑 Step 5 → Step 6") &&
      step6.includes("`Planning Gate Status`（由補件流程在重新進入 Step 6 前清場）"),
  },
  {
    description: "Step 7 exit criteria distinguish passed failed and blocked outcomes",
    ok:
      step7.includes("若 `Script Generation Gate = passed`，主要腳本已生成") &&
      step7.includes("若 `Script Generation Gate = failed`，主要腳本已生成") &&
      step7.includes("若 `Script Generation Gate = blocked`，`Status = BLOCKED`") &&
      step7.includes("不得進 Step 8"),
  },
  {
    description: "SKILL.md uses failed terminology consistently for Execution gate",
    ok:
      skill.includes("不得標記為 `failed`") &&
      !skill.includes("`FAIL`"),
  },
  {
    description: "GapReport lifecycle resolution path aligned across docs",
    ok:
      step2.includes("GapReport.md") &&
      step2.includes("resolved") &&
      outputContract.includes("Status` 更新為 `resolved`") &&
      troubleshooting.includes("resolved") &&
      gapReportTemplate.includes("Status: active / resolved"),
  },
  {
    description: "FinalReport template has conditional artifacts section",
    ok:
      finalReportTemplate.includes("## 條件式產物") &&
      finalReportTemplate.includes("MockStrategy.md: generated / not_applicable") &&
      finalReportTemplate.includes("GapReport.md: generated / not_applicable") &&
      !finalReportTemplate.includes("generated / not_applicable / pending"),
  },
  {
    description: "Step 4 BLOCKED backtrack path and Normalization Status reset aligned",
    ok:
      step4.includes("`Normalization Status`") &&
      step4.includes("重設為 `not_checked`") &&
      governance.includes("重設為 `not_checked`") &&
      troubleshooting.includes("Step 3 → Step 4"),
  },
  {
    description: "Step 5 entry gate blocked behavior aligns with governance",
    ok:
      step5.includes("Classification Status = blocked") &&
      step5.includes("Current Step` 維持在 Step 4") &&
      governance.includes("Step 5 Entry Gate 因") &&
      governance.includes("BLOCKED 狀態由 Step 4 負責設定"),
  },
  {
    description: "Step 9 Entry Gate references Execution Gate passed and blocked",
    ok:
      step9.includes("Execution Gate = passed") &&
      step9.includes("Execution Gate = blocked") &&
      governance.includes("DoD 不通過"),
  },
  {
    description: "Step 9 closing interaction aligns across docs",
    ok:
      step9.includes("對使用者輸出中文總結") &&
      step9.includes("主動詢問使用者是否要用網頁檢視測試結果") &&
      step9.includes("則不得主動詢問網頁檢視") &&
      readme.includes("先用中文向使用者總結本次結果") &&
      readme.includes("才主動詢問是否要用網頁檢視測試結果") &&
      invocationExamples.includes("先以中文總結結果") &&
      invocationExamples.includes("主動詢問是否要用網頁檢視測試結果"),
  },
  {
    description: "ExecutionSummary and RunReport Execution Gate field name alignment noted",
    ok:
      executionSummaryTemplate.includes("Execution Gate Status:") &&
      runReportTemplate.includes("Execution Gate:") &&
      outputContract.includes("Execution Gate Status:") &&
      outputContract.includes("Execution Gate:"),
  },
  {
    description: "InputSummary template notes that failed is not a valid value",
    ok: inputSummaryTemplate.includes("不使用 `failed`"),
  },
  {
    description: "ExecutionSummary template notes that failed is not a valid value for Execution Gate Status",
    ok: executionSummaryTemplate.includes("不使用 `failed`"),
  },
  {
    description: "invocation-examples recommended startup format matches SKILL.md",
    ok:
      invocationExamples.includes("/auto-fe-unit-test-workflow <target-path>，依序執行完整 Step 0~9。") &&
      skill.includes("/auto-fe-unit-test-workflow <target-path>，依序執行完整 Step 0~9。"),
  },
  {
    description: "RunReport template includes Test Env Status field",
    ok: runReportTemplate.includes("Test Env Status"),
  },
  {
    description: "Step 1 documents env detection and npm auto-setup",
    ok:
      step1.includes("Test Env Status") &&
      step1.includes("npm install"),
  },
  {
    description: "Step 8 前置條件 references Test Env Status",
    ok: step8.includes("Test Env Status"),
  },
  {
    description: "governance documents env auto-setup rule (Section 10)",
    ok:
      governance.includes("測試執行環境自動初始化規則") &&
      governance.includes("Test Env Status"),
  },
  {
    description: "step-1 documents existing runner precedence for jQuery/HTML+JS",
    ok:
      step1.includes("既有 runner 優先") &&
      step1.includes("jest jest-environment-jsdom") &&
      step1.includes("npx jest --version"),
  },
  {
    description: "step-2 documents env_blocker gap handling path",
    ok:
      step2.includes("環境修復型缺口") &&
      step2.includes("env_blocker") &&
      step2.includes("Test Env Status"),
  },
  {
    description: "test_env auto-repairable semantics aligned across core docs",
    ok:
      skill.includes("自動修復型輸入") &&
      readme.includes("Governed Required / auto-repairable") &&
      inputSchema.includes("governed_auto_repairable") &&
      governance.includes("governed auto-repairable") &&
      step1.includes("不得因 `project_config`、`test_targets`、`behavior_spec` 或其他 required inputs 缺失而延後") &&
      troubleshooting.includes("此動作不得因其他 required inputs 缺失而被延後"),
  },
  {
    description: "Step 2 routes test_env as env_blocker instead of Q&A supplement",
    ok:
      step2.includes("不得把 `test_env` 當作一般一問一答補件欄位") &&
      governance.includes("不得把 `test_env` 當作一般一問一答補件欄位") &&
      invocationExamples.includes("`test_env` 阻塞時僅記錄 `env_blocker`") &&
      outputContract.includes("不得把 `test_env` 描述成「尚未提問完成的普通補件欄位」"),
  },
  {
    description: "TROUBLESHOOTING Section 12 covers Test Env Status = blocked",
    ok:
      troubleshooting.includes("Test Env Status = blocked") &&
      troubleshooting.includes("env_blocker"),
  },
  {
    description: "RunReport Generation Review Status does not allow not_applicable",
    ok:
      runReportTemplate.includes("Generation Review Status: pending") &&
      !runReportTemplate.includes("Generation Review Status: pending（合法值：pending / generated / not_applicable）"),
  },
  {
    description: "KNOWN-LIMITATIONS documents npm auto-setup failure risk",
    ok:
      knownLimitations.includes("npm auto-setup") &&
      knownLimitations.includes("Test Env Status = blocked"),
  },
];

const failed = checks.filter((check) => !check.ok);

if (failed.length > 0) {
  console.error("Cross-document consistency checks failed:");
  for (const check of failed) {
    console.error(`- ${check.description}`);
  }
  process.exit(1);
}

console.log("Cross-document consistency verified.");
