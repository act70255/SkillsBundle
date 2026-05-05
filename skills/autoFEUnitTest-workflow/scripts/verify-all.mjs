import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));

const scripts = [
  "scripts/verify-skill-bundle.mjs",
  "scripts/verify-workflow-skill.mjs",
  "scripts/verify-output-contract.mjs",
  "scripts/verify-doc-consistency.mjs",
];

function runScript(script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      cwd: root,
      stdio: "inherit",
      shell: false,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${script} failed with exit code ${code}`));
      }
    });

    child.on("error", reject);
  });
}

for (const script of scripts) {
  await runScript(path.join(root, script));
}

console.log("All verification scripts passed.");
