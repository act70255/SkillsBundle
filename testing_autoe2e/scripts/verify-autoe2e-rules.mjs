import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const commandsDir = path.join(repoRoot, '.opencode', 'commands');

const workflowChecks = {
  'workflow-testing-autoe2e-plan-playwright.md': {
    requiredSnippets: [
      '維護驗證（文件/規則調整時強制）：',
      'node .opencode/scripts/verify-autoe2e-rules.mjs',
      '`run-mode`（預設：`new`）',
      'workflow-handoff/',
      'workflow-deliverables/',
      'workflow-scripts/',
      '[WORKFLOW]RUN-REPORT.md',
      'InputSnapshotCache',
      'ReusePolicy',
      'snapshotHash',
      '`run-mode=resume` 僅允許在 `[WORKFLOW]RUN-REPORT.md.CurrentState=BLOCKED` 時使用',
    ],
    forbiddenSnippets: ['可參考借鑑', '參考借鑑'],
  },
  'workflow-testing-autoe2e-execute-playwright.md': {
    requiredSnippets: [
      '維護驗證（文件/規則調整時強制）：',
      'node .opencode/scripts/verify-autoe2e-rules.mjs',
      'workflow-handoff/',
      'workflow-deliverables/',
      'workflow-scripts/',
      '[WORKFLOW]RUN-REPORT.md',
      'InputSnapshotCache',
      'ReusePolicy',
      '不使用額外模式參數',
    ],
    forbiddenSnippets: ['--run-mode <new|resume>', '`run-mode`（預設：`new`）', '可參考借鑑', '參考借鑑'],
  },
};

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function validateArtifactPaths(fileName, text, errors) {
  const pathPatterns = [
    /--artifact-dir\/[A-Za-z0-9_./\-[\]]+/g,
    /workflow-handoff\/[A-Za-z0-9_./\-[\]]+/g,
    /workflow-deliverables\/[A-Za-z0-9_./\-[\]]+/g,
    /workflow-scripts\/[A-Za-z0-9_./\-[\]]+/g,
  ];

  const matches = new Set();
  for (const pattern of pathPatterns) {
    for (const match of text.match(pattern) ?? []) {
      matches.add(match);
    }
  }

  for (const match of matches) {
    const allowed =
      match === '--artifact-dir/workflow-handoff' ||
      match === '--artifact-dir/workflow-deliverables' ||
      match === '--artifact-dir/workflow-scripts' ||
      match === 'workflow-handoff/' ||
      match === 'workflow-deliverables/' ||
      match === 'workflow-scripts/' ||
      match.startsWith('--artifact-dir/workflow-handoff/') ||
      match.startsWith('--artifact-dir/workflow-deliverables/') ||
      match.startsWith('--artifact-dir/workflow-scripts/') ||
      match.startsWith('workflow-handoff/') ||
      match.startsWith('workflow-deliverables/') ||
      match.startsWith('workflow-scripts/');

    if (!allowed) {
      errors.push(`${fileName}: invalid path outside workflow-handoff/workflow-deliverables/workflow-scripts -> ${match}`);
    }
  }
}

function validateHandoffNaming(fileName, text, errors) {
  const handoffFilePattern = /workflow-handoff\/([A-Za-z0-9_.\-\[\]*]+\.md)/g;

  for (const [, handoffFile] of text.matchAll(handoffFilePattern)) {
    if (!handoffFile.startsWith('[WORKFLOW]')) {
      errors.push(`${fileName}: handoff file must start with [WORKFLOW] -> ${handoffFile}`);
    }
  }
}

function validateWorkflow(fileName, errors) {
  const filePath = path.join(commandsDir, fileName);

  if (!fs.existsSync(filePath)) {
    errors.push(`${fileName}: file not found`);
    return;
  }

  const text = readText(filePath);
  const checks = workflowChecks[fileName];

  for (const snippet of checks.requiredSnippets) {
    if (!text.includes(snippet)) {
      errors.push(`${fileName}: missing required snippet -> ${snippet}`);
    }
  }

  for (const snippet of checks.forbiddenSnippets ?? []) {
    if (text.includes(snippet)) {
      errors.push(`${fileName}: contains forbidden snippet -> ${snippet}`);
    }
  }

  validateArtifactPaths(fileName, text, errors);
  validateHandoffNaming(fileName, text, errors);
}

function main() {
  const errors = [];

  for (const fileName of Object.keys(workflowChecks)) {
    validateWorkflow(fileName, errors);
  }

  if (errors.length > 0) {
    console.error('AutoE2E workflow rule validation failed:\n');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('AutoE2E workflow rule validation passed.');
}

main();
