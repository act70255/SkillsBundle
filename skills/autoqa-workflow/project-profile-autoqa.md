# AutoQA Project Profile

> Source of truth: autoqa-project-profile-autoqa/SKILL.md — keep in sync when updating standalone skill.

## Required inputs
- target_url
- dev_docs_path

## Optional defaults
- source_code_path: none
- playwright_max_depth: 3
- playwright_max_pages: 20
- playwright_headless: true

## Artifact contract
- Handoff root: testing-artifact/handoff/
- Deliverables root: testing-artifact/deliverables/
- Scripts root: testing-artifact/scripts/

## Auth contract
- env file: testing-artifact/deliverables/.env.playwright
- loader file: testing-artifact/scripts/playwright-env-loader.cjs
- required keys: PLAYWRIGHT_USERNAME, PLAYWRIGHT_PASSWORD

## Environment note
If agent runs in Docker and app runs on Windows localhost, use host.docker.internal from container context.
