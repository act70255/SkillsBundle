import { runWorkflowVerification } from './workflow-verifier-core.mjs';

const errors = runWorkflowVerification('runtime');

if (errors.length > 0) {
  console.error('Runtime workflow validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log('Runtime workflow validation passed.');
}
