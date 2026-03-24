import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const testingE2eDir = path.join(repoRoot, 'testing-e2e');
const docsFiles = {
  readme: path.join(testingE2eDir, 'README.md'),
  template: path.join(testingE2eDir, 'template', '[WORKFLOW]RunReport.template.md'),
  specMain: path.join(testingE2eDir, 'commands', 'workflow-e2e.md'),
};
const requiredTemplateFiles = [
  '.env.playwright.template',
  '[WORKFLOW]InputSummary.template.md',
  '[WORKFLOW]DocsBaseline.template.md',
  '[WORKFLOW]SiteScanSummary.template.md',
  '[WORKFLOW]ExecutionSummary.template.md',
  '[WORKFLOW]TestPlan.template.md',
  '[WORKFLOW]TestCases.template.md',
  '[WORKFLOW]TestScript.template.ts',
  '[WORKFLOW]TestReport.template.md',
];

const expectedStatuses = ['NEW', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'FAILED'];
const expectedChecklistLines = [
  '- [ ] Step 0 - Check RunReport status',
  '- [ ] Step 1 - Check input information',
  '- [ ] Step 2 - Ask user to complete missing information',
  '- [ ] Step 3 - Read development documents',
  '- [ ] Step 4 - Determine whether login is required',
  '- [ ] Step 5 - Scan pages with Playwright',
  '- [ ] Step 6 - Generate test plan and test scripts',
  '- [ ] Step 7 - Execute test scripts',
  '- [ ] Step 8 - Generate test report',
];
const expectedFlowLines = [
  '0. 檢查 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 狀態',
  '1. 檢查輸入資訊',
  '2. 與使用者問答補充輸入資訊',
  '3. 閱讀開發文件',
  '4. 依文件與輕量 Playwright 探測判定是否需要登入，必要時再向使用者確認',
  '5. 使用 Playwright 依文件掃描站台頁面',
  '6. 產出測試計畫與測試腳本',
  '7. 執行測試腳本',
  '8. 產出測試報告',
];
const expectedTemplateSections = [
  '## 中繼資料',
  '## 輸入',
  '## 驗證',
  '## 阻塞問題',
  '## 產物',
  '## 檢查清單',
  '## 備註',
  '## 下一步',
];

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function assertIncludes(text, snippet, label, errors) {
  if (!text.includes(snippet)) {
    errors.push(`${label}: missing -> ${snippet}`);
  }
}

function validateReadme(errors) {
  const text = readText(docsFiles.readme);
  for (const line of expectedFlowLines) {
    assertIncludes(text, line, 'README.md', errors);
  }
  for (const status of expectedStatuses) {
    assertIncludes(text, `\`${status}\``, 'README.md', errors);
  }
  assertIncludes(text, '## Step 0 規則', 'README.md', errors);
  assertIncludes(text, '.opencode/template/[WORKFLOW]RunReport.template.md', 'README.md', errors);
  assertIncludes(text, '.opencode/template/.env.playwright.template', 'README.md', errors);
  assertIncludes(text, 'testing-artifact/handoff/[WORKFLOW]RunReport.md', 'README.md', errors);
  assertIncludes(text, 'testing-artifact/deliverables/', 'README.md', errors);
  assertIncludes(text, '## Step 4 規則', 'README.md', errors);
  assertIncludes(text, '先看開發文件，再做輕量 Playwright 探測，最後才向使用者確認', 'README.md', errors);
  assertIncludes(text, '## 憑證與 `.env.playwright` 規則', 'README.md', errors);
  assertIncludes(text, 'agent 可以知道憑證檔位置，但不得讀取、展開、轉述或摘要 `.env.playwright` 的實際內容。', 'README.md', errors);
  assertIncludes(text, 'node testing-e2e/scripts/verify-workflow-dev.mjs', 'README.md', errors);
  assertIncludes(text, 'node testing-e2e/scripts/verify-workflow.mjs', 'README.md', errors);
}

function validateRunReportTemplate(errors) {
  const text = readText(docsFiles.template);
  for (const section of expectedTemplateSections) {
    assertIncludes(text, section, '[WORKFLOW]RunReport.template.md', errors);
  }
  for (const line of expectedChecklistLines) {
    assertIncludes(text, line, '[WORKFLOW]RunReport.template.md', errors);
  }
  assertIncludes(text, '- Status: NEW', '[WORKFLOW]RunReport.template.md', errors);
  assertIncludes(text, '- Current Step: Step 0', '[WORKFLOW]RunReport.template.md', errors);
  assertIncludes(text, '- Credential Source: testing-artifact/deliverables/.env.playwright', '[WORKFLOW]RunReport.template.md', errors);
  assertIncludes(text, '- Handoff Root: testing-artifact/handoff/', '[WORKFLOW]RunReport.template.md', errors);
  assertIncludes(text, '- Deliverables Root: testing-artifact/deliverables/', '[WORKFLOW]RunReport.template.md', errors);
  assertIncludes(text, '- Test Script: testing-artifact/scripts/TestScript.ts', '[WORKFLOW]RunReport.template.md', errors);
}

function validateMainCommand(filePath, label, errors) {
  const text = readText(filePath);
  assertIncludes(text, 'Step 0：先檢查 runtime 狀態檔 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 是否存在。', label, errors);
  assertIncludes(text, '- 若存在，再閱讀 `@testing-artifact/handoff/[WORKFLOW]RunReport.md`。', label, errors);
  assertIncludes(text, '- 若不存在，先確認 `testing-artifact/handoff/`、`testing-artifact/deliverables/` 與 `testing-artifact/scripts/` 已建立，再以 `@.opencode/template/[WORKFLOW]RunReport.template.md` 為模板建立 `testing-artifact/handoff/[WORKFLOW]RunReport.md`。', label, errors);
  assertIncludes(text, '0. 檢查 `testing-artifact/handoff/[WORKFLOW]RunReport.md` 狀態', label, errors);
  assertIncludes(text, '- Step 0 必須先決定是「新工作初始化」或「既有工作續跑」。', label, errors);
  assertIncludes(text, '- Step 3 必須先完成開發文件閱讀，整理登入需求、角色限制、受保護頁面、SSO 與重要流程線索。', label, errors);
  assertIncludes(text, '- Step 4 必須先根據 Step 3 的文件結果，再以輕量 Playwright 探測觀察頁面與網路訊號，只有無法明確判定或訊號矛盾時才向使用者確認。', label, errors);
  for (const line of expectedChecklistLines) {
    assertIncludes(text, line, label, errors);
  }
}

function validateSubCommand(fileName, expectedSnippets, errors) {
  const filePath = path.join(testingE2eDir, 'commands', fileName);
  const text = readText(filePath);
  for (const snippet of expectedSnippets) {
    assertIncludes(text, snippet, fileName, errors);
  }
}

function validateTemplateCatalog(errors) {
  for (const fileName of requiredTemplateFiles) {
    const filePath = path.join(testingE2eDir, 'template', fileName);
    if (!fs.existsSync(filePath)) {
      errors.push(`template missing -> testing-e2e/template/${fileName}`);
      continue;
    }
    const text = readText(filePath);
    if (!text.trim()) {
      errors.push(`template empty -> testing-e2e/template/${fileName}`);
    }
  }
}

function main() {
  const errors = [];

  validateReadme(errors);
  validateRunReportTemplate(errors);
  validateMainCommand(docsFiles.specMain, 'testing-e2e/commands/workflow-e2e.md', errors);
  validateTemplateCatalog(errors);
  validateSubCommand('subworkflow-e2e-input.md', ['寫入：`testing-artifact/handoff/[WORKFLOW]InputSummary.md`', '若 1-2 步完成，更新 checklist、`Current Step`、`Notes`、`Last Updated`。'], errors);
  validateSubCommand('subworkflow-e2e-docs.md', ['讀取：`testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/handoff/[WORKFLOW]InputSummary.md`', '寫入：`testing-artifact/handoff/[WORKFLOW]DocsBaseline.md`', '完成 Step 3 後，必須先更新 `testing-artifact/handoff/[WORKFLOW]RunReport.md`，勾選 Step 3 checklist，並將 `Current Step` 推進到 Step 4，再開始登入判定。'], errors);
  validateSubCommand('subworkflow-e2e-scan.md', ['讀取：`testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/handoff/[WORKFLOW]DocsBaseline.md`', '寫入：`testing-artifact/handoff/[WORKFLOW]SiteScanSummary.md`', 'Playwright 必須在執行時自行載入 `testing-artifact/deliverables/.env.playwright`；不得由 agent 先讀取其內容。'], errors);
  validateSubCommand('subworkflow-e2e-generate.md', ['寫入：`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`', 'Step 7 的唯一正式輸入腳本'], errors);
  validateSubCommand('subworkflow-e2e-run.md', ['`testing-artifact/scripts/TestScript.ts` 已存在', '讀取：`testing-artifact/handoff/[WORKFLOW]RunReport.md`、`testing-artifact/deliverables/TestPlan.md`、`testing-artifact/deliverables/TestCases.md`、`testing-artifact/scripts/TestScript.ts`', 'Playwright 必須在執行時自行載入 `testing-artifact/deliverables/.env.playwright`；不得由 agent 先讀取其內容。'], errors);
  validateSubCommand('subworkflow-e2e-report.md', ['寫入：`testing-artifact/deliverables/TestReport.md`'], errors);

  if (errors.length > 0) {
    console.error('Workflow document validation failed:\n');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Workflow document validation passed.');
}

main();
