import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const skillPath = path.join(root, "SKILL.md");
const content = await readFile(skillPath, "utf8");

const requiredMarkers = [
  "name: auto-fe-unit-test-workflow",
  "disable-model-invocation: true",
  "## Canonical step flow",
  "## Pipeline gate policy",
  "## Evidence contract",
  "## Dispatch mapping",
];

const missing = requiredMarkers.filter((marker) => !content.includes(marker));

if (missing.length > 0) {
  console.error("SKILL.md is missing required markers:");
  for (const marker of missing) {
    console.error(`- ${marker}`);
  }
  process.exit(1);
}

console.log("SKILL.md content verified.");
