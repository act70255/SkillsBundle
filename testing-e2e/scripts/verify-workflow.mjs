import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const runtimeRoot = path.join(repoRoot, '.opencode');
const runtimeCommandDir = path.join(runtimeRoot, 'commands');
const runtimeTemplateDir = path.join(runtimeRoot, 'template');

const runtimeCommands = [
  'workflow-e2e.md',
  'subworkflow-e2e-input.md',
  'subworkflow-e2e-docs.md',
  'subworkflow-e2e-scan.md',
  'subworkflow-e2e-generate.md',
  'subworkflow-e2e-run.md',
  'subworkflow-e2e-report.md',
];

const runtimeTemplates = [
  '[WORKFLOW]RunReport.template.md',
  '[WORKFLOW]InputSummary.template.md',
  '[WORKFLOW]DocsBaseline.template.md',
  '[WORKFLOW]SiteScanSummary.template.md',
  '[WORKFLOW]ExecutionSummary.template.md',
  '[WORKFLOW]TestPlan.template.md',
  '[WORKFLOW]TestCases.template.md',
  '[WORKFLOW]TestScript.template.ts',
  '[WORKFLOW]TestReport.template.md',
  '.env.playwright.template',
];

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function assertFileExists(filePath, label, errors) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${label}: missing file -> ${filePath}`);
  }
}

function assertIncludes(text, snippet, label, errors) {
  if (!text.includes(snippet)) {
    errors.push(`${label}: missing -> ${snippet}`);
  }
}

function validateRuntimeCommands(errors) {
  for (const fileName of runtimeCommands) {
    const filePath = path.join(runtimeCommandDir, fileName);
    assertFileExists(filePath, 'runtime command', errors);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const text = readText(filePath);
    assertIncludes(text, 'testing-artifact/handoff/[WORKFLOW]RunReport.md', fileName, errors);
  }

  const mainPath = path.join(runtimeCommandDir, 'workflow-e2e.md');
  if (fs.existsSync(mainPath)) {
    const text = readText(mainPath);
    assertIncludes(text, '@.opencode/template/[WORKFLOW]RunReport.template.md', 'workflow-e2e.md', errors);
    assertIncludes(text, 'testing-artifact/deliverables/.env.playwright', 'workflow-e2e.md', errors);
    assertIncludes(text, 'testing-artifact/scripts/TestScript.ts', 'workflow-e2e.md', errors);
  }
}

function validateRuntimeTemplates(errors) {
  for (const fileName of runtimeTemplates) {
    const filePath = path.join(runtimeTemplateDir, fileName);
    assertFileExists(filePath, 'runtime template', errors);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const text = readText(filePath);
    if (!text.trim()) {
      errors.push(`runtime template empty -> ${filePath}`);
    }
  }
}

function main() {
  const errors = [];

  validateRuntimeCommands(errors);
  validateRuntimeTemplates(errors);

  if (errors.length > 0) {
    console.error('Runtime workflow validation failed:\n');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Runtime workflow validation passed.');
}

main();
