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
  'subworkflow-e2e-src.md',
  'subworkflow-e2e-auth.md',
  'subworkflow-e2e-scan.md',
  'subworkflow-e2e-generate.md',
  'subworkflow-e2e-run.md',
  'subworkflow-e2e-report.md',
];

const templateFiles = [
  'RunReport.template.md',
  'InputSummary.template.md',
  'DocsBaseline.template.md',
  'SrcScanSummary.template.md',
  'SiteScanSummary.template.md',
  'ExecutionSummary.template.md',
  'TestPlan.template.md',
  'TestCases.template.md',
  'TestScript.template.ts',
  'TestReport.template.md',
  '.env.playwright.template',
  'PlaywrightEnvLoader.template.cjs',
];

const expectedStatuses = ['NEW', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'FAILED'];
const expectedChecklistLines = [
  '- [ ] Step 0 - Check RunReport status',
  '- [ ] Step 1 - Check input information',
  '- [ ] Step 2 - Ask user to complete missing information',
  '- [ ] Step 3 - Read development documents',
  '- [ ] Step 4 - Scan source code path when provided',
  '- [ ] Step 5 - Determine whether login is required',
  '- [ ] Step 6 - Scan pages with Playwright',
  '- [ ] Step 7 - Generate test plan, cases, and scripts',
  '- [ ] Step 8 - Execute test scripts',
  '- [ ] Step 9 - Generate test report',
];
const expectedFlowLines = [
  '0. 檢查 `testing-artifact/handoff/RunReport.md` 狀態',
  '1. 檢查輸入資訊',
  '2. 與使用者問答補充輸入資訊',
  '3. 閱讀開發文件',
  '4. 掃描 `source_code_path` 內的 SRC（若有提供）',
  '5. 依文件、SRC 與輕量 Playwright 探測判定是否需要登入，必要時再向使用者確認',
  '6. 使用 Playwright 依文件掃描站台頁面',
  '7. 產出測試計畫、測試案例與測試腳本',
  '8. 執行測試腳本',
  '9. 產出測試報告',
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
    srcScanTemplate: path.join(testingE2eDir, 'template', 'SrcScanSummary.template.md'),
    siteScanTemplate: path.join(testingE2eDir, 'template', 'SiteScanSummary.template.md'),
    executionSummaryTemplate: path.join(testingE2eDir, 'template', 'ExecutionSummary.template.md'),
    testPlanTemplate: path.join(testingE2eDir, 'template', 'TestPlan.template.md'),
    testCasesTemplate: path.join(testingE2eDir, 'template', 'TestCases.template.md'),
    testScriptTemplate: path.join(testingE2eDir, 'template', 'TestScript.template.ts'),
    testReportTemplate: path.join(testingE2eDir, 'template', 'TestReport.template.md'),
    playwrightEnvLoaderTemplate: path.join(testingE2eDir, 'template', 'PlaywrightEnvLoader.template.cjs'),
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
    srcScanTemplate: path.join(runtimeDir, 'template', 'SrcScanSummary.template.md'),
    siteScanTemplate: path.join(runtimeDir, 'template', 'SiteScanSummary.template.md'),
    executionSummaryTemplate: path.join(runtimeDir, 'template', 'ExecutionSummary.template.md'),
    testPlanTemplate: path.join(runtimeDir, 'template', 'TestPlan.template.md'),
    testCasesTemplate: path.join(runtimeDir, 'template', 'TestCases.template.md'),
    testScriptTemplate: path.join(runtimeDir, 'template', 'TestScript.template.ts'),
    testReportTemplate: path.join(runtimeDir, 'template', 'TestReport.template.md'),
    playwrightEnvLoaderTemplate: path.join(runtimeDir, 'template', 'PlaywrightEnvLoader.template.cjs'),
  };
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
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
    '.opencode/template/SrcScanSummary.template.md',
    '.opencode/template/.env.playwright.template',
    '.opencode/template/PlaywrightEnvLoader.template.cjs',
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
    'Step 4 只負責 SRC 掃描，不負責登入需求的最終判定。',
    '## Step 5 規則',
    '先看開發文件，再看 SRC 掃描，再做輕量 Playwright 探測，最後才向使用者確認。',
    '若判定 `Requires Login = true`，必須在 `RunReport` 回寫 `Env Validation Status (Last Check): pending_auth_validation`，並立刻委派 `/subworkflow-e2e-auth`。',
    '## Step 6 掃站規則',
    'Step 6 必須拿 `testing-artifact/handoff/DocsBaseline.md` 當對照基線',
    '## Step 7 測試設計規則',
    '`TestCases` 必須逐筆記錄來源追溯',
    '`negative + boundary + permission` 案例總數不得少於 `happy path` 案例總數',
    '`TestScript` 必須以 `TestCases` 為唯一正式來源',
    '## Step 8-9 結果追溯規則',
    '且不可只提供 summary，必須逐項列出每個 case 的結果與證據。',
    '## 憑證與 `.env.playwright` 規則',
    '測試入口 URL 來源為 `testing-artifact/handoff/RunReport.md` 內的 `Target URL`。',
    'Step 5 判定與 Step 8 執行需使用同一個 CJS preload loader',
    'testing-artifact/scripts/playwright-env-loader.cjs` 的責任只有載入 `.env.playwright` 並輸出 required / loaded / missing key metadata',
    'pending_auth_validation',
    'not_required',
    'Env Loaded Keys (Last Check)',
    'Env Missing Required Keys (Last Check)',
    'Env Validation Status (Last Check)',
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
    '- Env Required Keys (Default): PLAYWRIGHT_USERNAME,PLAYWRIGHT_PASSWORD',
    '- Env Added Keys (This Run): none',
    '- Env Loaded Keys (Last Check):',
    '- Env Missing Required Keys (Last Check):',
    '- Env Validation Status (Last Check): not_checked',
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
    '- Step 4 必須檢查 `source_code_path`：若為 `none`，明確記錄為 skipped 並直接進入 Step 5；若有提供則掃描 SRC，整理路由、權限、驗證規則、流程分支、測試資料線索與可自動化節點。',
    '測試入口 URL 來源為 `RunReport` 的 `Target URL`。',
    '主 workflow 必須在 Step 5 內立即呼叫 `/subworkflow-e2e-auth`。',
    '`/subworkflow-e2e-auth` 負責 `.env.playwright`、loader、登入驗證與相關 `BLOCKED` 規則；主 workflow 只負責決定何時呼叫，以及呼叫後如何推進或停止。',
    '主 workflow 恢復執行時必須直接接續 `/subworkflow-e2e-auth`，不得重做 Step 3-4 或重新判定登入需求。',
    '若 `/subworkflow-e2e-auth` 在 Step 5 內未回寫可用結果，workflow 必須保持 `Current Step: Step 5` 並停止。',
    '若 Step 8 需要登入，必須在執行測試前再次使用 `/subworkflow-e2e-auth` 做最後一次登入條件驗證；只有當 `/subworkflow-e2e-auth` 回寫可用結果後，Step 8 才可繼續執行測試。',
    '若 `/subworkflow-e2e-auth` 在 Step 8 內未回寫可用結果，workflow 必須保持 `Current Step: Step 8` 並停止。',
    '- Step 6 必須以 `testing-artifact/handoff/DocsBaseline.md` 為對照基線',
    '- Step 7 的測試案例必須逐筆具備來源追溯',
    '- Step 7 的測試腳本必須對應 case ID、包含明確 assertion，且不可只保留 `goto` 或 URL smoke check。',
    '- 若已識別驗證規則、權限限制、條件分支或邊界條件，`negative + boundary + permission` 案例總數不得少於 `happy path` 案例總數。',
    '步驟對應子流程（dispatch mapping）：',
    '- Step 0：由主 workflow 直接處理（不委派子流程）',
    '- Step 1-2：`/subworkflow-e2e-input`',
    '- Step 3：`/subworkflow-e2e-docs`',
    '- Step 4：`/subworkflow-e2e-src`',
    '- Step 5：`/subworkflow-e2e-docs`',
    'Auth helper（僅在 Step 5 或 Step 8 且 `Requires Login = true` 時於步驟內呼叫，不佔用獨立 checklist step）：`/subworkflow-e2e-auth`',
    '- Step 6：`/subworkflow-e2e-scan`',
    '- Step 7：`/subworkflow-e2e-generate`',
    '- Step 8：`/subworkflow-e2e-run`',
    '- Step 9：`/subworkflow-e2e-report`',
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
      filePath: paths.srcScanTemplate,
      label: 'SrcScanSummary.template.md',
      snippets: [
        '- Source Code Path:',
        '- Scan Status: scanned | skipped',
        '- Baseline Reference: testing-artifact/handoff/DocsBaseline.md',
        '## 程式碼盤點',
        '- Route / Page Mapping:',
        '- Auth / Permission Logic:',
        '- Validation Rules:',
        '## 結果條列',
        '- [R-001] Type: route | auth | validation | flow | error | test-clue',
        '## 測試線索',
        '- Automation Candidates:',
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
        '## 頁面逐項紀錄',
        '| Page ID | Page Name | URL / Route | Reachability | Auth / Role | Entry Path | Key UI / Action | Doc Match | Automation Candidate | Notes / Risk |',
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
        '- Negative Coverage Requirement: 每個 critical flow 至少 1 筆 negative 或 boundary；若存在權限限制，至少 1 筆 permission。',
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
        '| TC-002 | Docs: / Scan: | negative |  |  |  |  | high |',
        '## 覆蓋統計（必填）',
        '- Flow Type Counts: happy-path= ; negative= ; boundary= ; permission=',
        '- Coverage Rule Check: non-happy(happy-path 以外) >= happy-path（若已識別驗證/權限/分支/邊界訊號）',
        '- Critical Flow Mapping: CF-001 -> [TC- ], CF-002 -> [TC- ]',
        '## 追蹤對應',
        '| Trace Type | Reference | Related Case IDs | Notes |',
        '| Source Document |  | TC- |  |',
        '| Source Code Scan Reference |  | TC- |  |',
        '| Related Page / Route |  | TC- |  |',
        '| Risk ID | Risk Description | Related Case IDs | Coverage Status |',
        '| R-001 |  | TC- | covered |',
      ],
    },
    {
      filePath: paths.testScriptTemplate,
      label: 'TestScript.template.ts',
      snippets: [
        "import { test, expect, type Page } from '@playwright/test';",
        'function getBaseUrl(): string {',
        "const runReportPath = path.resolve(process.cwd(), 'testing-artifact/handoff/RunReport.md');",
        "throw new Error('Missing Target URL in RunReport');",
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
    {
      filePath: paths.playwrightEnvLoaderTemplate,
      label: 'PlaywrightEnvLoader.template.cjs',
      snippets: [
        "const fs = require('node:fs');",
        "const envFilePath = path.resolve(process.cwd(), 'testing-artifact/deliverables/.env.playwright');",
        'process.env[key] = value;',
        'process.env.WORKFLOW_ENV_REQUIRED_KEYS = requiredKeys.join(',
        'process.env.WORKFLOW_ENV_KEYS = uniqueLoadedKeys.join(',
        "process.env.WORKFLOW_ENV_VALIDATION_STATUS = missingRequiredKeys.length === 0 ? 'pass' : 'fail';",
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
      'Step 3 必須閱讀 `dev_docs_path` 內的開發文件，整理功能清單、頁面或路由清單、角色與權限矩陣、核心流程、例外流程、商業規則、測試資料或前置條件、環境限制、可觀測 UI 或 API 線索。',
      'Step 3 完成後，必須先更新 `testing-artifact/handoff/RunReport.md`，勾選 Step 3 checklist，並將 `Current Step` 推進到 Step 4 後停止，控制權回主 workflow。',
      '若 `RunReport` 已記錄 `Requires Login: true` 且 Step 5 checklist 尚未完成',
      '入口 URL 來源為 `RunReport` 的 `Target URL`',
      '若判定 `Requires Login = false`',
      '`Env Validation Status (Last Check): pending_auth_validation`',
      '不得建立 `.env.playwright`、不得建立 loader、不得自行執行登入驗證。',
    ],
    errors,
  );
  validateCommandFile(
    paths.commandDir,
    'subworkflow-e2e-src.md',
    [
      '讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/handoff/InputSummary.md`、`testing-artifact/handoff/DocsBaseline.md`',
      '寫入：`testing-artifact/handoff/SrcScanSummary.md`',
      '若 `source_code_path` 為 `none`，必須在 `SrcScanSummary.md` 明確記錄 skipped 與原因，並仍視為 Step 4 完成。',
      '若 `source_code_path` 有提供，必須掃描並至少整理：路由或頁面對應、角色或權限判斷邏輯、驗證規則、核心流程分支、錯誤處理、測試資料線索、可自動化測試節點。',
      'Step 4 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 5。',
    ],
    errors,
  );
  validateCommandFile(
    paths.commandDir,
    'subworkflow-e2e-auth.md',
    [
      '此子流程沒有獨立的 checklist step',
      '`Current Step` 為 `Step 5` 或 `Step 8`',
      '需要時建立：`testing-artifact/deliverables/.env.playwright`、`testing-artifact/scripts/playwright-env-loader.cjs`',
      '處理順序固定如下，不得跳步：',
      '第 1 步：若 `testing-artifact/deliverables/.env.playwright` 不存在',
      '第 2 步：required keys 檢查必須使用 CJS preload loader',
      '第 2 步：若缺少 required keys，必須把缺少的 key 以 `KEY=` 形式補進 `testing-artifact/deliverables/.env.playwright`',
      '第 3 步：只有當 missing required keys 為空時，才可使用同一個 CJS preload loader 執行登入可用性驗證。',
      '若登入驗證失敗，必須優先區分為 `missing required key`、`invalid credential / permission issue`、或 `auth flow failure`；不得一律模糊寫成缺 key。',
      '第 2 步：必須回寫 `RunReport`：`Env Loaded Keys (Last Check)`、`Env Missing Required Keys (Last Check)`、`Env Validation Status (Last Check)`。',
      '成功時只回寫驗證結果，不得自行勾選 checklist，也不得自行把 `Current Step` 推進到下一步；後續控制權必須回到呼叫端。',
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
      '主 workflow 已在 Step 5 內完成 `/subworkflow-e2e-auth` 驗證',
      '掃描時要以 `testing-artifact/handoff/DocsBaseline.md` 為基線，並參考 `testing-artifact/handoff/SrcScanSummary.md`，記錄預期頁面與流程是否真的可達。',
      '`testing-artifact/handoff/SiteScanSummary.md` 需包含「頁面逐項紀錄」，逐頁記錄至少：Page ID、Page Name、URL / Route、Reachability、Auth / Role、Entry Path、Key UI / Action、Doc Match、Automation Candidate、Notes / Risk。',
      'Step 6 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 7。',
      '不得在 Step 6 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。',
    ],
    errors,
  );
  validateCommandFile(
    paths.commandDir,
    'subworkflow-e2e-generate.md',
    [
      '寫入：`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`',
      '測試案例必須逐筆具備來源追溯',
      '若已識別驗證規則、權限限制、條件分支或邊界條件，`negative + boundary + permission` 案例總數不得少於 `happy path` 案例總數。',
      '若目前資訊未識別上述訊號，仍至少要有 1 筆 negative 或 boundary 案例，避免只留下純正向 smoke 測試。',
      '`testing-artifact/deliverables/TestCases.md` 必須填寫「覆蓋統計（必填）」段落，列出各 flow type 的案例數與 critical flow 對應覆蓋。',
      '測試腳本必須對應 case ID、使用 `test.describe(...)` 組織案例、抽出必要的共用前置步驟，並包含明確 assertion，不可只保留 `goto` 或 URL smoke check。',
      'Step 7 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 8。',
      '不得在 Step 7 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。',
    ],
    errors,
  );
  validateCommandFile(
    paths.commandDir,
    'subworkflow-e2e-run.md',
    [
      '`testing-artifact/scripts/TestScript.ts` 已存在',
      '讀取：`testing-artifact/handoff/RunReport.md`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`',
      '測試入口 URL 來源為 `RunReport` 的 `Target URL`。',
      '執行測試前必須先呼叫 `/subworkflow-e2e-auth`',
      '若需要登入，必須使用 CJS preload 執行測試：`node -r testing-artifact/scripts/playwright-env-loader.cjs ...`。',
      '必須將 loader 產生的 key-level metadata 回寫到 `RunReport`',
      'Step 8 使用的 loader 機制必須與 Step 5 `/subworkflow-e2e-auth` 驗證一致',
      '執行後需整理成功、失敗、跳過、主要錯誤原因，並標示對應 case ID。',
      'Step 8 若成功完成且未進入 `BLOCKED` 或 `FAILED`，控制權必須回到主 workflow，並由主 workflow 直接進入 Step 9。',
      '不得在 Step 8 完成後要求使用者輸入 `continue` 或其他批准訊號；只有命中合法停點時才可停止。',
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
      'Step 9 完成後應直接以 `DONE` 結束 workflow，不得再要求使用者輸入 `continue` 或其他批准訊號。',
      'Step 9 完成並進入 `DONE` 時，回覆必須直接提供測試總結結果，至少包含：整體結果、Passed / Failed / Blocked / Skipped 摘要、主要失敗原因、未覆蓋範圍、殘餘風險，以及 `testing-artifact/deliverables/TestReport.md` 與 `testing-artifact/handoff/ExecutionSummary.md` 路徑。',
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
