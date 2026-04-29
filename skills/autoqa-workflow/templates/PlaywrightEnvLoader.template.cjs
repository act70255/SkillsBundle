const fs = require('node:fs');
const path = require('node:path');

const envFilePath = path.resolve(process.cwd(), 'testing-artifact/deliverables/.env.playwright');

if (!fs.existsSync(envFilePath)) {
  throw new Error('Missing testing-artifact/deliverables/.env.playwright');
}

const raw = fs.readFileSync(envFilePath, 'utf8');
const lines = raw.split(/\r?\n/);
const loadedKeys = [];

const requiredKeys = (process.env.WORKFLOW_REQUIRED_ENV_KEYS || 'PLAYWRIGHT_USERNAME,PLAYWRIGHT_PASSWORD')
  .split(',')
  .map((key) => key.trim())
  .filter(Boolean);

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    continue;
  }

  const eqIndex = trimmed.indexOf('=');
  if (eqIndex <= 0) {
    continue;
  }

  const key = trimmed.slice(0, eqIndex).trim();
  if (!key) {
    continue;
  }

  let value = trimmed.slice(eqIndex + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  process.env[key] = value;
  loadedKeys.push(key);
}

const uniqueLoadedKeys = [...new Set(loadedKeys)];
const missingRequiredKeys = requiredKeys.filter((key) => !process.env[key]);

process.env.WORKFLOW_ENV_REQUIRED_KEYS = requiredKeys.join(',');
process.env.WORKFLOW_ENV_KEYS = uniqueLoadedKeys.join(',');
process.env.WORKFLOW_ENV_MISSING_KEYS = missingRequiredKeys.join(',');
process.env.WORKFLOW_ENV_VALIDATION_STATUS = missingRequiredKeys.length === 0 ? 'pass' : 'fail';
