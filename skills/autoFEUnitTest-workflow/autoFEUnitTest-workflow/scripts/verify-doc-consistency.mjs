import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

const [
  readme,
  outputContract,
  evidenceContract,
  governance,
  runReportTemplate,
  finalReportTemplate,
  projectProfile,
  step0,
  step1,
  step2,
  step5,
  step7,
  step8,
  step9,
  strategyMatrix,
] = await Promise.all([
  read("README.md"),
  read("references/output-contract.md"),
  read("references/evidence-contract.md"),
  read("governance.md"),
  read("templates/RunReport.template.md"),
  read("templates/FinalReport.template.md"),
  read("project-profile-auto-fe-unit.md"),
  read("workflow/step-0-runreport.md"),
  read("workflow/step-1-input-gate.md"),
  read("workflow/step-2-gap-check.md"),
  read("workflow/step-5-strategy.md"),
  read("workflow/step-7-generate-script.md"),
  read("workflow/step-8-run.md"),
  read("workflow/step-9-report.md"),
  read("references/strategy-matrix.md"),
]);

const checks = [
  {
    description: "GenerationReview required across docs",
    ok:
      outputContract.includes("- `GenerationReview.md`") &&
      !outputContract.includes("## 條件式產物\n- `MockStrategy.md`\n- `EnvTemplate.example`\n- `GenerationReview.md`") &&
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
      finalReportTemplate.includes("ExecutionRaw.log") &&
      runReportTemplate.includes("Execution Raw:") &&
      projectProfile.includes("Execution Raw:"),
  },
  {
    description: "RunReport Last Updated maintenance aligned",
    ok:
      governance.includes("Last Updated") &&
      step0.includes("Last Updated") &&
      step1.includes("Last Updated") &&
      step2.includes("Last Updated") &&
      step7.includes("Last Updated") &&
      step8.includes("Last Updated") &&
      step9.includes("Last Updated"),
  },
  {
    description: "RunReport artifact status fields aligned",
    ok:
      outputContract.includes("RunReport 狀態欄位規則") &&
      runReportTemplate.includes("Mock Strategy Status:") &&
      runReportTemplate.includes("Gap Report Status:") &&
      runReportTemplate.includes("Generation Review Status:") &&
      runReportTemplate.includes("Execution Raw Status:") &&
      step2.includes("Gap Report Status") &&
      step5.includes("Mock Strategy Status") &&
      step7.includes("Generation Review Status") &&
      step8.includes("Execution Raw Status") &&
      step9.includes("產物狀態欄位"),
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
