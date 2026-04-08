import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const testingUnitDir = path.join(repoRoot, 'testing-unit');
const runtimeDir = path.join(repoRoot, '.opencode');

const commandFiles = [
  'workflow-testing-unit.md',
  'subworkflow-unit-input.md',
  'subworkflow-unit-analyze.md',
  'subworkflow-unit-classify.md',
  'subworkflow-unit-genscript.md',
  'subworkflow-unit-genscript-vitest.md',
  'subworkflow-unit-genscript-jest.md',
  'subworkflow-unit-execute.md',
  'subworkflow-unit-execute-vitest.md',
  'subworkflow-unit-execute-jest.md',
  'subworkflow-unit-report.md',
];

const templateFiles = [
  'RunReport.template.md',
  'InputSummary.template.md',
  'SourceBaseline.template.md',
  'StackClassification.template.md',
  'TestPlan.template.md',
  'TestCases.template.md',
  'TestScriptReport.template.md',
  'ExecutionSummary.template.md',
  'TestReport.template.md',
  'AcceptanceCriteria.template.md',
  'UnitBlockers.template.md',
];

const checklistLines = [
  '- [ ] Step 0 - Check workflow run report status',
  '- [ ] Step 1 - Check input information',
  '- [ ] Step 2 - Ask user to complete missing information',
  '- [ ] Step 3 - Analyze docs and source code',
  '- [ ] Step 4 - Classify stack and runner route',
  '- [ ] Step 5 - Generate unit test scripts by runner',
  '- [ ] Step 6 - Execute unit test scripts by runner',
  '- [ ] Step 7 - Generate final unit test report',
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

function assertFilesMatch(sourcePath, targetPath, label, errors) {
  if (!fs.existsSync(sourcePath) || !fs.existsSync(targetPath)) {
    errors.push(`${label}: missing source/target for sync check`);
    return;
  }

  const sourceText = readText(sourcePath);
  const targetText = readText(targetPath);
  if (sourceText !== targetText) {
    errors.push(`${label}: content mismatch -> ${targetPath}`);
  }
}

function getSourcePaths() {
  return {
    rootDir: testingUnitDir,
    commandDir: path.join(testingUnitDir, 'commands'),
    templateDir: path.join(testingUnitDir, 'template'),
    readme: path.join(testingUnitDir, 'README.md'),
    runReportTemplate: path.join(testingUnitDir, 'template', 'RunReport.template.md'),
  };
}

function getRuntimePaths() {
  return {
    rootDir: runtimeDir,
    commandDir: path.join(runtimeDir, 'commands'),
    templateDir: path.join(runtimeDir, 'template', 'testing-unit'),
    runReportTemplate: path.join(runtimeDir, 'template', 'testing-unit', 'RunReport.template.md'),
  };
}

function validateReadme(readmePath, errors) {
  const text = readText(readmePath);
  const snippets = [
    '# testing-unit',
    '## 固定流程',
    '## 狀態與狀態機',
    '## 輸入規則',
    '## Fail-fast 與路由',
    '/workflow-testing-unit',
    '/subworkflow-unit-genscript-vitest',
    '/subworkflow-unit-execute-jest',
    'testing-artifacts/unit/WORKFLOW-RUN-REPORT.md',
    '.opencode/template/testing-unit/',
    'node testing-unit/scripts/verify-workflow-dev.mjs',
    'node testing-unit/scripts/verify-workflow.mjs',
    'node testing-unit/scripts/verify-workflow-sync.mjs',
  ];

  for (const snippet of snippets) {
    assertIncludes(text, snippet, 'README.md', errors);
  }
}

function validateRunReportTemplate(runReportTemplatePath, errors) {
  const text = readText(runReportTemplatePath);
  const sections = [
    '## 中繼資料',
    '## 輸入',
    '## 分類',
    '## 阻塞問題',
    '## 產物',
    '## 檢查清單',
    '## 備註',
    '## 下一步',
  ];

  for (const section of sections) {
    assertIncludes(text, section, 'RunReport.template.md', errors);
  }

  for (const line of checklistLines) {
    assertIncludes(text, line, 'RunReport.template.md', errors);
  }

  const snippets = [
    '- WorkflowType: unit',
    '- Status: NEW',
    '- Current Step: Step 0',
    '- Current State: PRECHECK',
    '- Final Status:',
    '- InputSnapshot: scope/srcPath/artifactDir/testPathVitest/testPathJest/preferredRunner/packageManager/siteUrl/devDocsPath',
    '- BlockerType: none',
    '## 階段結果',
    '- Artifact Root: testing-artifacts/unit/',
    '- Input Summary: testing-artifacts/unit/INPUT-SUMMARY.md',
    '- Test Report: testing-artifacts/unit/TEST-REPORT.md',
  ];

  for (const snippet of snippets) {
    assertIncludes(text, snippet, 'RunReport.template.md', errors);
  }
}

function validateTemplateCatalog(templateDir, rootLabel, errors) {
  for (const fileName of templateFiles) {
    const filePath = path.join(templateDir, fileName);
    if (!fs.existsSync(filePath)) {
      errors.push(`template missing -> ${rootLabel}/template/${fileName}`);
      continue;
    }

    const text = readText(filePath);
    if (!text.trim()) {
      errors.push(`template empty -> ${rootLabel}/template/${fileName}`);
    }
  }
}

function validateTemplateSnippets(paths, errors) {
  const checks = [
    {
      fileName: 'InputSummary.template.md',
      snippets: [
        '- Scope:',
        '- Src Path Status: provided | default(src->workspace-root)',
        '- Artifact Dir Status: provided | default(testing-artifacts/unit)',
        '- Preferred Runner Status: provided | default(auto)',
      ],
    },
    {
      fileName: 'StackClassification.template.md',
      snippets: [
        '## 證據',
        '| Signal Type | Evidence | Weight | Notes |',
        '- Runner Route: vitest | jest | hybrid | blocked',
      ],
    },
    {
      fileName: 'TestScriptReport.template.md',
      snippets: [
        '| Case ID | Runner | Script Path | Status | Notes |',
        '- Vitest Script Count:',
        '- Jest Script Count:',
      ],
    },
    {
      fileName: 'ExecutionSummary.template.md',
      snippets: [
        '| Runner | Executed | Passed | Failed | Skipped | Status | Evidence |',
        '| Case ID | Runner | Status | Key Assertion | Error Summary | Evidence |',
      ],
    },
    {
      fileName: 'TestReport.template.md',
      snippets: [
        '- WorkflowType: unit',
        '| Case ID | Runner | Status | Key Assertion | Failure Reason | Evidence |',
      ],
    },
  ];

  for (const check of checks) {
    const filePath = path.join(paths.templateDir, check.fileName);
    const text = readText(filePath);
    for (const snippet of check.snippets) {
      assertIncludes(text, snippet, check.fileName, errors);
    }
  }
}

function validateCommands(paths, errors) {
  for (const fileName of commandFiles) {
    const filePath = path.join(paths.commandDir, fileName);
    assertFileExists(filePath, 'command', errors);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const text = readText(filePath);
    assertIncludes(text, 'testing-artifacts/unit/WORKFLOW-RUN-REPORT.md', fileName, errors);
  }

  const workflowMainPath = path.join(paths.commandDir, 'workflow-testing-unit.md');
  if (fs.existsSync(workflowMainPath)) {
    const workflowMain = readText(workflowMainPath);
    const mainSnippets = [
      '固定流程如下，順序不可變更：',
      '0. 檢查 `testing-artifacts/unit/WORKFLOW-RUN-REPORT.md` 狀態',
      '1. 檢查輸入資訊',
      '2. 與使用者問答補充輸入資訊',
      '3. 分析文件與原始碼',
      '4. 歸類技術棧與 runner 路由',
      '5. 依路由產生測試腳本',
      '6. 依路由執行測試腳本',
      '7. 產出總結報告',
      '- Step 1-2：`/subworkflow-unit-input`',
      '- Step 5：`/subworkflow-unit-genscript`',
      '- Step 6：`/subworkflow-unit-execute`',
      '決策表（Fail-fast / 路由）：',
      '若 Step 3 後缺 `TEST-PLAN.md` 或 `TEST-CASES.md` 或 `ACCEPTANCE-CRITERIA.md` -> 回到 Step 3',
    ];

    for (const snippet of mainSnippets) {
      assertIncludes(workflowMain, snippet, 'workflow-testing-unit.md', errors);
    }
  }

  const adapterChecks = [
    {
      fileName: 'subworkflow-unit-execute-vitest.md',
      snippets: [
        '執行前必須先檢查 `test_path_vitest` 下是否存在可執行測試檔',
        '若 `test_path_vitest` 不存在且其來源為 `provided`：轉 `BLOCKED`（`test-asset`）',
      ],
    },
    {
      fileName: 'subworkflow-unit-execute-jest.md',
      snippets: [
        '執行前必須先檢查 `test_path_jest` 下是否存在可執行測試檔',
        '若 `test_path_jest` 不存在且其來源為 `provided`：轉 `BLOCKED`（`test-asset`）',
      ],
    },
  ];

  for (const check of adapterChecks) {
    const filePath = path.join(paths.commandDir, check.fileName);
    if (!fs.existsSync(filePath)) {
      continue;
    }
    const text = readText(filePath);
    for (const snippet of check.snippets) {
      assertIncludes(text, snippet, check.fileName, errors);
    }
  }
}

function validateRuntimeMatchesSource(errors) {
  const sourcePaths = getSourcePaths();
  const runtimePaths = getRuntimePaths();

  for (const fileName of commandFiles) {
    assertFilesMatch(
      path.join(sourcePaths.commandDir, fileName),
      path.join(runtimePaths.commandDir, fileName),
      `command sync ${fileName}`,
      errors,
    );
  }

  for (const fileName of templateFiles) {
    assertFilesMatch(
      path.join(sourcePaths.templateDir, fileName),
      path.join(runtimePaths.templateDir, fileName),
      `template sync ${fileName}`,
      errors,
    );
  }
}

export function runWorkflowVerification(mode) {
  const errors = [];

  if (mode === 'dev') {
    const sourcePaths = getSourcePaths();
    validateReadme(sourcePaths.readme, errors);
    validateRunReportTemplate(sourcePaths.runReportTemplate, errors);
    validateTemplateCatalog(sourcePaths.templateDir, 'testing-unit', errors);
    validateTemplateSnippets(sourcePaths, errors);
    validateCommands(sourcePaths, errors);
  } else if (mode === 'runtime') {
    const runtimePaths = getRuntimePaths();
    validateRunReportTemplate(runtimePaths.runReportTemplate, errors);
    validateTemplateCatalog(runtimePaths.templateDir, '.opencode', errors);
    validateTemplateSnippets(runtimePaths, errors);
    validateCommands(runtimePaths, errors);
  } else {
    throw new Error(`Unknown verification mode: ${mode}`);
  }

  return errors;
}

export function runWorkflowSyncVerification() {
  const errors = [];
  validateRuntimeMatchesSource(errors);
  return errors;
}
