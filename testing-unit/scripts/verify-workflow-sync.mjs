import { runWorkflowSyncVerification } from './workflow-verifier-core.mjs';

const errors = runWorkflowSyncVerification();

if (errors.length > 0) {
  console.error('Workflow sync validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log('Workflow sync validation passed.');
}
