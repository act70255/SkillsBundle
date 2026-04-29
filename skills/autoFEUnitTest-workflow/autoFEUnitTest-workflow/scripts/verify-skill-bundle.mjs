import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const required = [
  "SKILL.md",
  "README.md",
  "CHANGELOG.md",
  "KNOWN-LIMITATIONS.md",
  "RELEASE-CHECKLIST.md",
  "TROUBLESHOOTING.md",
  "governance.md",
  "project-profile-auto-fe-unit.md",
  "workflow/step-0-runreport.md",
  "workflow/step-1-input-gate.md",
  "workflow/step-2-gap-check.md",
  "workflow/step-3-normalize.md",
  "workflow/step-4-classify.md",
  "workflow/step-5-strategy.md",
  "workflow/step-6-generate-plan.md",
  "workflow/step-7-generate-script.md",
  "workflow/step-8-run.md",
  "workflow/step-9-report.md",
  "references/architecture.md",
  "references/input-schema.md",
  "references/classification-rules.md",
  "references/evidence-contract.md",
  "references/strategy-matrix.md",
  "references/output-contract.md",
  "templates/RunReport.template.md",
  "templates/InputSummary.template.md",
  "templates/NormalizedInput.template.md",
  "templates/ClassificationSummary.template.md",
  "templates/StrategyDecision.template.md",
  "templates/TestPlan.template.md",
  "templates/TestCases.template.md",
  "templates/TestAssetManifest.template.md",
  "templates/GenerationReview.template.md",
  "templates/ExecutionSummary.template.md",
  "templates/CoverageSummary.template.md",
  "templates/FinalReport.template.md",
  "templates/MockStrategy.template.md",
  "templates/GapReport.template.md",
  "templates/EnvTemplate.example",
  "examples/invocation-examples.md",
  "examples/output-example-react.md",
  "examples/output-example-vue.md",
  "examples/output-example-html-js.md",
  "examples/output-example-jquery.md",
  "examples/output-example-mock-strategy.md",
  "examples/output-example-gap-report.md",
  "scripts/verify-skill-bundle.mjs",
  "scripts/verify-workflow-skill.mjs",
  "scripts/verify-output-contract.mjs",
  "scripts/verify-doc-consistency.mjs",
  "scripts/verify-all.mjs",
];

const missing = [];

for (const file of required) {
  try {
    await access(path.join(root, file));
  } catch {
    missing.push(file);
  }
}

if (missing.length > 0) {
  console.error("Missing required skill files:");
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Skill bundle structure verified.");
