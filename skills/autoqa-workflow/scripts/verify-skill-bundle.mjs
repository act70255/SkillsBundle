import fs from 'node:fs';
import path from 'node:path';

const skillDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const templatesDir = path.join(skillDir, 'templates');
const errors = [];

const requiredTemplates = [
  'RunReport.template.md',
  'InputSummary.template.md',
  'DocsBaseline.template.md',
  'SrcScanSummary.template.md',
  'SiteScanSummary.template.md',
  'TestPlan.template.md',
  'TestCases.template.md',
  'RequirementTraceability.template.md',
  'TestScript.template.ts',
  'ExecutionSummary.template.md',
  'TestReport.template.md',
  'GenerationReview.template.md',
  '.env.playwright.template',
  'PlaywrightEnvLoader.template.cjs',
];

for (const f of requiredTemplates) {
  const full = path.join(templatesDir, f);
  if (!fs.existsSync(full)) errors.push(`Missing template: ${f}`);
  else if (!fs.readFileSync(full, 'utf8').trim()) errors.push(`Empty template: ${f}`);
}

if (errors.length) {
  console.error('AutoQA skill bundle verification failed:\n');
  for (const e of errors) console.error(`- ${e}`);
  process.exitCode = 1;
} else {
  console.log('AutoQA skill bundle verification passed.');
}
