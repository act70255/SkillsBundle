import { runWorkflowVerification } from './workflow-verifier-core.mjs';

const errors = runWorkflowVerification('dev');

if (errors.length > 0) {
  console.error('Workflow document validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log('Workflow document validation passed.');
}
