import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const testingE2eDir = path.join(repoRoot, 'testing-e2e');
const runtimeDir = path.join(repoRoot, '.opencode');

const commandFiles = [
  'workflow-e2e.md',
  'subworkflow-e2e-input.md',
  'subworkflow-e2e-docs.md',
  'subworkflow-e2e-scan.md',
  'subworkflow-e2e-generate.md',
  'subworkflow-e2e-run.md',
  'subworkflow-e2e-report.md',
];

const templateFiles = [
  'RunReport.template.md',
  'InputSummary.template.md',
  'DocsBaseline.template.md',
  'SiteScanSummary.template.md',
  'ExecutionSummary.template.md',
  'TestPlan.template.md',
  'TestCases.template.md',
  'TestScript.template.ts',
  'TestReport.template.md',
  '.env.playwright.template',
];

const expectedStatuses = ['NEW', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'FAILED'];
const expectedChecklistLines = [
  '- [ ] Step 0 - Check RunReport status',
  '- [ ] Step 1 - Check input information',
  '- [ ] Step 2 - Ask user to complete missing information',
  '- [ ] Step 3 - Read development documents',
  '- [ ] Step 4 - Determine whether login is required',
  '- [ ] Step 5 - Scan pages with Playwright',
  '- [ ] Step 6 - Generate test plan, cases, and scripts',
  '- [ ] Step 7 - Execute test scripts',
  '- [ ] Step 8 - Generate test report',
];
const expectedFlowLines = [
  '0. 檢查 `testing-artifact/handoff/RunReport.md` 狀態',
  '1. 檢查輸入資訊',
  '2. 與使用者問答補充輸入資訊',
  '3. 閱讀開發文件',
  '4. 依文件與輕量 Playwright 探測判定是否需要登入，必要時再向使用者確認',
  '5. 使用 Playwright 依文件掃描站台頁面',
  '6. 產出測試計畫、測試案例與測試腳本',
  '7. 執行測試腳本',
  '8. 產出測試報告',
];
const expectedRunReportSections = [
  '## 中繼資料',
  '## 輸入',
  '## 驗證',
  '## 阻塞問題',
  '## 產物',
  '## 檢查清單',
  '## 備註',
  '## 下一步',
];

function getSourcePaths() {
  return {
    rootDir: testingE2eDir,
    commandDir: path.join(testingE2eDir, 'commands'),
    templateDir: path.join(testingE2eDir, 'template'),
    readme: path.join(testingE2eDir, 'README.md'),
    specMain: path.join(testingE2eDir, 'commands', 'workflow-e2e.md'),
    runReportTemplate: path.join(testingE2eDir, 'template', 'RunReport.template.md'),
    docsBaselineTemplate: path.join(testingE2eDir, 'template', 'DocsBaseline.template.md'),
    siteScanTemplate: path.join(testingE2eDir, 'template', 'SiteScanSummary.template.md'),
    executionSummaryTemplate: path.join(testingE2eDir, 'template', 'ExecutionSummary.template.md'),
    testPlanTemplate: path.join(testingE2eDir, 'template', 'TestPlan.template.md'),
    testCasesTemplate: path.join(testingE2eDir, 'template', 'TestCases.template.md'),
    testScriptTemplate: path.join(testingE2eDir, 'template', 'TestScript.template.ts'),
    testReportTemplate: path.join(testingE2eDir, 'template', 'TestReport.template.md'),
  };
}

function getRuntimePaths() {
  return {
    rootDir: runtimeDir,
    commandDir: path.join(runtimeDir, 'commands'),
    templateDir: path.join(runtimeDir, 'template'),
    specMain: path.join(runtimeDir, 'commands', 'workflow-e2e.md'),
    runReportTemplate: path.join(runtimeDir, 'template', 'RunReport.template.md'),
    docsBaselineTemplate: path.join(runtimeDir, 'template', 'DocsBaseline.template.md'),
    siteScanTemplate: path.join(runtimeDir, 'template', 'SiteScanSummary.template.md'),
    executionSummaryTemplate: path.join(runtimeDir, 'template', 'ExecutionSummary.template.md'),
    testPlanTemplate: path.join(runtimeDir, 'template', 'TestPlan.template.md'),
    testCasesTemplate: path.join(runtimeDir, 'template', 'TestCases.template.md'),
    testScriptTemplate: path.join(runtimeDir, 'template', 'TestScript.template.ts'),
    testReportTemplate: path.join(runtimeDir, 'template', 'TestReport.template.md'),
  };
}

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
    return;
  }

  const sourceText = readText(sourcePath);
  const targetText = readText(targetPath);
  if (sourceText !== targetText) {
    errors.push(`${label}: content mismatch -> ${targetPath}`);
  }
}

function validateReadme(readmePath, errors) {
  const text = readText(readmePath);

  for (const line of expectedFlowLines) {
    assertIncludes(text, line, 'README.md', errors);
  }

  for (const status of expectedStatuses) {
    assertIncludes(text, `\`${status}\``, 'README.md', errors);
  }

  const snippets = [
    '## Step 0 規則',
    '.opencode/template/RunReport.template.md',
    '.opencode/template/.env.playwright.template',
    'testing-artifact/handoff/RunReport.md',
    'testing-artifact/deliverables/',
    '### 輸入確認規則',
    'Step 2 補齊輸入時必須採用一問一答；一次只問一個欄位。',
    '`source_code_path` 若未提供，必須明確記錄為 `none`。',
    '`playwright_max_depth` 若未提供，必須明確記錄為 `default(3)`。',
    '`playwright_max_pages` 若未提供，必須明確記錄為 `default(20)`。',
    '`playwright_headless` 若未提供，必須明確記錄為 `default(true)`。',
    '## 續跑與停點規則',
    'workflow 預設必須連續執行；若某一步完成且狀態不是 `BLOCKED`、`FAILED`、`DONE`，就必須自動接續下一步。',
    '單純的進度回報不是合法停點；workflow 不得因為某一步完成就等待使用者輸入 `continue`、`確認是否繼續` 或其他批准訊號。',
    '## Step 3 文件基線規則',
    '功能清單、頁面或路由清單、角色與權限矩陣、核心流程、例外流程、商業規則、測試資料或前置條件、環境限制。',
    '## Step 4 規則',
    '先看開發文件，再做輕量 Playwright 探測，最後才向使用者確認',
    '## Step 5 掃站規則',
    'Step 5 必須拿 `testing-artifact/handoff/DocsBaseline.md` 當對照基線',
    '## Step 6 測試設計規則',
    '`TestCases` 必須逐筆記錄來源追溯',
    '`TestScript` 必須以 `TestCases` 為唯一正式來源',
    '## Step 7-8 結果追溯規則',
    '且不可只提供 summary，必須逐項列出每個 case 的結果與證據。',
    '## 憑證與 `.env.playwright` 規則',
    'agent 可以知道憑證檔位置，但不得讀取、展開、轉述或摘要 `.env.playwright` 的實際內容。',
    'node testing-e2e/scripts/verify-workflow-dev.mjs',
    'node testing-e2e/scripts/verify-workflow.mjs',
    'node testing-e2e/scripts/verify-workflow-sync.mjs',
    'runtime 驗證內容包含：`.opencode/commands/` 與 `.opencode/template/` 是否存在必要檔案與關鍵片段；不假設 `testing-e2e/` 與 `.opencode/` 會在正式執行時共存',
    '開發期同步驗證內容包含：`testing-e2e/commands/` 與 `.opencode/commands/`、`testing-e2e/template/` 與 `.opencode/template/` 是否逐檔完全一致',
  ];

  for (const snippet of snippets) {
    assertIncludes(text, snippet, 'README.md', errors);
  }
}

function validateRunReportTemplate(runReportTemplatePath, errors) {
  const text = readText(runReportTemplatePath);

  for (const section of expectedRunReportSections) {
    assertIncludes(text, section, 'RunReport.template.md', errors);
  }

  for (const line of expectedChecklistLines) {
    assertIncludes(text, line, 'RunReport.template.md', errors);
  }

  const snippets = [
    '- Status: NEW',
    '- Current Step: Step 0',
    '- Playwright Max Depth:',
    '- Playwright Max Pages:',
    '- Playwright Headless:',
    '- Credential Source: testing-artifact/deliverables/.env.playwright',
    '- Handoff Root: testing-artifact/handoff/',
    '- Deliverables Root: testing-artifact/deliverables/',
    '- Docs Baseline: testing-artifact/handoff/DocsBaseline.md',
    '- Site Scan Summary: testing-artifact/handoff/SiteScanSummary.md',
    '- Test Plan: testing-artifact/deliverables/TestPlan.md',
    '- Test Cases: testing-artifact/deliverables/TestCases.md',
    '- Test Script: testing-artifact/scripts/TestScript.ts',
    '- Execution Summary: testing-artifact/handoff/ExecutionSummary.md',
    '- Test Report: testing-artifact/deliverables/TestReport.md',
  ];

  for (const snippet of snippets) {
    assertIncludes(text, snippet, 'RunReport.template.md', errors);
  }
}

function validateMainCommand(specMainPath, label, errors) {
  const text = readText(specMainPath);
  const snippets = [
    'Step 0：先檢查 runtime 狀態檔 `testing-artifact/handoff/RunReport.md` 是否存在。',
    '- 若存在，再閱讀 `@testing-artifact/handoff/RunReport.md`。',
    '- 若不存在，先確認 `testing-artifact/handoff/`、`testing-artifact/deliverables/` 與 `testing-artifact/scripts/` 已建立，再以 `@.opencode/template/RunReport.template.md` 為模板建立 `testing-artifact/handoff/RunReport.md`。',
    '0. 檢查 `testing-artifact/handoff/RunReport.md` 狀態',
    '- Step 0 必須先決定是「新工作初始化」或「既有工作續跑」。',
    '- 若缺少資訊，Step 2 必須以一問一答方式逐欄補齊；一次只可確認一個欄位，先問必填，再問選填。',
    '- Step 2 完成前，所有選填欄位都必須明確落成最終狀態：`source_code_path` = 實際值或 `none`；`playwright_max_depth` = 實際值或 `default(3)`；`playwright_max_pages` = 實際值或 `default(20)`；`playwright_headless` = 實際值或 `default(true)`。',
    '- Step 3 必須先完成開發文件閱讀，整理功能清單、頁面或路由清單、登入需求、角色限制、受保護頁面、SSO、核心流程、例外流程、商業規則、前置資料與可觀測測試線索。',
    '- Step 4 必須先根據 Step 3 的文件結果，再以輕量 Playwright 探測觀察頁面與網路訊號，只有無法明確判定或訊號矛盾時才向使用者確認。',
    '- Step 5 必須以 `testing-artifact/handoff/DocsBaseline.md` 為對照基線',
    '- Step 6 的測試案例必須逐筆具備來源追溯',
    '- Step 6 的測試腳本必須對應 case ID、包含明確 assertion，且不可只保留 `goto` 或 URL smoke check。',
    '- 若某一步已完成，且 `Status` 不是 `BLOCKED`、`FAILED`、`DONE`，主 workflow 必須依 `Current Step` 立即進入下一步，不得停下等待使用者輸入 `continue`、`確認是否繼續` 或其他批准訊號。',
    '- 若子流程只處理單一步驟，完成後控制權必須回到主 workflow，由主 workflow 自動接續下一步，不得把是否繼續交給使用者決定。',
  ];

  for (const snippet of snippets) {
    assertIncludes(text, snippet, label, errors);
  }

  for (const line of expectedChecklistLines) {
    assertIncludes(text, line, label, errors);
  }
}

function validateCommandFile(commandDir, fileName, expectedSnippets, errors) {
  const filePath = path.join(commandDir, fileName);
  const text = readText(filePath);

  for (const snippet of expectedSnippets) {
    assertIncludes(text, snippet, fileName, errors);
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
  const expectations = [
    {
      filePath: path.join(paths.templateDir, 'InputSummary.template.md'),
      label: 'InputSummary.template.md',
      snippets: [
        '- Source Code Path Value:',
        '- Source Code Path Status: provided | none',
        '- Playwright Max Depth Value:',
        '- Playwright Max Depth Status: provided | default(3)',
        '- Playwright Max Pages Value:',
        '- Playwright Max Pages Status: provided | default(20)',
        '- Playwright Headless Value:',
        '- Playwright Headless Status: provided | default(true)',
        '- Question Mode: one-question-at-a-time',
        '- Optional Fields Resolved:',
        '- Defaults Applied:',
      ],
    },
    {
      filePath: paths.docsBaselineTemplate,
      label: 'DocsBaseline.template.md',
      snippets: [
        '## 功能與頁面盤點',
        '- Feature Inventory:',
        '- Page / Route Inventory:',
        '## 角色與存取',
        '- Roles / Permissions Matrix:',
        '- Protected Areas:',
        '## 核心流程與規則',
        '- Core Flows:',
        '- Exception Flows:',
        '- Business Rules:',
        '- Test Data / Preconditions:',
        '## 測試線索',
        '- Observable UI Signals:',
        '- Network / API Clues:',
        '- Automation Targets:',
        '- Known Risks / Constraints:',
        '## 開放問題',
        '- Open Questions:',
      ],
    },
    {
      filePath: paths.siteScanTemplate,
      label: 'SiteScanSummary.template.md',
      snippets: [
        '- Baseline Reference: testing-artifact/handoff/DocsBaseline.md',
        '- Playwright Max Depth Used:',
        '- Playwright Max Pages Used:',
        '- Playwright Headless Used:',
        '- Unexpected Pages:',
        '## 自動化測試線索',
        '- Candidate Test Targets:',
        '- Stable Selectors / Signals:',
        '- Risky or Unstable Areas:',
        '- Required Test Data / State:',
      ],
    },
    {
      filePath: paths.executionSummaryTemplate,
      label: 'ExecutionSummary.template.md',
      snippets: [
        '- Executed Case IDs:',
        '- Not Executed Case IDs:',
        '- Blocked:',
        '## 案例逐項結果',
        '| Case ID | Status | Key Assertions | Error Summary | Evidence |',
      ],
    },
    {
      filePath: paths.testPlanTemplate,
      label: 'TestPlan.template.md',
      snippets: [
        '## 測試資料與環境依賴',
        '- Test Data Strategy:',
        '- External Dependencies:',
        '## 覆蓋策略',
        '- Flow Coverage Rules:',
        '- Prioritization:',
        '## 追溯對應',
        '- Source Documents:',
        '- Site Scan References:',
        '- Covered Risks:',
        '## 完成定義',
        '- Exit Criteria:',
      ],
    },
    {
      filePath: paths.testCasesTemplate,
      label: 'TestCases.template.md',
      snippets: [
        '| Case ID | Source Ref | Flow Type | Preconditions | Steps | Assertions | Expected Result | Priority |',
        '| TC-001 | Docs: / Scan: | happy-path |  |  |  |  | high |',
        '- Covered Risks:',
      ],
    },
    {
      filePath: paths.testScriptTemplate,
      label: 'TestScript.template.ts',
      snippets: [
        "import { test, expect, type Page } from '@playwright/test';",
        'function getBaseUrl(): string {',
        'async function openEntryPage(page: Page): Promise<void> {',
        'test.beforeEach(async ({ page }) => {',
        "test('TC-001 replace with documented happy path'",
        "test('TC-002 replace with documented negative or boundary path'",
        "await expect(page.locator('body')).toBeVisible();",
      ],
    },
    {
      filePath: paths.testReportTemplate,
      label: 'TestReport.template.md',
      snippets: [
        '- Blocked Scope:',
        '- Skipped:',
        '## 測試案例逐項結果',
        '| Case ID | Case Title / Goal | Status | Key Assertions | Failure Reason | Evidence |',
        '## 追溯對應',
        '- Related Plan Sections:',
        '- Related Case IDs:',
        '- Document / Scan Gaps:',
        '## 未覆蓋與阻塞明細',
        '- Not Covered Case IDs:',
        '- Blocked Case IDs:',
      ],
    },
  ];

  for (const expectation of expectations) {
    const text = readText(expectation.filePath);
    for (const snippet of expectation.snippets) {
      assertIncludes(text, snippet, expectation.label, errors);
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
    assertIncludes(text, 'testing-artifact/handoff/RunReport.md', fileName, errors);
  }

  validateMainCommand(paths.specMain, `${path.basename(paths.rootDir)}/commands/workflow-e2e.md`, errors);
  validateCommandFile(
    paths.commandDir,
    'subworkflow-e2e-input.md',
    [
      '寫入：`testing-artifact/handoff/InputSummary.md`',
      'Step 2 必須採用一問一答；一次只可問一個欄位。',
      '提問順序固定為：先補齊所有必填欄位，再處理選填欄位。',
      '必填欄位補齊後，先統一說明所有選填欄位與其預設值，並只問一題：「是否需要調整任何選填欄位？」',
      '若使用者回覆不需調整，直接帶入所有選填欄位的預設值/約定值，無需逐欄追問。',
      '若使用者回覆需要調整，僅針對需調整的選填欄位逐一一問一答確認。',
      '`source_code_path` 若未提供，必須由使用者明確確認為 `none`。',
      '`playwright_max_depth` 若未提供，必須由使用者明確確認為 `default(3)`。',
      '`playwright_max_pages` 若未提供，必須由使用者明確確認為 `default(20)`。',
      '`playwright_headless` 若未提供，必須由使用者明確確認為 `default(true)`。',
      '在 Step 2 結束前，`testing-artifact/handoff/InputSummary.md` 內不得保留意義不明的空白選填欄位。',
      '若 1-2 步完成，更新 checklist、`Current Step`、`Notes`、`Last Updated`。',
    ],
    errors,
  );
  validateCommandFile(
    paths.commandDir,
    'subworkflow-e2e-docs.md',
    [
      '讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/InputSummary.md`',
      '寫入：`testing-artifact/handoff/DocsBaseline.md`',
      'Step 3 的文件整理必須至少涵蓋：功能清單、頁面或路由清單、角色與權限矩陣、核心流程、例外流程、商業規則、測試資料或前置條件、環境限制、可觀測 UI 或 API 線索。',
      '完成 Step 3 後，必須先更新 `testing-artifact/handoff/RunReport.md`，勾選 Step 3 checklist，並將 `Current Step` 推進到 Step 4，再開始登入判定。',
    ],
    errors,
  );
  validateCommandFile(
    paths.commandDir,
    'subworkflow-e2e-scan.md',
    [
      '讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/DocsBaseline.md`',
      '寫入：`testing-artifact/handoff/SiteScanSummary.md`',
      'Playwright 必須在執行時自行載入 `testing-artifact/deliverables/.env.playwright`；不得由 agent 先讀取其內容。',
      '掃描時要以 `testing-artifact/handoff/DocsBaseline.md` 為基線，記錄預期頁面與流程是否真的可達。',
      'Step 5 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 6。',
      '不得在 Step 5 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。',
    ],
    errors,
  );
  validateCommandFile(
    paths.commandDir,
    'subworkflow-e2e-generate.md',
    [
      '寫入：`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`',
      '測試案例必須逐筆具備來源追溯',
      '測試腳本必須對應 case ID、使用 `test.describe(...)` 組織案例、抽出必要的共用前置步驟，並包含明確 assertion，不可只保留 `goto` 或 URL smoke check。',
      'Step 6 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 7。',
      '不得在 Step 6 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。',
    ],
    errors,
  );
  validateCommandFile(
    paths.commandDir,
    'subworkflow-e2e-run.md',
    [
      '`testing-artifact/scripts/TestScript.ts` 已存在',
      '讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`',
      '執行後需整理成功、失敗、跳過、主要錯誤原因，並標示對應 case ID。',
      'Step 7 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 8。',
      '不得在 Step 7 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。',
    ],
    errors,
  );
  validateCommandFile(
    paths.commandDir,
    'subworkflow-e2e-report.md',
    [
      '寫入：`testing-artifact/deliverables/TestReport.md`',
      '讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/ExecutionSummary.md`、`testing-artifact/handoff/ExecutionRaw.json`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`',
      '報告需回扣 `TestPlan`、`TestCases` 與 `ExecutionSummary`，保留案例追溯與文件差異造成的風險說明。',
      '`TestReport.md` 不可只提供 summary；必須新增「測試案例逐項結果」段落',
      '若 `ExecutionSummary.md` 無法提供完整逐項細節，必須改以 `testing-artifact/handoff/ExecutionRaw.json` 補齊每個 case 的結果，再回填到 `TestReport.md`。',
      'Step 8 完成後應直接以 `DONE` 結束 workflow，不得再要求使用者輸入 `continue` 或其他批准訊號。',
      'Step 8 完成並進入 `DONE` 時，回覆必須直接提供測試總結結果，至少包含：整體結果、Passed / Failed / Blocked / Skipped 摘要、主要失敗原因、未覆蓋範圍、殘餘風險，以及 `testing-artifact/deliverables/TestReport.md` 與 `testing-artifact/handoff/ExecutionSummary.md` 路徑。',
    ],
    errors,
  );
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
    validateTemplateCatalog(sourcePaths.templateDir, 'testing-e2e', errors);
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
