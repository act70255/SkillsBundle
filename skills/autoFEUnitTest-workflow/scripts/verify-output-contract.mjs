import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const templates = [
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
];

const missing = [];

for (const file of templates) {
  try {
    await access(path.join(root, file));
  } catch {
    missing.push(file);
  }
}

if (missing.length > 0) {
  console.error("Missing output contract templates:");
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Output contract templates verified.");
